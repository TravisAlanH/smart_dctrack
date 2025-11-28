import React from "react";
import { APIStore } from "../../../store/Store";

export default function AuditRailsUsedInput() {
  const setSingleAPIPayloadHolder = APIStore((s) => s.setSingleAPIPayloadHolder);
  const boxStyle = "flex flex-col items-start bg-slate-400 mx-3 rounded-md py-1";
  const innerBoxStyle = "w-full flex flex-row gap-2 px-2";
  const requiredLableStyle = "px-2 text-sm text-red-600 font-bold";
  const descriptionButtonStyle = "bg-green-600 text-white rounded px-2 py-1 text-sm";
  const selectStyle = "border border-gray-400 rounded px-2 py-1 text-lg w-full";
  const APIPayloadHolder = APIStore((s) => s.data.APIPayloadHolder);
  const label = "Rails Used";
  const api = "radioRailsUsed";
  const setMessage = APIStore((s) => s.setResponseMessage);

  const options = ["Front", "Both", "Back"];
  return (
    <div className={boxStyle}>
      <label className={requiredLableStyle}>{label}</label>
      <div className={innerBoxStyle}>
        <select
          className={selectStyle}
          required
          value={APIPayloadHolder[api] || ""}
          onChange={(e) => {
            setSingleAPIPayloadHolder(api, e.target.value || "");
          }}
        >
          {/* Header option */}
          <option value="">Select Rails Used</option>

          {/* Only show valid U positions from selected cabinet */}
          {options.map((data) => (
            <option key={data} value={data}>
              {data}
            </option>
          ))}
        </select>

        <button
          type="button"
          className={descriptionButtonStyle}
          onClick={() => {
            const text = "Defines which rails are used for mounting the item in the cabinet.";
            setMessage({ type: "info_header", text, label: api });
          }}
        >
          ?
        </button>
      </div>
    </div>
  );
}
