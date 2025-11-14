import React, { useRef, useEffect, useState } from "react";
import { ReuseDataStateStore } from "../../../store/Store";
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as knn from "@tensorflow-models/knn-classifier";
import * as tf from "@tensorflow/tfjs";

export default function CameraView({ classifier }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cropCanvasRef = useRef(null);
  const normCanvasRef = useRef(null);

  const classifierRef = useRef(classifier);
  const netRef = useRef(null);

  const predictTrigger = ReuseDataStateStore((s) => s.data.PredictTrigger);
  const make = ReuseDataStateStore((s) => s.data.Make);
  const model = ReuseDataStateStore((s) => s.data.Model);
  const setMake = ReuseDataStateStore((s) => s.setMake);
  const setModel = ReuseDataStateStore((s) => s.setModel);

  const RU_MAP = {
    1: { heightVH: "100%", cropTop: 0.3, cropBottom: 0.7 },
    2: { heightVH: "100%", cropTop: 0.25, cropBottom: 0.75 },
    3: { heightVH: "100%", cropTop: 0.2, cropBottom: 0.8 },
    4: { heightVH: "100%", cropTop: 0.15, cropBottom: 0.85 },
    5: { heightVH: "100%", cropTop: 0.2, cropBottom: 0.8 },
  };

  const RATIO_MAP = {
    1: { h: 1.388625, w: 10 },
    2: { h: 2.77725, w: 10 },
    3: { h: 4.165875, w: 10 },
    4: { h: 5.5545, w: 10 },
    5: { h: 6.943125, w: 10 },
  };

  const [ru, setRU] = useState(1);

  // padding in normalized units
  // 0.02 = two percent of the canvas height or width
  const PAD = 0.04;

  const ratio = RATIO_MAP[ru];
  const cropHeight = ratio.h / ratio.w;

  let top = 0.5 - cropHeight / 2;
  let bottom = 0.5 + cropHeight / 2;

  // apply padding
  top = top - PAD;
  bottom = bottom + PAD;

  let left = 0 + PAD;
  let right = 1 - PAD;

  const cropTop = top;
  const cropBottom = bottom;
  const cropLeft = left;
  const cropRight = right;

  useEffect(() => {
    async function loadNet() {
      if (!netRef.current) {
        netRef.current = await mobilenet.load();
      }
    }
    loadNet();
  }, []);

  //MARK: LOAD_TRAINED_DATA
  useEffect(() => {
    const raw = localStorage.getItem("trainedKNN");
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      const restored = knn.create();

      Object.keys(parsed).forEach((label) => {
        const arr = parsed[label].data;
        const size = arr.length / 1024;
        const tensor = tf.tensor2d(arr, [size, 1024]);
        restored.setClass(label, tensor);
      });

      classifierRef.current = restored;
    } catch {}
  }, []);

  useEffect(() => {
    async function startCam() {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      videoRef.current.srcObject = stream;
    }
    startCam();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let req;

    function draw() {
      const vw = video.videoWidth;
      const vh = video.videoHeight;

      if (!vw || !vh) {
        req = requestAnimationFrame(draw);
        return;
      }

      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;

      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw;
        canvas.height = ch;
      }

      ctx.clearRect(0, 0, cw, ch);

      const scale = Math.max(cw / vw, ch / vh);
      const drawW = vw * scale;
      const drawH = vh * scale;
      const dx = (cw - drawW) * 0.5;
      const dy = (ch - drawH) * 0.5;

      ctx.drawImage(video, dx, dy, drawW, drawH);

      const crop = extractCrop();
      const norm = normalizeCrop(crop);
      normCanvasRef.current = norm;

      req = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(req);
  }, [ru]);

  function extractCrop() {
    const full = canvasRef.current;
    const cw = full.width;
    const ch = full.height;

    const x = cw * cropLeft;
    const y = ch * cropTop;
    const w = cw * (cropRight - cropLeft);
    const h = ch * (cropBottom - cropTop);

    if (!cropCanvasRef.current) {
      cropCanvasRef.current = document.createElement("canvas");
    }

    const crop = cropCanvasRef.current;
    crop.width = w;
    crop.height = h;

    const ctx = crop.getContext("2d");
    ctx.drawImage(full, x, y, w, h, 0, 0, w, h);

    return crop;
  }

  function normalizeCrop(cropCanvas) {
    const out = document.createElement("canvas");
    out.width = 224;
    out.height = 224;
    out.getContext("2d").drawImage(cropCanvas, 0, 0, 224, 224);
    return out;
  }

  async function runPredict() {
    if (!netRef.current) return;
    if (!normCanvasRef.current) return;

    const embedding = netRef.current.infer(normCanvasRef.current, "conv_preds");
    const ds = classifierRef.current.getClassifierDataset();
    const keys = Object.keys(ds);
    if (keys.length === 0) return;

    const result = await classifierRef.current.predictClass(embedding);
    const raw = result.label;
    if (!raw) return;

    const parts = raw.split("|||");
    const pm = parts[0] || "";
    const pmodel = parts[1] || "";

    setMake(pm);
    setModel(pmodel);
  }

  async function runTrain() {
    if (!make || !model) return;
    if (!netRef.current) return;
    if (!normCanvasRef.current) return;

    const embedding = netRef.current.infer(normCanvasRef.current, "conv_preds");
    const label = `${make}|||${model}`;
    classifierRef.current.addExample(embedding, label);

    //MARK: SAVE_TRAINED_DATA
    try {
      const ds = classifierRef.current.getClassifierDataset();
      const out = {};

      Object.keys(ds).forEach((label) => {
        const tensor = ds[label];
        const arr = tensor.dataSync();
        out[label] = { data: Array.from(arr) };
      });

      console.log("Saved trained data", out);
      localStorage.setItem("trainedKNN", JSON.stringify(out));
    } catch (e) {
      console.error("Save failed", e);
    }
  }

  useEffect(() => {
    runPredict();
  }, [predictTrigger]);

  return (
    <div className="w-full relative bg-black overflow-hidden" style={{ height: RU_MAP[ru].heightVH }}>
      <canvas ref={canvasRef} className="w-full h-full block" style={{ pointerEvents: "none" }} />

      <video ref={videoRef} autoPlay playsInline style={{ display: "none" }} />

      <div
        style={{
          position: "absolute",
          top: "3%",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 30,
          display: "flex",
          gap: "12px",
          fontWeight: "bold",
          color: "white",
        }}
      >
        <button className="px-4 py-2 bg-slate-200 text-black font-bold rounded-md" onClick={() => setRU(1)}>
          1RU
        </button>
        <button className="px-4 py-2 bg-slate-200 text-black font-bold rounded-md" onClick={() => setRU(2)}>
          2RU
        </button>
        <button className="px-4 py-2 bg-slate-200 text-black font-bold rounded-md" onClick={() => setRU(3)}>
          3RU
        </button>
        <button className="px-4 py-2 bg-slate-200 text-black font-bold rounded-md" onClick={() => setRU(4)}>
          4RU
        </button>
        <button className="px-4 py-2 bg-slate-200 text-black font-bold rounded-md" onClick={() => setRU(5)}>
          5RU
        </button>
      </div>

      <div
        style={{
          position: "absolute",
          top: `${cropTop * 100}%`,
          left: `${cropLeft * 100}%`,
          width: `${(cropRight - cropLeft) * 100}%`,
          height: `${(cropBottom - cropTop) * 100}%`,
          border: "3px solid red",
          pointerEvents: "none",
          zIndex: 10,
        }}
      />
      {/* Action panel */}
      <div
        style={{
          position: "absolute",
          bottom: "6px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 20,
          display: "flex",
          gap: "10px",
          background: "rgba(255,255,255,0.85)",
          padding: "10px",
          borderRadius: "8px",
        }}
      >
        <button onClick={runPredict} className="px-4 py-2 bg-slate-200 font-bold">
          Predict
        </button>

        <input
          type="text"
          placeholder="Make"
          value={make}
          onChange={(e) => setMake(e.target.value)}
          className="px-3 py-2 border border-gray-300"
        />

        <input
          type="text"
          placeholder="Model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="px-3 py-2 border border-gray-300"
        />

        <button onClick={runTrain} className="px-4 py-2 bg-slate-200 font-bold">
          Train
        </button>
      </div>

      {/* Close button OUTSIDE background panel */}
      <button
        onClick={() => {
          document.getElementById("CameraModal").style.display = "none";
        }}
        className="px-4 py-2 bg-slate-200 font-bold"
        style={{
          position: "absolute",
          bottom: "12px",
          right: "12px",
          zIndex: 15,
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(6px)",
          padding: "10px 16px",
          borderRadius: "8px",
          fontWeight: "bold",
        }}
      >
        Close
      </button>
    </div>
  );
}
