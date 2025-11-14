import React, { useState, useRef } from "react";

import * as mobilenet from "@tensorflow-models/mobilenet";
import * as knn from "@tensorflow-models/knn-classifier";
import CameraView from "./CameraViewIMG";
import TrainPanel from "./TrainPanel";

export default function AssetTrainer() {
  const [normCrop, setNormCrop] = useState(null);
  const [version, setVersion] = useState(0);

  const classifierRef = useRef(knn.create());
  const netRef = useRef(null);

  async function loadModel() {
    if (!netRef.current) {
      netRef.current = await mobilenet.load();
    }
  }

  function onCropReady(canvas) {
    setNormCrop(canvas);
  }

  async function handleTrain(label) {
    if (!normCrop) return;

    await loadModel();

    const embedding = netRef.current.infer(normCrop, "conv_preds");
    classifierRef.current.addExample(embedding, label);

    setVersion((v) => v + 1);
  }

  return (
    <div className="w-full">
      <CameraView classifier={classifierRef.current} net={netRef.current} />

      <TrainPanel classifier={classifierRef.current} onTrain={handleTrain} version={version} />
    </div>
  );
}
