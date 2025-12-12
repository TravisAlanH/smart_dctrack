import React from "react";
import { ReuseDataStateStore } from "../../../store/Store";
import { getStyles } from "../../../Styles";

function ToggleSwitch({ checked, onChange, label }) {
  const darkMode = ReuseDataStateStore((s) => s.data.DarkMode);
  const ui = getStyles();
  const setRequiredToggleWatcher = ReuseDataStateStore((s) => s.setRequireToggleWatcher);
  const setShowEmptyUPToggleWatcher = ReuseDataStateStore((s) => s.setShowEmptyUPToggleWatcher);
  return (
    <label className={"flex items-center gap-2 cursor-pointer select-none"} style={ui.text}>
      {label && <span>{label}</span>}
      <div
        className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors`}
        style={checked ? ui.toggleOn : ui.toggleOff}
        onClick={() => {
          onChange(!checked);
          if (label !== "Hide Empty") {
            setRequiredToggleWatcher();
          }
        }}
      >
        <div
          className={`w-4 h-4 rounded-full shadow-md transform transition-transform ${
            checked ? "translate-x-6" : "translate-x-0"
          }`}
          style={ui.mainBackground}
        />
      </div>
    </label>
  );
}

export default ToggleSwitch;
