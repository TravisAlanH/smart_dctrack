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
  const pullAllMakesFromInstance = APIStore((s) => s.pullAllMakesFromInstance);
  const makeList = APIStore((s) => s.data.MakeDatafromInstance.make);
  const setSelectedMake = ReuseDataStateStore((s) => s.setSelectedMake);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDrop, setShowDrop] = useState(false);

  const inputRef = useRef(null);

  // Fetch from server when user enters 3+ characters
  useEffect(() => {
    if (query.length >= 3) {
      pullAllMakesFromInstance(query);
    } else {
      setResults([]);
      setShowDrop(false);
    }
  }, [query, pullAllMakesFromInstance]);

  // Filter after store updates
  useEffect(() => {
    if (query.length < 3) return;

    const low = query.toLowerCase();

    const filtered = makeList.filter((x) => x.value.toLowerCase().includes(low)).sort((a, b) => a.value.localeCompare(b.value));

    setResults(filtered);
    setShowDrop(filtered.length > 0);
  }, [makeList, query]);

  const selectedValue = APIPayloadHolder[[label]] || "";

  const boxStyle = "flex flex-col items-start bg-slate-400 mx-3 rounded-md py-1";
  const innerBoxStyle = "w-full flex flex-row gap-2 px-2";
  const labelStyle = "px-2 text-sm";
  const requiredLableStyle = "px-2 text-sm text-red-600 font-bold";
  const inputStyle = "border border-gray-400 rounded px-2 py-1 text-lg w-full";
  const buttonStyle = "bg-blue-600 text-white w-[20%] rounded text-lg";
  const descriptionButtonStyle = "bg-green-600 text-white rounded px-2 py-1 text-sm";

  return (
    <div className={boxStyle} style={{ position: "relative" }}>
      <label className={!trueRequredMaster[label] ? requiredLableStyle : labelStyle}>Make</label>

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
            setSelectedMake(text);
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
              maxHeight: "12rem",
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
                onClick={() => {
                  setQuery(item.value);
                  setAPIPayloadHolder({
                    type: objectType,
                    field: label,
                    value: item.value,
                  });
                  setSelectedMake(item.value);
                  setShowDrop(false);

                  if (inputRef.current) {
                    inputRef.current.blur();
                  }
                }}
              >
                {item.value}
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
