import React, { useRef, useEffect, useState } from "react";
import { ReuseDataStateStore } from "../../../../store/Store";
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as knn from "@tensorflow-models/knn-classifier";
import * as tf from "@tensorflow/tfjs";

export default function CameraViewTF() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cropCanvasRef = useRef(null);
  const normCanvasRef = useRef(null);
  const containerRef = useRef(null);

  const classifierRef = useRef(null);
  const netRef = useRef(null);

  const [devices, setDevices] = useState([]);
  const index = ReuseDataStateStore((s) => s.data.CameraIndex);
  const setIndex = ReuseDataStateStore((s) => s.setCameraIndex);
  const hasPermission = ReuseDataStateStore((s) => s.data.CameraPermission);
  const setHasPermission = ReuseDataStateStore((s) => s.setCameraPermission);

  const setAPIPayloadHolder = APIStore((s) => s.setAPIPayloadHolder);
  const objectType = ReuseDataStateStore((s) => s.data.CameraRequiredToProcess.type);
  const label = ReuseDataStateStore((s) => s.data.CameraRequiredToProcess.field);

  const make = ReuseDataStateStore((s) => s.data.Make);
  const model = ReuseDataStateStore((s) => s.data.Model);
  const setMake = ReuseDataStateStore((s) => s.setMake);
  const setModel = ReuseDataStateStore((s) => s.setModel);
  const trigger = ReuseDataStateStore((s) => s.data.PredictTrigger);

  const [ru, setRU] = useState(1);

  const RATIO_MAP = {
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
  };

  function getCropValues(cw, ch) {
    const units = RATIO_MAP[ru];

    const SCALE = 0.7; // smaller box
    const targetHeightPx = cw * ((units * 1.75) / 19) * SCALE;

    const hRatio = targetHeightPx / ch;

    let top = 0.5 - hRatio / 2;
    let bottom = 0.5 + hRatio / 2;

    const PAD = 0.01;
    top = top - PAD;
    bottom = bottom + PAD;

    const left = PAD;
    const right = 1 - PAD;

    return { top, bottom, left, right };
  }

  async function getPermission() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
      setHasPermission(true);
    } catch {
      setHasPermission(false);
    }
  }

  async function loadDevices() {
    const list = await navigator.mediaDevices.enumerateDevices();
    const cams = list.filter((d) => d.kind === "videoinput");
    setDevices(cams);
  }

  async function startCamera(deviceId) {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { deviceId },
      audio: false,
    });
    if (videoRef.current) videoRef.current.srcObject = stream;
  }

  function nextCamera() {
    if (devices.length === 0) return;
    const next = (index + 1) % devices.length;
    setIndex(next);
    startCamera(devices[next].deviceId);
  }

  useEffect(() => {
    loadDevices();
  }, []);

  useEffect(() => {
    if (!hasPermission) return;
    if (devices.length === 0) return;
    startCamera(devices[index].deviceId);
  }, [devices, hasPermission, index]);

  useEffect(() => {
    async function loadNet() {
      if (!netRef.current) netRef.current = await mobilenet.load();
    }
    loadNet();
  }, []);

  useEffect(() => {
    const raw = localStorage.getItem("trainedKNN");
    if (!raw) {
      classifierRef.current = knn.create();
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      const restored = knn.create();
      Object.keys(parsed).forEach((label) => {
        const arr = parsed[label].data;
        const size = arr.length / 1024;
        const t = tf.tensor2d(arr, [size, 1024]);
        restored.setClass(label, t);
      });
      classifierRef.current = restored;
    } catch {
      classifierRef.current = knn.create();
    }
  }, []);

  function extractCrop() {
    const full = canvasRef.current;
    if (!full) return null;

    const cw = full.width;
    const ch = full.height;

    const { top, bottom, left, right } = getCropValues(cw, ch);

    const x = cw * left;
    const y = ch * top;
    const w = cw * (right - left);
    const h = ch * (bottom - top);

    if (!cropCanvasRef.current) cropCanvasRef.current = document.createElement("canvas");

    const crop = cropCanvasRef.current;
    crop.width = w;
    crop.height = h;

    const ctx = crop.getContext("2d");
    ctx.drawImage(full, x, y, w, h, 0, 0, w, h);

    return crop;
  }

  function normalizeCrop(crop) {
    if (!crop) return null;
    const out = document.createElement("canvas");
    out.width = 224;
    out.height = 224;
    out.getContext("2d").drawImage(crop, 0, 0, 224, 224);
    return out;
  }

  async function runPredict() {
    if (!netRef.current) return;
    if (!normCanvasRef.current) return;
    if (!classifierRef.current) return;

    const emb = netRef.current.infer(normCanvasRef.current, "conv_preds");
    const ds = classifierRef.current.getClassifierDataset();
    const keys = Object.keys(ds);
    if (keys.length === 0) return;

    const out = await classifierRef.current.predictClass(emb);
    const raw = out.label;
    if (!raw) return;

    const parts = raw.split("|||");
    setMake(parts[0] || "");
    setAPIPayloadHolder({ type: objectType, field: "Make ", value: parts[0] || "" });
    setModel(parts[1] || "");
    setAPIPayloadHolder({ type: objectType, field: "Model ", value: parts[1] || "" });
  }

  async function runTrain() {
    if (!make || !model) return;
    if (!netRef.current) return;
    if (!normCanvasRef.current) return;

    const emb = netRef.current.infer(normCanvasRef.current, "conv_preds");
    const key = `${make}|||${model}`;
    classifierRef.current.addExample(emb, key);

    const ds = classifierRef.current.getClassifierDataset();
    const out = {};

    Object.keys(ds).forEach((k) => {
      const t = ds[k];
      const arr = t.dataSync();
      out[k] = { data: Array.from(arr) };
    });
    console.log(out);
    localStorage.setItem("trainedKNN", JSON.stringify(out));
  }

  useEffect(() => {
    runPredict();
  }, [trigger]);

  useEffect(() => {
    if (!hasPermission) return;

    let req;

    function draw() {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!video || !canvas || !container) {
        req = requestAnimationFrame(draw);
        return;
      }

      const vw = video.videoWidth;
      const vh = video.videoHeight;
      if (!vw || !vh) {
        req = requestAnimationFrame(draw);
        return;
      }

      const cw = container.clientWidth || 1;
      const ch = container.clientHeight || 1;

      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw;
        canvas.height = ch;
      }

      const videoAspect = vw / vh;
      const containerAspect = cw / ch;

      let dW;
      let dH;
      let oX;
      let oY;

      if (videoAspect > containerAspect) {
        dH = ch;
        dW = ch * videoAspect;
        oX = (dW - cw) / 2;
        oY = 0;
      } else {
        dW = cw;
        dH = cw / videoAspect;
        oX = 0;
        oY = (dH - ch) / 2;
      }

      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(video, -oX, -oY, dW, dH);

      const crop = extractCrop();
      const norm = normalizeCrop(crop);
      if (norm) normCanvasRef.current = norm;

      req = requestAnimationFrame(draw);
    }

    draw();
    return () => {
      if (req) cancelAnimationFrame(req);
    };
  }, [hasPermission, ru]);

  let redBox = {};
  if (canvasRef.current) {
    const cw = canvasRef.current.width;
    const ch = canvasRef.current.height;

    const { top, bottom, left, right } = getCropValues(cw, ch);

    redBox = {
      position: "absolute",
      top: top * ch + "px",
      left: left * cw + "px",
      width: (right - left) * cw + "px",
      height: (bottom - top) * ch + "px",
      border: "3px solid red",
      pointerEvents: "none",
      zIndex: 15,
      boxSizing: "border-box",
    };
  }

  if (!hasPermission) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "black",
          color: "white",
        }}
      >
        <button
          onClick={async () => {
            await getPermission();
            await loadDevices();
          }}
          style={{
            padding: "14px 24px",
            background: "white",
            color: "black",
            border: "none",
            borderRadius: "6px",
            fontSize: "18px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Enable Camera
        </button>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        position: "relative",
        background: "black",
      }}
    >
      <button
        onClick={nextCamera}
        style={{
          position: "absolute",
          zIndex: 25,
          top: 10,
          left: 10,
          padding: "8px 12px",
          background: "black",
          color: "white",
          border: "1px solid white",
          borderRadius: "4px",
        }}
      >
        {devices[index]?.label || "Loading"}
      </button>

      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          background: "black",
          color: "white",
          padding: "6px 10px",
          borderRadius: "4px",
          fontSize: "14px",
          zIndex: 25,
        }}
      >
        <button
          onClick={() => {
            document.getElementById("CameraModal").style.display = "none";
          }}
        >
          Close
        </button>
      </div>

      <div
        style={{
          position: "absolute",
          top: 60,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 25,
          display: "flex",
          gap: "10px",
        }}
      >
        <button onClick={() => setRU(1)} className="px-4 py-2 bg-slate-200 text-black font-bold rounded-md">
          1RU
        </button>
        <button onClick={() => setRU(2)} className="px-4 py-2 bg-slate-200 text-black font-bold rounded-md">
          2RU
        </button>
        <button onClick={() => setRU(3)} className="px-4 py-2 bg-slate-200 text-black font-bold rounded-md">
          3RU
        </button>
        <button onClick={() => setRU(4)} className="px-4 py-2 bg-slate-200 text-black font-bold rounded-md">
          4RU
        </button>
        <button onClick={() => setRU(5)} className="px-4 py-2 bg-slate-200 text-black font-bold rounded-md">
          5RU
        </button>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 10,
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(0,0,0,0.3)",
          color: "white",
          padding: "6px 10px",
          borderRadius: "4px",
          fontSize: "14px",
          zIndex: 25,
        }}
      >
        <div className="flex flex-row gap-2 justify-center">
          <button className="py-3 px-5 rounded-md bg-slate-800 text-lg font-bold" onClick={runPredict}>
            Predict
          </button>
          <div className="flex flex-col w-[40%] gap-2">
            <input
              type="text"
              className="text-black text-lg rounded-md px-1"
              value={make}
              onChange={(e) => setMake(e.target.value)}
              placeholder="Make"
            />

            <input
              type="text"
              className="text-black text-lg rounded-md px-1"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="Model"
            />
          </div>
          <button className="py-3 px-5 rounded-md bg-slate-800 text-lg font-bold" onClick={runTrain}>
            Train
          </button>
        </div>
      </div>

      <div style={redBox}></div>

      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 2,
        }}
      />

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          backgroundColor: "black",
          zIndex: 1,
        }}
      />
    </div>
  );
}
