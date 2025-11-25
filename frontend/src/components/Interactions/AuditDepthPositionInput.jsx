import React from "react";
import { APIStore } from "../../../store/Store";

export default function AuditDepthPositionInput() {
  const setSingleAPIPayloadHolder = APIStore((s) => s.setSingleAPIPayloadHolder);
  const boxStyle = "flex flex-col items-start bg-slate-400 mx-3 rounded-md py-1";
  const innerBoxStyle = "w-full flex flex-row gap-2 px-2";
  const requiredLableStyle = "px-2 text-sm text-red-600 font-bold";
  const descriptionButtonStyle = "bg-green-600 text-white rounded px-2 py-1 text-sm";
  const selectStyle = "border border-gray-400 rounded px-2 py-1 text-lg w-full";

  const label = "U Position ";

  const options = ["FRONT", "CENTER", "BACK"];
  return (
    <div className={boxStyle}>
      <label className={requiredLableStyle}>Depth Position</label>
      <div className={innerBoxStyle}>
        <select
          className={selectStyle}
          required
          onChange={(e) => {
            setSingleAPIPayloadHolder("radioDepthPosition", e.target.value || "");
          }}
        >
          {/* Header option */}
          <option value="">Select Depth Position</option>

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
            const text = "Defines front, middle, or rear mounting depth depending on the PDU installation.";
            setMessage({ type: "info_header", text, label });
          }}
        >
          ?
        </button>
      </div>
    </div>
  );
}
