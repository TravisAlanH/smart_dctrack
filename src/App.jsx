import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import CameraHome from "./components/Camera/CameraHome";
import { ReuseDataStateStore } from "../store/Store";
// import MicrosoftLogin from "./components/MicrosoftLogin/MicrosoftLogin";

function App() {
  const setCameraText = ReuseDataStateStore((s) => s.setCameraText);
  const cameraText = ReuseDataStateStore((s) => s.data.CameraText);
  const setOcrTrigger = ReuseDataStateStore((s) => s.setORCTrigger);
  const ocrTrigger = ReuseDataStateStore((s) => s.data.OcrTrigger);
  const setCameraStatus = ReuseDataStateStore((s) => s.setCameraStatus);

  const handleManual = (e) => {
    setCameraText(e.target.value);
  };

  const runCameraOcr = () => {
    setOcrTrigger((n) => n + 1);
  };

  return (
    <div className="App w-screen h-screen flex flex-col">
      <CameraHome />

      <div className="w-full h-[5%] flex flex-row justify-center items-center text-2xl font-bold gap-3">
        <buttom className="bg-slate-200 rounded-md px-3 " onClick={() => setCameraStatus(0)}>
          orc
        </buttom>
        <buttom className="bg-slate-200 rounded-md px-3 " onClick={() => setCameraStatus(1)}>
          IMG
        </buttom>
      </div>

      <div className="w-full flex flex-col gap-2 px-4 mt-4">
        <label className="text-lg font-semibold">Camera Text</label>

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
