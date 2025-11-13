import React, { useRef, useEffect } from "react";
import { ReuseDataStateStore } from "../../../store/Store";

export default function CameraView() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const CROP_TOP = 0.1;
  const CROP_BOTTOM = 0.65;
  const CROP_LEFT = 0.18;
  const CROP_RIGHT = 0.8;
  const sizeFactor = 3.2;

  useEffect(() => {
    async function startCam() {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      videoRef.current.srcObject = stream;
    }
    startCam();
  }, []);

  // Draw without forced rotation
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

      req = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(req);
  }, []);

  return (
    <div className="w-full h-[15vh] relative bg-black overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block" />

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
        }}
      />
    </div>
  );
}
