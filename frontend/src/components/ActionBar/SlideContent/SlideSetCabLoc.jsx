import React from "react";
import { APIStore } from "../../../../store/Store";
import AuditLocationInput from "../../Interactions/AuditLocationInput";
import { ReuseDataStateStore } from "../../../../store/Store";
import { getStyles } from "../../../../Styles";

export default function SlideSetCabLoc() {
  const darkMode = ReuseDataStateStore((s) => s.data.DarkMode);
  const ui = getStyles();
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

  const selectStyle = "border rounded px-2 py-1 text-black w-full";
  const boxStyle = "flex flex-col items-start mx-3 rounded-md py-1";
  const innerBoxStyle = "w-full flex flex-row gap-2 px-2";
  const requiredLableStyle = "px-2 text-sm font-bold";
  const inputStyle = "border rounded px-2 py-1 text-lg w-full text-black";

  return (
    <div className="flex flex-col gap-2">
      <div className="mt-2">
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
        <div className={boxStyle} style={ui.CardSectionBackGround}>
          <label className={requiredLableStyle}>Location</label>
          <div className={innerBoxStyle}>
            <input name={"location"} readOnly type="text" className={inputStyle} value={LOCATION} style={ui.inputDark} />
          </div>
        </div>
      </div>
      <div className={boxStyle} style={ui.CardSectionBackGround}>
        <label className={requiredLableStyle}>Cabinet</label>
        <div className={innerBoxStyle}>
          <select
            className={selectStyle}
            onChange={(e) => {
              setCurrentCabinetID(e.target.value);
              setZeroUAuditMap({});
              setBladeAuditMap({});
            }}
          >
            {LOCATIONCODE == null ? (
              <option value={null}>Location Required</option>
            ) : (
              <option value={null}>Select Cabinet</option>
            )}

            {(CabinetsInLocation?.cabinets || []).map((cab) => (
              <option key={cab.cabinetId} value={cab.cabinetId}>
                ({cab.cabinet})
              </option>
            ))}
          </select>{" "}
        </div>
      </div>
    </div>
  );
}
