import React from "react";
import { APIStore } from "../../../store/Store";

export default function AuditCabinetInput() {
  const pullCabinetData = APIStore((s) => s.pullCabinetData);
  const setCurrentCabinetID = APIStore((s) => s.setCurrentCabinetID);
  const CabinetsInLocation = APIStore((s) => s.data.CabinetsInLocation);
  const LOCATIONCODE = APIStore((s) => s.data.LOCATIONCODE);
  const setMessage = APIStore((s) => s.setResponseMessage);
  const setSingleAPIPayloadHolder = APIStore((s) => s.setSingleAPIPayloadHolder);

  const boxStyle = "flex flex-col items-start bg-slate-400 mx-3 rounded-md py-1";
  const innerBoxStyle = "w-full flex flex-row gap-2 px-2";
  const requiredLableStyle = "px-2 text-sm text-red-600 font-bold";
  const descriptionButtonStyle = "bg-green-600 text-white rounded px-2 py-1 text-sm";
  const selectStyle = "border border-gray-400 rounded px-2 py-1 text-lg w-full";

  React.useEffect(() => {
    if (LOCATIONCODE == "") return;
    pullCabinetData(LOCATIONCODE);
  }, [LOCATIONCODE]);

  const label = "CABINET";

  return (
    <div className={boxStyle}>
      <label className={requiredLableStyle}>Cabinet</label>
      <div className={innerBoxStyle}>
        <select
          className={selectStyle}
          required
          onChange={(e) => {
            const obj = JSON.parse(e.target.value);
            setCurrentCabinetID(obj.id);
            setSingleAPIPayloadHolder("cmbCabinet", obj.name);
          }}
        >
          {LOCATIONCODE == "" ? <option value="">Location Required</option> : <option value="">Select Cabinet</option>}

          {(CabinetsInLocation?.cabinets || []).map((cab) => {
            const cleanName = cab.cabinet.replace("(", "").replace(")", "");
            const payload = { id: cab.cabinetId, name: cleanName };

            return (
              <option key={cab.cabinetId} value={JSON.stringify(payload)}>
                {cleanName}
              </option>
            );
          })}
        </select>

        <button
          type="button"
          className={descriptionButtonStyle}
          onClick={() => {
            const text =
              "The parent location such as ROOM-101. Must match a Location defined in the system, is set in the Settings Screen.";
            setMessage({ type: "info_header", text, label });
          }}
        >
          ?
        </button>
      </div>
    </div>
  );
}
