import React from "react";
import { APIStore } from "../../../store/Store";

export default function AuditLocationInput() {
  const LOCATION = APIStore((s) => s.data.LOCATION);
  const setMessage = APIStore((s) => s.setResponseMessage);
  const setSingleAPIPayloadHolder = APIStore((s) => s.setSingleAPIPayloadHolder);

  const label = "LOCATION";

  const boxStyle = "flex flex-col items-start bg-slate-400 mx-3 rounded-md py-1";
  const innerBoxStyle = "w-full flex flex-row gap-2 px-2";
  const requiredLableStyle = "px-2 text-sm text-red-600 font-bold";
  const inputStyle = "border border-gray-400 rounded px-2 py-1 text-lg w-full";
  const descriptionButtonStyle = "bg-green-600 text-white rounded px-2 py-1 text-sm";

  React.useEffect(() => {
    setSingleAPIPayloadHolder("cmbLocation", LOCATION || "");
  }, [LOCATION]);

  return (
    <div className={boxStyle}>
      <label className={requiredLableStyle}>Location</label>
      <div className={innerBoxStyle}>
        <input name={"location"} readOnly type="text" className={inputStyle} value={LOCATION} />
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
