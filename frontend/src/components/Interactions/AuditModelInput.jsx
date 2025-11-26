import React, { useState, useEffect, useRef } from "react";
import { APIStore, ReuseDataStateStore } from "../../../store/Store";
import { headerEndpoints } from "../Helpers/Endpoints";
import { headerDescriptions } from "../Helpers/HeadersAsObjects";
import { dcTrack_DISCRIPTIONS } from "../Helpers/dcTrackAPIDiscriptions";

function AuditMakeInput({
  label,
  objectType,
  setShow,
  setMessage,
  setAPIPayloadHolder,
  APIPayloadHolder,
  setCameraStatus,
  setCameraRequiredToProcess,
  trueRequredMaster,
}) {
  const pullAllModelsFromMake = APIStore((s) => s.pullAllModelsFromMake);
  const modelList = APIStore((s) => s.data.ModelDataFromInstance);
  const setSelectedModel = ReuseDataStateStore((s) => s.setSelectedModel);
  const setSelectedMake = ReuseDataStateStore((s) => s.setSelectedMake);
  //   const setSelectedMake = ReuseDataStateStore((s) => s.setSelectedMake);
  const selectedMake = ReuseDataStateStore((s) => s.data.SelectedMake);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDrop, setShowDrop] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    pullAllModelsFromMake();
  }, [selectedMake, pullAllModelsFromMake]);

  useEffect(() => {
    if (query.length < 2) return;
    pullAllModelsFromMake();
    setShowDrop(true);
    setResults(modelList);
  }, [query, pullAllModelsFromMake]);

  const selectedValue = APIPayloadHolder[[label]] || "";

  const boxStyle = "flex flex-col items-start bg-slate-400 mx-3 rounded-md py-1";
  const innerBoxStyle = "w-full flex flex-row gap-2 px-2";
  const labelStyle = "px-2 text-sm";
  const requiredLableStyle = "px-2 text-sm text-red-600 font-bold";
  const inputStyle = "border border-gray-400 rounded px-2 py-1 text-lg w-full";
  const buttonStyle = "bg-blue-600 text-white w-[20%] rounded text-lg";
  const descriptionButtonStyle = "bg-green-600 text-white rounded px-2 py-1 text-sm";

  console.log(results);

  return (
    <div className={boxStyle} style={{ position: "relative" }}>
      <label className={!trueRequredMaster[label] ? requiredLableStyle : labelStyle}>Model</label>

      <div className={innerBoxStyle}>
        <input
          ref={inputRef}
          name={label}
          type="text"
          placeholder={label}
          className={inputStyle}
          required={trueRequredMaster[label]}
          value={query || selectedValue}
          onChange={(e) => {
            const text = e.target.value;
            setQuery(text);
            setAPIPayloadHolder({
              type: objectType,
              field: label,
              value: text,
            });
            setSelectedModel(text);
          }}
          onFocus={() => {
            if (results.length > 0) setShowDrop(true);
          }}
        />

        {showDrop && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: "0",
              right: "0",
              zIndex: 50,
              background: "white",
              border: "1px solid #ccc",
              maxHeight: "15rem",
              overflowY: "auto",
            }}
          >
            {results.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: "0.5rem",
                  cursor: "pointer",
                }}
                className="flex flex-row justify-between mx-2 border-y"
                onClick={() => {
                  setQuery(item.model);
                  setAPIPayloadHolder({
                    type: objectType,
                    field: "cmbMake",
                    value: item.make,
                  });
                  setAPIPayloadHolder({
                    type: objectType,
                    field: "cmbModel",
                    value: item.model,
                  });
                  setSelectedModel(item.model);
                  setSelectedMake(item.make);
                  // setSelectedModelUR(item.urId);
                  setShowDrop(false);

                  if (inputRef.current) {
                    inputRef.current.blur();
                  }
                }}
              >
                <span>{item.model}</span>
                <span>{item.make}</span>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          className={buttonStyle}
          onClick={() => {
            setCameraRequiredToProcess(objectType, label);
            setCameraStatus(1);
            document.getElementById("CameraModal").style.display = "block";
          }}
        >
          Scan
        </button>

        <button
          type="button"
          className={descriptionButtonStyle}
          onClick={() => {
            const text = dcTrack_DISCRIPTIONS[objectType]?.[label] || "No data available";
            setMessage({
              type: "info_header",
              text,
              label,
            });
            setShow(1);
          }}
        >
          ?
        </button>
      </div>
    </div>
  );
}

export default AuditMakeInput;
