import React from "react";
import CameraViewORC from "./CameraViewORC";
import CameraViewIMG from "./CameraViewIMG";
import { ReuseDataStateStore } from "../../../store/Store";

export default function CameraHome() {
  const cameraStatus = ReuseDataStateStore((s) => s.data.CameraStatus);

  return cameraStatus === 1 ? <CameraViewIMG /> : <CameraViewORC />;
}
