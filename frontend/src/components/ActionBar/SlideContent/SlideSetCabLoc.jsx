import React from "react";
import { APIStore } from "../../../../store/Store";

export default function SlideSetCabLoc() {
  const pullLocationData = APIStore((s) => s.pullLocationData);
  const pullCabinetData = APIStore((s) => s.pullCabinetData);
  const setCurrentLocationID = APIStore((s) => s.setCurrentLocationID);
  const setCurrentCabinetID = APIStore((s) => s.setCurrentCabinetID);
  const LocationsOnInstance = APIStore((s) => s.data.LocationsOnInstance);
  const CabinetsInLocation = APIStore((s) => s.data.CabinetsInLocation);
  const CurrentCainetID = APIStore((s) => s.data.CurrentCabinetID);
  const CurrnetLocationID = APIStore((s) => s.data.CurrnetLocationID);

  React.useEffect(() => {
    pullLocationData();
  }, []);

  React.useEffect(() => {
    if (CurrnetLocationID == null) return;
    pullCabinetData(CurrnetLocationID);
  }, [CurrnetLocationID]);

  //   console.log("LocationsOnInstance", LocationsOnInstance.locations);
  //   console.log("CabinetsInLocation", CabinetsInLocation);

  const selectStyle = "border border-gray-400 rounded px-2 py-1 text-black";

  return (
    <div className="flex flex-col">
      <div className="">
        {/* {LocationsOnInstance.locations} */}
        <select
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
        </select>
      </div>
      <div>
        <select
          className={selectStyle}
          onChange={(e) => {
            setCurrentCabinetID(e.target.value);
          }}
        >
          {CurrnetLocationID == null ? (
            <option value={null}>Location Required</option>
          ) : (
            <option value={null}>Select Cabinet</option>
          )}

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
