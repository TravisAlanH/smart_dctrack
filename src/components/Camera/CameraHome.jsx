import React from "react";
import CameraViewORC from "./CameraViewORC";
import CameraViewIMG from "./CameraViewIMG";
import { ReuseDataStateStore } from "../../../store/Store";
import AssetTrainer from "./AssetTrainer";
import ORCCam from "./Cams/ORCCam";
import IMGCam from "./Cams/IMGCam";
import AssetTagCam from "./Cams/AssetTagCam";

export default function CameraHome() {
  const cameraStatus = ReuseDataStateStore((s) => s.data.CameraStatus);

  // return cameraStatus === 0 ? <CameraViewORC /> : <AssetTrainer />;
  return cameraStatus === 0 ? <ORCCam /> : cameraStatus === 1 ? <IMGCam /> : <AssetTagCam />;
}
