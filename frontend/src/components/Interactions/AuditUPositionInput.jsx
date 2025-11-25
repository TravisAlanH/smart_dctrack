import React from "react";
import { APIStore } from "../../../store/Store";

export default function AuditUPositionInput() {
  const CabinetsInLocation = APIStore((s) => s.data.CabinetsInLocation);
  const setSingleAPIPayloadHolder = APIStore((s) => s.setSingleAPIPayloadHolder);
  const currentCabinetID = APIStore((s) => s.data.CurrentCabinetID);

  const boxStyle = "flex flex-col items-start bg-slate-400 mx-3 rounded-md py-1";
  const innerBoxStyle = "w-full flex flex-row gap-2 px-2";
  const requiredLableStyle = "px-2 text-sm text-red-600 font-bold";
  const descriptionButtonStyle = "bg-green-600 text-white rounded px-2 py-1 text-sm";
  const selectStyle = "border border-gray-400 rounded px-2 py-1 text-lg w-full";

  // find the selected cabinet
  const selectedCabinet = (CabinetsInLocation?.cabinets || []).find((cab) => cab.cabinetId == currentCabinetID) || null;

  // parse U positions into array
  const uList = selectedCabinet?.uPosition
    ? selectedCabinet.uPosition
        .split(",")
        .map((v) => Number(v.trim()))
        .filter((n) => !isNaN(n))
    : [];

  const label = "U Position ";

  return (
    <div className={boxStyle}>
      <label className={requiredLableStyle}>U Position</label>
      <div className={innerBoxStyle}>
        <select
          className={selectStyle}
          required
          onChange={(e) => {
            setSingleAPIPayloadHolder("cmbUPosition", e.target.value || "");
          }}
        >
          {/* Header option */}
          {!currentCabinetID ? <option value="">Cabinet Required</option> : <option value="">Select U Position</option>}

          {/* Only show valid U positions from selected cabinet */}
          {[...uList].reverse().map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>

        <button
          type="button"
          className={descriptionButtonStyle}
          onClick={() => {
            const text = "Open U Position in the selected cabinet where the device is located.";
            setMessage({ type: "info_header", text, label });
          }}
        >
          ?
        </button>
      </div>
    </div>
  );
}
