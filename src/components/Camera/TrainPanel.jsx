import React, { useState, useEffect } from "react";

export default function TrainPanel({ classifier, onTrain, version }) {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");

  const [makeList, setMakeList] = useState([]);
  const [modelList, setModelList] = useState([]);

  useEffect(() => {
    const ds = classifier.getClassifierDataset();
    const labels = Object.keys(ds);

    const parsed = labels.map((x) => x.split("|||")).filter((x) => x.length === 2);

    const makes = [...new Set(parsed.map((x) => x[0]))];
    setMakeList(makes);

    if (make.length > 0) {
      const items = parsed.filter((x) => x[0].toLowerCase() === make.toLowerCase());
      const models = [...new Set(items.map((x) => x[1]))];
      setModelList(models);
    } else {
      setModelList([]);
    }
  }, [make, classifier, version]);

  function handleTrain() {
    if (make.trim().length === 0) return;
    if (model.trim().length === 0) return;

    const label = make.trim() + "|||" + model.trim();
    onTrain(label);
    setModel("");
  }

  function renderDropdown(list, onSelect) {
    if (list.length === 0) return null;

    return (
      <div className="border bg-white text-black mt-1">
        {list.map((x, i) => (
          <div key={i} className="p-1 hover:bg-gray-200 cursor-pointer" onClick={() => onSelect(x)}>
            {x}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full p-3 bg-gray-900 text-white">
      <div className="">
        <div>Make</div>
        <input className="w-full p-2 text-black" value={make} onChange={(e) => setMake(e.target.value)} />
        {renderDropdown(
          makeList.filter((x) => x.toLowerCase().startsWith(make.toLowerCase())),
          (x) => setMake(x)
        )}
      </div>

      <div className="">
        <div>Model</div>
        <input className="w-full p-2 text-black" value={model} onChange={(e) => setModel(e.target.value)} />
        {make.length > 0 &&
          renderDropdown(
            modelList.filter((x) => x.toLowerCase().startsWith(model.toLowerCase())),
            (x) => setModel(x)
          )}
      </div>

      <button onClick={handleTrain} className="p-2 bg-blue-600 w-full">
        Train
      </button>
    </div>
  );
}
