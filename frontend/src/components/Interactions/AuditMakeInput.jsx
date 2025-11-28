import React, { useState, useEffect, useRef } from "react";
import { APIStore, ReuseDataStateStore } from "../../../store/Store";
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
  ui,
}) {
  const pullAllMakesFromInstance = APIStore((s) => s.pullAllMakesFromInstance);
  const makeList = APIStore((s) => s.data.MakeDatafromInstance.make);
  const setSelectedMake = ReuseDataStateStore((s) => s.setSelectedMake);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDrop, setShowDrop] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    if (query.length >= 3) {
      pullAllMakesFromInstance(query);
    } else {
      setResults([]);
      setShowDrop(false);
    }
  }, [query, pullAllMakesFromInstance]);

  useEffect(() => {
    if (query.length < 3) return;

    const low = query.toLowerCase();
    const filtered = makeList.filter((x) => x.value.toLowerCase().includes(low)).sort((a, b) => a.value.localeCompare(b.value));

    setResults(filtered);
    setShowDrop(filtered.length > 0);
  }, [makeList, query]);

  const selectedValue = APIPayloadHolder[label] || "";
  const required = trueRequredMaster[objectType][label];
  const readOnly = false;

  return (
    <div className={ui.cardOuter} style={{ position: "relative" }}>
      <div className={ui.cardHeader}>
        <label className={required ? ui.labelRequired : ui.label}>Make</label>
      </div>

      <div className={ui.cardBody}>
        <input
          ref={inputRef}
          name={label}
          type="text"
          className={ui.input}
          required={required}
          readOnly={readOnly}
          placeholder={label}
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
              left: 0,
              right: 0,
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
                style={{ padding: "0.5rem", cursor: "pointer" }}
                onClick={() => {
                  setQuery(item.value);

                  setAPIPayloadHolder({
                    type: objectType,
                    field: label,
                    value: item.value,
                  });

                  setSelectedMake(item.value);
                  setShowDrop(false);

                  if (inputRef.current) inputRef.current.blur();
                }}
              >
                {item.value}
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          className={ui.mainButton}
          onClick={() => {
            setCameraRequiredToProcess(objectType, label);
            setCameraStatus(1);

            const el = document.getElementById("CameraModal");
            if (el) el.style.display = "block";
          }}
        >
          Scan
        </button>

        <button
          type="button"
          className={ui.infoButton}
          onClick={() => {
            const text = dcTrack_DISCRIPTIONS[objectType]?.[label] || "No data";
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
