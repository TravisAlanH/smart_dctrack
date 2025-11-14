import React from "react";
import CameraHome from "../CameraHome";
import "./Modal.css";

export default function CameraModal() {
  return (
    <div id="CameraModal" className="modal">
      <div className="modal-content">
        <CameraHome />
      </div>
    </div>
  );
}
