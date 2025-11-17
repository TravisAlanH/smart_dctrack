import React, { useRef, useEffect, useState } from "react";
import jsQR from "jsqr";
import { ReuseDataStateStore } from "../../../../store/Store";

export default function QRScanBox() {
  const videoRef = useRef(null);
  const boxCanvasRef = useRef(null);
  const containerRef = useRef(null);
  const result = ReuseDataStateStore((s) => s.data.AssetTag);
  const setAssetTag = ReuseDataStateStore((s) => s.setAssetTag);

  const [devices, setDevices] = useState([]);
  const index = ReuseDataStateStore((s) => s.data.CameraIndex);
  const setIndex = ReuseDataStateStore((s) => s.setCameraIndex);
  const hasPermission = ReuseDataStateStore((s) => s.data.CameraPermission);
  const setHasPermission = ReuseDataStateStore((s) => s.setCameraPermission);
  const [boxStyle, setBoxStyle] = useState({});

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

    const v = videoRef.current;
    v.srcObject = stream;
    v.setAttribute("playsinline", true);

    v.onloadedmetadata = () => {
      v.play();
      updateBox();
    };
  }

  function nextCamera() {
    if (devices.length === 0) return;
    const next = (index + 1) % devices.length;
    setIndex(next);
    startCamera(devices[next].deviceId);
  }

  async function getPermission() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });

      const v = videoRef.current;
      v.srcObject = stream;
      v.setAttribute("playsinline", true);

      v.onloadedmetadata = () => {
        v.play();
        updateBox();
      };

      setHasPermission(true);
    } catch {
      setHasPermission(false);
    }
  }

  useEffect(() => {
    loadDevices();
    getPermission();
  }, []);

  useEffect(() => {
    if (!hasPermission) return;
    if (devices.length === 0) return;
    startCamera(devices[index].deviceId);
  }, [devices, hasPermission, index]);

  function updateBox() {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    const vw = video.videoWidth;
    const vh = video.videoHeight;
    if (!vw || !vh) return;

    const cw = container.clientWidth;
    const ch = container.clientHeight;

    const videoAspect = vw / vh;
    const containerAspect = cw / ch;

    let drawW;
    let drawH;
    let offX;
    let offY;

    if (videoAspect > containerAspect) {
      drawH = ch;
      drawW = ch * videoAspect;
      offX = (drawW - cw) / 2;
      offY = 0;
    } else {
      drawW = cw;
      drawH = cw / videoAspect;
      offX = 0;
      offY = (drawH - ch) / 2;
    }

    const size = Math.min(drawW, drawH) * 0.6;

    const left = (cw - size) / 2;
    const top = (ch - size) / 2;

    setBoxStyle({
      position: "absolute",
      left: left + "px",
      top: top + "px",
      width: size + "px",
      height: size + "px",
      border: "3px solid red",
      pointerEvents: "none",
      zIndex: 15,
      boxSizing: "border-box",
    });
  }

  useEffect(() => {
    const id = setInterval(updateBox, 150);
    return () => clearInterval(id);
  }, []);

  async function scanBox() {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0) return;

    const vw = video.videoWidth;
    const vh = video.videoHeight;

    const size = Math.min(vw, vh) * 0.6;
    const x = (vw - size) / 2;
    const y = (vh - size) / 2;

    const boxCanvas = boxCanvasRef.current;
    boxCanvas.width = size;
    boxCanvas.height = size;

    const bctx = boxCanvas.getContext("2d");

    bctx.drawImage(video, x, y, size, size, 0, 0, size, size);

    const img = bctx.getImageData(0, 0, size, size);
    const code = jsQR(img.data, img.width, img.height);

    if (code) setAssetTag(code.data);
    else setAssetTag("No match");
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
          <button className="py-3 px-5 rounded-md bg-slate-800 text-lg font-bold" onClick={scanBox}>
            Scan
          </button>

          <input
            className="text-black text-lg rounded-md px-1"
            type="text"
            value={result}
            onChange={(e) => setAssetTag(e.target.value)}
          />
        </div>
      </div>

      <div style={boxStyle} />

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

      <canvas ref={boxCanvasRef} style={{ display: "none" }} />
    </div>
  );
}
