import React, { useRef, useEffect, useState } from "react";
import { ReuseDataStateStore } from "../../../store/Store";
import { createWorker } from "tesseract.js";

export default function CameraViewORC() {
  const setCameraText = ReuseDataStateStore((s) => s.setCameraText);
  const triggerOcr = ReuseDataStateStore((s) => s.data.OcrTrigger);
  const cameraText = ReuseDataStateStore((s) => s.data.CameraText);
  const setORCCrop = ReuseDataStateStore((s) => s.setORCCrop);
  const CROP_TOP = ReuseDataStateStore((s) => s.data.ORCCropTop);
  const CROP_BOTTOM = ReuseDataStateStore((s) => s.data.ORCCropBottom);
  const CROP_LEFT = ReuseDataStateStore((s) => s.data.ORCCropLeft);
  const CROP_RIGHT = ReuseDataStateStore((s) => s.data.ORCCropRight);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const ocrCanvasRef = useRef(null);
  const workerRef = useRef(null);

  const [isPortrait, setIsPortrait] = useState(false);

  // FIX: orientation detection based on video dimensions (works in iOS PWA)
  function detectOrientation(vw, vh) {
    return vh > vw;
  }

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

      // orientation auto-detect from video itself
      const portrait = detectOrientation(vw, vh);
      if (portrait !== isPortrait) setIsPortrait(portrait);

      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;

      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw;
        canvas.height = ch;
      }

      ctx.clearRect(0, 0, cw, ch);

      if (portrait) {
        const scale = Math.max(ch / vw, cw / vh);
        const drawW = vh * scale;
        const drawH = vw * scale;
        const dx = (cw - drawW) * 0.5;
        const dy = (ch - drawH) * 0.5;

        ctx.save();
        ctx.translate(cw / 2, ch / 2);
        ctx.rotate((-90 * Math.PI) / 180);
        ctx.translate(-ch / 2, -cw / 2);
        ctx.drawImage(video, dx, dy, drawW, drawH);
        ctx.restore();
      } else {
        const scale = Math.max(cw / vw, ch / vh);
        const drawW = vw * scale;
        const drawH = vh * scale;
        const dx = (cw - drawW) * 0.5;
        const dy = (ch - drawH) * 0.5;

        ctx.drawImage(video, dx, dy, drawW, drawH);
      }

      req = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(req);
  }, [isPortrait]);

  useEffect(() => {
    async function setupWorker() {
      workerRef.current = await createWorker("eng");
      await workerRef.current.setParameters({
        tessedit_char_whitelist: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789- ",
        tessedit_pageseg_mode: "7",
        preserve_interword_spaces: "1",
      });
    }
    setupWorker();
  }, []);

  const doOCR = async () => {
    const canvas = canvasRef.current;
    const worker = workerRef.current;

    const cw = canvas.width;
    const ch = canvas.height;

    const x = cw * CROP_LEFT;
    const y = ch * CROP_TOP;
    const w = cw * (CROP_RIGHT - CROP_LEFT);
    const h = ch * (CROP_BOTTOM - CROP_TOP);

    if (!ocrCanvasRef.current) {
      ocrCanvasRef.current = document.createElement("canvas");
    }

    const upscale = 2;
    const ocrCanvas = ocrCanvasRef.current;

    ocrCanvas.width = w * upscale;
    ocrCanvas.height = h * upscale;

    const octx = ocrCanvas.getContext("2d");
    octx.drawImage(canvas, x, y, w, h, 0, 0, w * upscale, h * upscale);

    const img = octx.getImageData(0, 0, ocrCanvas.width, ocrCanvas.height);
    const data = img.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      const value = gray > 140 ? 255 : 0;

      data[i] = value;
      data[i + 1] = value;
      data[i + 2] = value;
    }

    octx.putImageData(img, 0, 0);

    const result = await worker.recognize(ocrCanvas);
    setCameraText(clean(result.data.text));
  };

  useEffect(() => {
    if (!workerRef.current) return;
    doOCR();
  }, [triggerOcr]);

  return (
    <div className="w-full h-full relative bg-black overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block" style={{ pointerEvents: "none" }} />

      <video ref={videoRef} autoPlay playsInline style={{ display: "none" }} />

      <div
        style={{
          position: "absolute",
          top: `${CROP_TOP * 100}%`,
          left: `${CROP_LEFT * 100}%`,
          width: `${(CROP_RIGHT - CROP_LEFT) * 100}%`,
          height: `${(CROP_BOTTOM - CROP_TOP) * 100}%`,
          border: "3px solid red",
          pointerEvents: "none",
          zIndex: 5,
          transform: isPortrait ? "rotate(90deg)" : "none",
          transformOrigin: "center center",
        }}
      />

      {/* Sliders and UI unchanged... */}
    </div>
  );
}

function clean(raw) {
  const first = raw.split("\n")[0] || "";
  return first.replace(/[^A-Za-z0-9\- ]/g, "").trim();
}
