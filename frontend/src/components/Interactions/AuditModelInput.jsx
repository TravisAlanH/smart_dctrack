import React, { useState, useEffect, useRef } from "react";
import { APIStore, ReuseDataStateStore } from "../../../store/Store";
import { dcTrack_DISCRIPTIONS } from "../Helpers/dcTrackAPIDiscriptions";

function AuditModelInput({
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
  const pullAllModelsFromMake = APIStore((s) => s.pullAllModelsFromMake);
  const modelList = APIStore((s) => s.data.ModelDataFromInstance);
  const setSelectedModel = ReuseDataStateStore((s) => s.setSelectedModel);
  const setSelectedMake = ReuseDataStateStore((s) => s.setSelectedMake);
  const selectedMake = ReuseDataStateStore((s) => s.data.SelectedMake);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDrop, setShowDrop] = useState(false);
  const [focused, setFocused] = useState(false);
  const [suppressOpen, setSuppressOpen] = useState(false);

  const inputRef = useRef(null);

  // refresh list when make changes
  useEffect(() => {
    pullAllModelsFromMake();
  }, [selectedMake, pullAllModelsFromMake]);

  // open dropdown when typing unless selection suppressed it
  useEffect(() => {
    if (suppressOpen) {
      setSuppressOpen(false);
      return;
    }

    if (query.length < 2) {
      setShowDrop(false);
      return;
    }

    pullAllModelsFromMake();
    setResults(modelList);
    setShowDrop(true);
    console.log("AuditModel 2nd");
  }, [query, suppressOpen]);

  const selectedValue = APIPayloadHolder[label] || "";
  const required = trueRequredMaster[objectType][label];

  return (
    <div className={ui.cardOuter} style={{ position: "relative" }}>
      <div className={ui.cardHeader}>
        <label className={required ? ui.labelRequired : ui.label}>Model</label>
      </div>

      <div className={ui.cardBody}>
        <input
          ref={inputRef}
          name={label}
          type="text"
          placeholder={label}
          className={ui.input}
          required={required}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          value={query || selectedValue}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
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
        />

        {showDrop && focused && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
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
                className="flex flex-row justify-between mx-2 border-y"
                style={{ padding: "0.5rem", cursor: "pointer" }}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setSuppressOpen(true);

                  setQuery(item.model);
                  setShowDrop(false);

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

                  if (item.formFactor) {
                    setAPIPayloadHolder({
                      type: objectType,
                      field: "tiFormFactor",
                      value: item.formFactor,
                    });
                  }

                  setSelectedModel(item.model);
                  setSelectedMake(item.make);

                  inputRef.current?.blur();
                }}
              >
                <span className="text-black">{item.model}</span>
                <span className="text-black">{item.make}</span>
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

export default AuditModelInput;
