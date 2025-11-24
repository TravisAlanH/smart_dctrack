import React from "react";
import { APIStore } from "../../../store/Store";

export default function AuditCabinetInput() {
  const pullCabinetData = APIStore((s) => s.pullCabinetData);
  const setCurrentCabinetID = APIStore((s) => s.setCurrentCabinetID);
  const CabinetsInLocation = APIStore((s) => s.data.CabinetsInLocation);
  const LOCATIONCODE = APIStore((s) => s.data.LOCATIONCODE);

  const boxStyle = "flex flex-col items-start bg-slate-400 mx-3 rounded-md py-1";
  const innerBoxStyle = "w-full flex flex-row gap-2 px-2";

  const requiredLableStyle = "px-2 text-sm text-red-600 font-bold";

  const selectStyle = "border border-gray-400 rounded px-2 py-1 text-lg w-full";

  React.useEffect(() => {
    if (LOCATIONCODE == "") return;
    pullCabinetData(LOCATIONCODE);
  }, [LOCATIONCODE]);

  return (
    <div className={boxStyle}>
      <label className={requiredLableStyle}>Cabinet</label>
      <div className={innerBoxStyle}>
        <select
          className={selectStyle}
          required
          onChange={(e) => {
            setCurrentCabinetID(e.target.value);
          }}
        >
          {LOCATIONCODE == "" ? <option value={null}>Location Required</option> : <option value={null}>Select Cabinet</option>}

          {(CabinetsInLocation?.cabinets || []).map((cab) => (
            <option key={cab.cabinetId} value={cab.cabinetId}>
              ({cab.cabinet})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
