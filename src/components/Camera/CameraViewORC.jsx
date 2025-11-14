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

  useEffect(() => {
    function update() {
      setIsPortrait(window.matchMedia("(orientation: portrait)").matches);
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
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

      if (isPortrait) {
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

      {/* Top slider */}
      <div
        style={{
          position: "absolute",
          top: "5%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "60%",
          zIndex: 20,
        }}
      >
        <input
          type="range"
          min="0.05"
          max="1"
          step="0.005"
          style={{ width: "100%" }}
          value={CROP_RIGHT - CROP_LEFT}
          onChange={(e) => {
            const w = parseFloat(e.target.value);
            const center = 0.5;
            const left = center - w / 2;
            const right = center + w / 2;
            setORCCrop(CROP_TOP, CROP_BOTTOM, left, right);
          }}
        />
      </div>

      {/* Right slider */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "95%",
          transform: "translateY(-50%)",
          height: "60%",
          display: "flex",
          alignItems: "center",
          zIndex: 20,
        }}
      >
        <input
          type="range"
          orient="vertical"
          min="0.05"
          max="1"
          step="0.005"
          style={{ height: "100%" }}
          value={CROP_BOTTOM - CROP_TOP}
          onChange={(e) => {
            const h = parseFloat(e.target.value);
            const center = 0.5;
            const top = center - h / 2;
            const bottom = center + h / 2;
            setORCCrop(top, bottom, CROP_LEFT, CROP_RIGHT);
          }}
        />
      </div>

      {/* Glass panel */}
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          left: "25%",
          transform: "translateX(-50%)",
          zIndex: 10,
          display: "flex",
          gap: "10px",
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(6px)",
          padding: "10px",
          borderRadius: "8px",
        }}
      >
        <button className="px-5 py-3 font-bold bg-slate-200 rounded" onClick={doOCR}>
          SCAN TEXT
        </button>

        <input type="text" value={cameraText} className="px-5 py-3 font-bold rounded border border-slate-300 bg-white" />
      </div>

      {/* Close button */}
      <button
        onClick={() => {
          document.getElementById("CameraModal").style.display = "none";
        }}
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

function clean(raw) {
  const first = raw.split("\n")[0] || "";
  return first.replace(/[^A-Za-z0-9\- ]/g, "").trim();
}
