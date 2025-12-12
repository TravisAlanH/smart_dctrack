import React, { useState, useEffect, useRef } from "react";
import { APIStore, ReuseDataStateStore } from "../../../store/Store";
import { dcTrack_DISCRIPTIONS } from "../Helpers/dcTrackAPIDiscriptions";
import { MdCameraAlt } from "react-icons/md";
import { MdInfoOutline } from "react-icons/md";

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
  style,
}) {
  const pullAllMakesFromInstance = APIStore((s) => s.pullAllMakesFromInstance);
  const makeList = APIStore((s) => s.data.MakeDatafromInstance.make);
  const setSelectedMake = ReuseDataStateStore((s) => s.setSelectedMake);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDrop, setShowDrop] = useState(false);

  // stops dropdown from reopening
  const selectionRef = useRef(false);

  const inputRef = useRef(null);

  // effect 1, fetch makes
  useEffect(() => {
    if (selectionRef.current) return;

    if (query.length >= 3) {
      pullAllMakesFromInstance(query);
    } else {
      setResults([]);
      setShowDrop(false);
    }
  }, [query, pullAllMakesFromInstance]);

  // effect 2, filter
  useEffect(() => {
    if (selectionRef.current) return;

    if (query.length < 3) return;

    const low = query.toLowerCase();
    const filtered = makeList.filter((x) => x.value.toLowerCase().includes(low)).sort((a, b) => a.value.localeCompare(b.value));

    setResults(filtered);
    setShowDrop(filtered.length > 0);
  }, [makeList, query]);

  const required = trueRequredMaster[objectType][label];

  return (
    <div className={ui.cardOuter} style={{ position: "relative", ...style.CardBackGround }}>
      <div className={ui.cardHeader} style={style.text}>
        <label className={required ? ui.labelRequired : ui.label}>Make</label>
      </div>

      <div className={ui.cardBody}>
        <input
          ref={inputRef}
          name={label}
          type="text"
          className={ui.input}
          required={required}
          placeholder={label}
          value={APIPayloadHolder[label] || query}
          onChange={(e) => {
            selectionRef.current = false;
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
            if (results.length > 0 && !selectionRef.current) {
              setShowDrop(true);
            }
          }}
          onBlur={() => {
            setTimeout(() => {
              selectionRef.current = false;
            }, 150);
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
                key={item.value}
                style={{ padding: "0.5rem", cursor: "pointer" }}
                className="border-y mx-2"
                onClick={() => {
                  selectionRef.current = true;

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
                <span className="text-black">{item.value}</span>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          className={ui.mainButton}
          style={style.baseButton}
          onClick={() => {
            setCameraRequiredToProcess(objectType, label);
            setCameraStatus(1);

            const el = document.getElementById("CameraModal");
            if (el) el.style.display = "block";
          }}
        >
          <MdCameraAlt size={20} />
        </button>

        <button
          type="button"
          className={ui.infoButton}
          style={style.infoButton}
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
          <MdInfoOutline size={20} />
        </button>
      </div>
    </div>
  );
}

export default AuditMakeInput;
