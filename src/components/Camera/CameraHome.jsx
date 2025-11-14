import React from "react";
import CameraViewORC from "./CameraViewORC";
import CameraViewIMG from "./CameraViewIMG";
import { ReuseDataStateStore } from "../../../store/Store";
import AssetTrainer from "./AssetTrainer";

export default function CameraHome() {
  const cameraStatus = ReuseDataStateStore((s) => s.data.CameraStatus);

  return cameraStatus === 0 ? <CameraViewORC /> : <AssetTrainer />;
}
