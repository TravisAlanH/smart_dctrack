import React, { useRef, useEffect, useState } from "react";
import { ReuseDataStateStore } from "../../../store/Store";
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as knn from "@tensorflow-models/knn-classifier";

export default function CameraView({ classifier, net }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cropCanvasRef = useRef(null);
  const normCanvasRef = useRef(null);
  const classifierRef = useRef(classifier);

  // const classifierRef = useRef(knn.create());
  const netRef = useRef(null);

  const predictTrigger = ReuseDataStateStore((s) => s.data.PredictTrigger);
  const setMake = ReuseDataStateStore((s) => s.setMake);
  const setModel = ReuseDataStateStore((s) => s.setModel);

  const RU_MAP = {
    1: { heightVH: "12vh", cropTop: 0.3, cropBottom: 0.7 },
    2: { heightVH: "18vh", cropTop: 0.25, cropBottom: 0.75 },
    3: { heightVH: "24vh", cropTop: 0.2, cropBottom: 0.8 },
    4: { heightVH: "30vh", cropTop: 0.15, cropBottom: 0.85 },
  };

  const [ru, setRU] = useState(1);

  const cropTop = RU_MAP[ru].cropTop;
  const cropBottom = RU_MAP[ru].cropBottom;
  const cropLeft = 0.1;
  const cropRight = 0.9;

  const sizeFactor = 3.2;

  useEffect(() => {
    async function loadNet() {
      if (!netRef.current) {
        const m = await mobilenet.load();
        netRef.current = m;
      }
    }
    loadNet();
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

      const drawW = vw * scale * sizeFactor;
      const drawH = vh * scale * sizeFactor;

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
    const ctx = out.getContext("2d");
    ctx.drawImage(cropCanvas, 0, 0, 224, 224);
    return out;
  }

  async function runPredict() {
    if (!netRef.current) return;
    if (!normCanvasRef.current) return;

    console.log(classifierRef);

    const embedding = netRef.current.infer(normCanvasRef.current, "conv_preds");

    const ds = classifierRef.current.getClassifierDataset();
    const labelKeys = Object.keys(ds);

    if (labelKeys.length === 0) return;

    const result = await classifierRef.current.predictClass(embedding);
    const raw = result.label;
    if (!raw) return;

    const parts = raw.split("|||");
    const make = parts[0] || "";
    const model = parts[1] || "";

    setMake(make);
    setModel(model);
  }

  useEffect(() => {
    runPredict();
  }, [predictTrigger]);

  return (
    <div className="w-full">
      <div className="mb-2 flex gap-2">
        <button onClick={() => setRU(1)}>1RU</button>
        <button onClick={() => setRU(2)}>2RU</button>
        <button onClick={() => setRU(3)}>3RU</button>
        <button onClick={() => setRU(4)}>4RU</button>
      </div>

      <div className="w-full relative bg-black overflow-hidden" style={{ height: RU_MAP[ru].heightVH }}>
        <canvas ref={canvasRef} className="w-full h-full block" />
        <video ref={videoRef} autoPlay playsInline style={{ display: "none" }} />

        <div
          style={{
            position: "absolute",
            top: `${cropTop * 100}%`,
            left: `${cropLeft * 100}%`,
            width: `${(cropRight - cropLeft) * 100}%`,
            height: `${cropBottom * 100 - cropTop * 100}%`,
            border: "3px solid red",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
}
