import React, { useEffect, useState } from "react";
import CameraHome from "../CameraHome";
import "./Modal.css";

export default function CameraModal() {
  const [rotated, setRotated] = useState(true);

  useEffect(() => {
    function checkOrientation() {
      const isLandscape = window.innerWidth > window.innerHeight;
      setRotated(isLandscape);
    }

    checkOrientation();

    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);

    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
    };
  }, []);

  return (
    <div id="CameraModal" className="modal h-full">
      <div className="modal-content">
        {!rotated && (
          <div
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              width: "100%",
              height: "100%",
              background: "rgba(0,0,0,0.95)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              zIndex: 9999,
            }}
          >
            rotate your device
          </div>
        )}

        <CameraHome />
      </div>
    </div>
  );
}
