import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import CameraHome from "./components/Camera/CameraHome";
import { ReuseDataStateStore } from "../store/Store";
import CameraModal from "./components/Camera/CameraModal/CameraModal";
import { header, headerTypes, headerDescriptions } from "./components/Helpers/HeadersAsObjects";

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

  console.log(header["Cabinets"]);

  const [ObjectFull, setObjectFull] = useState(header["Cabinets"]);
  const [ObjectType, setObjectType] = useState("Cabinets");

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
          ORC
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
        <button
          className="bg-slate-200 rounded-md px-3 "
          onClick={() => {
            setOpenCameraSet(2);
            document.getElementById("CameraModal").style.display = "block";
          }}
        >
          Asset
        </button>
      </div>
      {/* 
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
        </button> */}
      {/* </div> */}
      <div className="w-full flex flex-col gap-2 px-4">
        <select className="px-2 py-1">
          <option>Select Object</option>
          {Object.keys(header).map((option, index) => {
            return (
              <option
                key={index}
                value={option}
                onClick={() => {
                  setObjectFull(header[option]);
                  setObjectType(option);
                }}
              >
                {option}
              </option>
            );
          })}
        </select>
      </div>
      <div className="w-full h-[95%] flex flex-col gap-3 mt-4">
        {Object.keys(ObjectFull).map((header, index) => {
          console.log(headerTypes[ObjectType][header]);
          switch (headerTypes[ObjectType][header]) {
            case "Operation":
              return <OperationInput key={index} header={header} />;
            case "Object":
              return <ObjectInput key={index} header={header} />;
            case "Number":
              return <NumberInput key={index} header={header} />;
            case "ORC":
              return <ORCInput key={index} header={header} />;
            case "IMG":
              return <IMGInput key={index} header={header} />;
            case "QR":
              return <QRInput key={index} header={header} />;
            default:
              console.log("default");
              return <InputBasic key={index} header={header} />;
          }
        })}
      </div>
    </div>
  );
}

function InputBasic({ header }) {
  return (
    <div key={header} className="w-full flex flex-col gap-2 px-4">
      <input type="text" placeholder={header} className="border border-gray-400 rounded px-2 py-1 text-lg" />
    </div>
  );
}

function OperationInput({ header }) {
  return (
    <div key={header} className="w-full flex flex-col gap-2 px-4">
      <select className="px-2 py-1">
        <option value="Add">Add</option>
        <option value="Edit">Edit</option>
        <option value="Delete">Delete</option>
      </select>
    </div>
  );
}

function ObjectInput({ header }) {
  return (
    <div key={header} className="w-full flex flex-col gap-2 px-4">
      <input type="text" value={header} className="border border-gray-400 rounded px-2 py-1 text-lg" />
    </div>
  );
}

function NumberInput({ header }) {
  return (
    <div key={header} className="w-full flex flex-col gap-2 px-4">
      <input type="number" value={0} className="border border-gray-400 rounded px-2 py-1 text-lg" />
    </div>
  );
}

function ORCInput({ header }) {
  return (
    <div key={header} className="w-full flex flex-row gap-2 px-4">
      <input type="text" value={header} className="border border-gray-400 rounded px-2 py-1 text-lg w-[80%]" />
      <button className="bg-blue-600 text-white w-[20%] rounded text-lg">Read</button>
    </div>
  );
}

function IMGInput({ header }) {
  return (
    <div key={header} className="w-full flex flex-row gap-2 px-4">
      <input type="text" value={header} className="border border-gray-400 rounded px-2 py-1 text-lg w-[80%]" />
      <button className="bg-blue-600 text-white w-[20%] rounded text-lg">Predict</button>
    </div>
  );
}

function QRInput({ header }) {
  return (
    <div key={header} className="w-full flex flex-row gap-2 px-4">
      <input type="text" value={header} className="border border-gray-400 rounded px-2 py-1 text-lg w-[80%]" />
      <button className="bg-blue-600 text-white  w-[20%] rounded text-lg">Scan QR Code</button>
    </div>
  );
}

// • Operation
// • Object
// • String
// • Number
// • ORC
// • IMG
// • QR

export default App;
