import React, { useState, useEffect, useRef } from "react";
import { APIStore } from "../../../../../store/Store";

export default function CreateModel_GetModelFromInstance({ ui }) {
  const CreateModel = APIStore((s) => s.data.CreateModel);
  const setCreateModel = APIStore((s) => s.setCreateModel);
  const pullAllModelsInstance = APIStore((s) => s.pullAllModelsInstance);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDrop, setShowDrop] = useState(false);
  const [focused, setFocused] = useState(false);

  const inputRef = useRef(null);
  const prevQueryRef = useRef("");
  const backspaceTimer = useRef(null);

  const [payload, setPayload] = useState({});

  React.useEffect(() => {
    if (CreateModel.make === "" && CreateModel.model === "") {
      setPayload({});
      return;
    }
  }, [CreateModel]);
  React.useEffect(() => {
    if (CreateModel.make === "" && CreateModel.model !== "") {
      setCreateModel({ make: "", model: "", setting: "Make_Model" });
    }
  }, [CreateModel]);

  useEffect(() => {
    const prev = prevQueryRef.current;
    prevQueryRef.current = query;

    if (query.length < 2) {
      setShowDrop(false);
      return;
    }

    const userBackspacing = query.length < prev.length;

    if (userBackspacing) {
      if (backspaceTimer.current) {
        clearTimeout(backspaceTimer.current);
      }

      backspaceTimer.current = setTimeout(async () => {
        const list = await pullAllModelsInstance();
        setResults(list?.searchResults?.models || []);
        setShowDrop(true);
      }, 400);

      return;
    }

    async function load() {
      const list = await pullAllModelsInstance();
      setResults(list?.searchResults?.models || []);
      setShowDrop(true);
    }

    load();

    return () => {
      if (backspaceTimer.current) {
        clearTimeout(backspaceTimer.current);
      }
    };
  }, [query, pullAllModelsInstance]);

  return (
    <div className="w-full h-auto flex flex-col gap-4">
      <div className="flex flex-row justify-center">
        <div>Search Model to Clone and Edit</div>
      </div>

      {/* Make (disabled, from CreateModel.holdMake) */}
      <div className={ui.cardOuter} style={{ position: "relative" }}>
        <div className={ui.cardHeader}>
          <label className={ui.label}>Make</label>
        </div>

        <div className={ui.cardBody}>
          <input
            name="Make"
            type="text"
            placeholder="Auto-Fill with Model Search"
            className={ui.input}
            required
            value={CreateModel.holdMake || ""}
            disabled
          />
        </div>
      </div>

      {/* Model search with dropdown */}
      <div className={ui.cardOuter} style={{ position: "relative" }}>
        <div className={ui.cardHeader}>
          <label className={ui.label}>Model</label>
        </div>

        <div className={ui.cardBody}>
          <input
            ref={inputRef}
            name="Model"
            type="text"
            placeholder="Model Search"
            className={ui.input}
            required
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            value={query}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={(e) => {
              const text = e.target.value;
              setQuery(text);

              setCreateModel({
                make: "",
                model: text,
                setting: "Make_Model",
              });
            }}
          />

          {showDrop && focused && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                zIndex: 120,
                background: "white",
                border: "1px solid #ccc",
                maxHeight: "10rem",
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
                    setQuery(item.model);
                    setShowDrop(false);
                    setPayload(item);
                    setCreateModel({
                      make: item.make,
                      model: item.model,
                      setting: "Make_Model",
                    });

                    inputRef.current?.blur();
                  }}
                >
                  <span className="text-black">{item.model}</span>
                  <span className="text-black">{item.make}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="px-2 pb-2 flex flex-row justify-between">
        <div>Model Data Preview:</div>
        <button
          className={ui.infoButton}
          onClick={() => {
            setCreateModel({
              payload: payload,
              url: "/v2/models",
              setting: "Payload",
            });
          }}
        >
          Create Copy
        </button>
      </div>
      <div className="h-[5rem] w-full flex flex-col">
        <pre className="text-xs overflow-auto">{JSON.stringify(payload, null, 2)}</pre>
      </div>
    </div>
  );
}
