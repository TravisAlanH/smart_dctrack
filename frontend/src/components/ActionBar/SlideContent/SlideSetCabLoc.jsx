import React from "react";
import { APIStore } from "../../../../store/Store";
import AuditLocationInput from "../../Interactions/AuditLocationInput";

export default function SlideSetCabLoc() {
  const pullLocationData = APIStore((s) => s.pullLocationData);
  const pullCabinetData = APIStore((s) => s.pullCabinetData);
  const setCurrentLocationID = APIStore((s) => s.setCurrentLocationID);
  const setCurrentCabinetID = APIStore((s) => s.setCurrentCabinetID);
  const LocationsOnInstance = APIStore((s) => s.data.LocationsOnInstance);
  const CabinetsInLocation = APIStore((s) => s.data.CabinetsInLocation);
  const CurrentCainetID = APIStore((s) => s.data.CurrentCabinetID);
  const CurrnetLocationID = APIStore((s) => s.data.CurrnetLocationID);
  const LOCATION = APIStore((s) => s.data.LOCATION);
  const LOCATIONCODE = APIStore((s) => s.data.LOCATIONCODE);
  const setZeroUAuditMap = APIStore((s) => s.setZeroUAuditMap);
  const setBladeAuditMap = APIStore((s) => s.setBladeAuditMap);

  React.useEffect(() => {
    pullLocationData();
  }, []);

  React.useEffect(() => {
    if (LOCATIONCODE == null) return;
    pullCabinetData(LOCATIONCODE);
  }, [LOCATIONCODE]);

  //   console.log("LocationsOnInstance", LocationsOnInstance.locations);
  //   console.log("CabinetsInLocation", CabinetsInLocation);

  const selectStyle = "border border-gray-400 rounded px-2 py-1 text-black";
  const boxStyle = "flex flex-col items-start bg-slate-400 mx-3 rounded-md py-1";
  const innerBoxStyle = "w-full flex flex-row gap-2 px-2";
  const requiredLableStyle = "px-2 text-sm text-red-600 font-bold";
  const inputStyle = "border border-gray-400 rounded px-2 py-1 text-lg w-full text-black";

  return (
    <div className="flex flex-col">
      <div className="">
        {/* {LocationsOnInstance.locations} */}
        {/* <select
          className={selectStyle}
          onChange={(e) => {
            setCurrentLocationID(e.target.value);
          }}
          value={CurrnetLocationID}
        >
          <option value={null}>Select Location</option>
          {(LocationsOnInstance?.locations || []).map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.tiLocationName} ({loc.tiLocationCode})
            </option>
          ))}
        </select> */}
        <div className={boxStyle}>
          <label className={requiredLableStyle}>Location</label>
          <div className={innerBoxStyle}>
            <input name={"location"} readOnly type="text" className={inputStyle} value={LOCATION} />
          </div>
        </div>
      </div>
      <div>
        <select
          className={selectStyle}
          onChange={(e) => {
            setCurrentCabinetID(e.target.value);
            setZeroUAuditMap({});
            setBladeAuditMap({});
          }}
        >
          {LOCATIONCODE == null ? <option value={null}>Location Required</option> : <option value={null}>Select Cabinet</option>}

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
