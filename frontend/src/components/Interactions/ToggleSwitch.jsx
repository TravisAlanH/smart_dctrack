import React from "react";
import { ReuseDataStateStore } from "../../../store/Store";

function ToggleSwitch({ checked, onChange, label }) {
  const setRequiredToggleWatcher = ReuseDataStateStore((s) => s.setRequireToggleWatcher);
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      {label && <span>{label}</span>}
      <div
        className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${checked ? "bg-green-500" : "bg-gray-300"}`}
        onClick={() => {
          onChange(!checked);
          setRequiredToggleWatcher();
        }}
      >
        <div
          className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
            checked ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </div>
    </label>
  );
}

export default ToggleSwitch;
