import React, { useState, useRef, useEffect } from "react";
import { APIStore } from "../../../../../store/Store";
import CreateModel_GetModelFromInstance from "./CreateModel_GetModelFromInstance";

export default function CreateModel_GetMake({ ui }) {
  const pullAllMakesFromInstance = APIStore((s) => s.pullAllMakesFromInstance);
  const makeList = APIStore((s) => s.data.MakeDatafromInstance.make);
  const setCreateModel = APIStore((s) => s.setCreateModel);
  const createModelData = APIStore((s) => s.data.CreateModel);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDrop, setShowDrop] = useState(false);

  const selectionRef = useRef(false);
  const inputRef = useRef(null);

  // fetch makes
  useEffect(() => {
    let stop = false;

    async function run() {
      if (selectionRef.current) return;

      if (query.length >= 3) {
        const list = await pullAllMakesFromInstance(query);

        if (stop) return;
        if (Array.isArray(list)) {
          setResults(list);
          setShowDrop(list.length > 0);
        }
      } else {
        setResults([]);
        setShowDrop(false);
      }
    }

    run();

    return () => {
      stop = true;
    };
  }, [query, pullAllMakesFromInstance]);

  console.log(makeList);
  console.log(results);

  return (
    <div className={ui.cardOuter} style={{ position: "relative" }}>
      <div className="flex flex-row full">
        <input
          ref={inputRef}
          type="text"
          className={ui.input}
          placeholder="make"
          value={query}
          onChange={(e) => {
            selectionRef.current = false;
            const text = e.target.value;
            setQuery(text);
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
                  setShowDrop(false);

                  const updated = {
                    ...createModelData.payload,
                    make: item.value,
                  };

                  setCreateModel({
                    payload: updated,
                    url: createModelData.url,
                    setting: "Payload",
                  });

                  if (inputRef.current) inputRef.current.blur();
                }}
              >
                <span className="text-black">{item.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
