import React, { useRef, useEffect, useState } from "react";
import { ReuseDataStateStore } from "../../../../store/Store";
import { createWorker } from "tesseract.js";

export default function ORCCam() {
  const cameraText = ReuseDataStateStore((s) => s.data.CameraText);
  const setCameraText = ReuseDataStateStore((s) => s.setCameraText);

  const ORCCropTop = ReuseDataStateStore((s) => s.data.ORCCropTop);
  const ORCCropBottom = ReuseDataStateStore((s) => s.data.ORCCropBottom);
  const ORCCropLeft = ReuseDataStateStore((s) => s.data.ORCCropLeft);
  const ORCCropRight = ReuseDataStateStore((s) => s.data.ORCCropRight);
  const hasPermission = ReuseDataStateStore((s) => s.data.CameraPermission);
  const setHasPermission = ReuseDataStateStore((s) => s.setCameraPermission);

  const setORCCRop = ReuseDataStateStore((s) => s.setORCCrop);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const readCanvasRef = useRef(null);
  const containerRef = useRef(null);
  const workerRef = useRef(null);

  const [devices, setDevices] = useState([]);
  const index = ReuseDataStateStore((s) => s.data.CameraIndex);
  const setIndex = ReuseDataStateStore((s) => s.setCameraIndex);

  function getCoverMapping(video, container) {
    const vw = video.videoWidth;
    const vh = video.videoHeight;
    const cw = container.clientWidth;
    const ch = container.clientHeight;

    const videoAspect = vw / vh;
    const containerAspect = cw / ch;

    let drawWidth;
    let drawHeight;
    let offsetX;
    let offsetY;

    if (videoAspect > containerAspect) {
      drawHeight = ch;
      drawWidth = ch * videoAspect;
      offsetX = (drawWidth - cw) / 2;
      offsetY = 0;
    } else {
      drawWidth = cw;
      drawHeight = cw / videoAspect;
      offsetX = 0;
      offsetY = (drawHeight - ch) / 2;
    }

    return { drawWidth, drawHeight, offsetX, offsetY };
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

  useEffect(() => {
    loadDevices();
  }, []);

  useEffect(() => {
    if (!hasPermission) return;
    if (devices.length === 0) return;
    startCamera(devices[index].deviceId);
  }, [devices, hasPermission]);

  async function readText() {
    const video = videoRef.current;
    const baseCanvas = canvasRef.current;
    if (!video || !baseCanvas) return;

    if (video.videoWidth === 0) {
      await new Promise((r) => {
        video.onloadedmetadata = r;
      });
    }

    const vw = video.videoWidth;
    const vh = video.videoHeight;

    baseCanvas.width = vw;
    baseCanvas.height = vh;

    const bctx = baseCanvas.getContext("2d");
    bctx.drawImage(video, 0, 0, vw, vh);

    const x = vw * ORCCropLeft;
    const y = vh * ORCCropTop;
    const w = vw * (ORCCropRight - ORCCropLeft);
    const h = vh * (ORCCropBottom - ORCCropTop);

    if (!readCanvasRef.current) {
      readCanvasRef.current = document.createElement("canvas");
    }

    const ocrCanvas = readCanvasRef.current;
    const upscale = 2;

    ocrCanvas.width = w * upscale;
    ocrCanvas.height = h * upscale;

    const octx = ocrCanvas.getContext("2d");
    octx.drawImage(baseCanvas, x, y, w, h, 0, 0, w * upscale, h * upscale);

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

    const worker = await createWorker("eng");
    const out = await worker.recognize(ocrCanvas);
    await worker.terminate();

    setCameraText(out.data.text.trim());
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

  let redBoxStyle = {};
  if (videoRef.current && containerRef.current && videoRef.current.videoWidth > 0) {
    const container = containerRef.current;
    const video = videoRef.current;

    const { drawWidth, drawHeight, offsetX, offsetY } = getCoverMapping(video, container);

    const cw = container.clientWidth;
    const ch = container.clientHeight;

    const visibleLeft = ORCCropLeft * drawWidth - offsetX;
    const visibleTop = ORCCropTop * drawHeight - offsetY;
    const visibleWidth = (ORCCropRight - ORCCropLeft) * drawWidth;
    const visibleHeight = (ORCCropBottom - ORCCropTop) * drawHeight;

    redBoxStyle = {
      position: "absolute",
      top: visibleTop + "px",
      left: visibleLeft + "px",
      width: visibleWidth + "px",
      height: visibleHeight + "px",
      border: "3px solid red",
      boxSizing: "border-box",
      pointerEvents: "none",
      zIndex: 15,
    };
  }

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <button
        onClick={nextCamera}
        style={{
          position: "absolute",
          zIndex: 20,
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
          zIndex: 20,
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
          bottom: 10,
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(0,0,0,0.3)",
          color: "white",
          padding: "6px 10px",
          borderRadius: "4px",
          fontSize: "14px",
          zIndex: 20,
        }}
      >
        <div className="flex flex-row gap-2">
          <button className="py-3 px-5 rounded-md bg-slate-800 text-lg font-bold" onClick={readText}>
            Read
          </button>

          <input
            className="text-black text-lg rounded-md px-1"
            type="text"
            value={cameraText}
            onChange={(e) => setCameraText(e.target.value)}
          />
        </div>
      </div>

      <input
        type="range"
        min="0.1"
        max="0.9"
        step="0.01"
        value={ORCCropRight - ORCCropLeft}
        onChange={(e) => {
          const size = Number(e.target.value);
          const center = 0.5;
          const half = size / 2;
          setORCCRop(ORCCropTop, ORCCropBottom, center - half, center + half);
        }}
        style={{
          position: "absolute",
          top: 120,
          left: "50%",
          transform: "translateX(-50%)",
          width: "60%",
          zIndex: 30,
        }}
      />

      <input
        type="range"
        min="0.1"
        max="0.9"
        step="0.01"
        value={ORCCropBottom - ORCCropTop}
        onChange={(e) => {
          const size = Number(e.target.value);
          const center = 0.5;
          const half = size / 2;
          setORCCRop(center - half, center + half, ORCCropLeft, ORCCropRight);
        }}
        style={{
          position: "absolute",
          bottom: 120,
          left: "50%",
          transform: "translateX(-50%)",
          width: "60%",
          zIndex: 30,
        }}
      />

      <div style={redBoxStyle}></div>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          backgroundColor: "black",
        }}
      />

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}
