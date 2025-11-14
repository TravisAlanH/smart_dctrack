import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import CameraHome from "./components/Camera/CameraHome";
import { ReuseDataStateStore } from "../store/Store";
import CameraModal from "./components/Camera/CameraModal/CameraModal";
// import MicrosoftLogin from "./components/MicrosoftLogin/MicrosoftLogin";

function App() {
  const setCameraText = ReuseDataStateStore((s) => s.setCameraText);
  const cameraText = ReuseDataStateStore((s) => s.data.CameraText);
  const setOcrTrigger = ReuseDataStateStore((s) => s.setORCTrigger);
  const ocrTrigger = ReuseDataStateStore((s) => s.data.OcrTrigger);
  const setCameraStatus = ReuseDataStateStore((s) => s.setCameraStatus);
  const setPredictTrigger = ReuseDataStateStore((s) => s.setPredictTrigger);
  const setMake = ReuseDataStateStore((s) => s.setMake);
  const setModel = ReuseDataStateStore((s) => s.setModel);
  const make = ReuseDataStateStore((s) => s.data.Make);
  const model = ReuseDataStateStore((s) => s.data.Model);

  const handleManual = (e) => {
    setCameraText(e.target.value);
  };

  const handleManualMake = (e) => {
    setMake(e.target.value);
  };

  const handleManualModel = (e) => {
    setModel(e.target.value);
  };

  const runCameraOcr = () => {
    setOcrTrigger((n) => n + 1);
  };

  const runPredictTrigger = () => {
    setPredictTrigger((n) => n + 1);
  };

  function setOpenCameraSet(camIndex) {
    setCameraStatus(camIndex);
  }

  return (
    <div className="App w-screen h-screen flex flex-col">
      <CameraModal />

      <div className="w-full h-[5%] flex flex-row justify-center items-center text-2xl font-bold gap-3">
        <button
          className="bg-slate-200 rounded-md px-3 "
          onClick={() => {
            setOpenCameraSet(0);
            document.getElementById("CameraModal").style.display = "block";
          }}
        >
          orce
        </button>
        <button
          className="bg-slate-200 rounded-md px-3 "
          onClick={() => {
            setOpenCameraSet(1);
            document.getElementById("CameraModal").style.display = "block";
          }}
        >
          IMG
        </button>
      </div>

      <div className="w-full flex flex-col gap-2 px-4 mt-4">
        <label className="text-lg font-semibold">Prediction</label>
        <div className="flex flex-row">
          <input
            type="text"
            value={make}
            onChange={handleManualMake}
            className="border border-gray-400 rounded px-2 py-1 text-lg"
          />
          <input
            type="text"
            value={model}
            onChange={handleManualModel}
            className="border border-gray-400 rounded px-2 py-1 text-lg"
          />
        </div>

        <button onClick={runPredictTrigger} className="bg-blue-600 text-white px-4 py-2 rounded text-lg">
          Predict From Camera
        </button>
      </div>

      <div className="w-full flex flex-col gap-2 px-4 mt-4">
        <label className="text-lg font-semibold">TextORC</label>

        <input
          type="text"
          value={cameraText}
          onChange={handleManual}
          className="border border-gray-400 rounded px-2 py-1 text-lg"
        />

        <button onClick={runCameraOcr} className="bg-blue-600 text-white px-4 py-2 rounded text-lg">
          Read From Camera
        </button>
      </div>
    </div>
  );
}

export default App;
