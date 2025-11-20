import React from "react";
import { APIStore } from "../../../store/Store";

export default function Cabinet({ setShow }) {
  const currentCabinetID = APIStore((s) => s.data.CurrentCabinetID);
  const currentLocationID = APIStore((s) => s.data.CurrnetLocationID);
  const cabinetsInLocation = APIStore((s) => s.data.CabinetsInLocation);
  const setMessage = APIStore((s) => s.setResponseMessage);

  React.useEffect(() => {
    const missing = !currentLocationID || !currentCabinetID;

    if (missing) {
      setMessage({
        type: "setCabLocInfo",
        text: "Please select a location and cabinet to view cabinet details.",
        label: "Select Location and Cabinet",
      });
      setShow(1);
    } else {
      setMessage({});
      setShow(0);
    }
  }, [currentLocationID, currentCabinetID, setMessage, setShow]);

  if (!currentLocationID || !currentCabinetID) {
    return <div>Please select a location and cabinet.</div>;
  }

  const selectedCabinet =
    (cabinetsInLocation?.cabinets || []).find((cab) => cab.cabinetId.toString() === currentCabinetID) || null;

  // Parse uPosition string → array
  const uList = selectedCabinet?.uPosition ? selectedCabinet.uPosition.split(",") : [];

  return (
    <div>
      <h2 className="font-bold text-lg">{selectedCabinet?.cabinetName || "Cabinet Not Found"}</h2>

      <div className="mt-4">
        {uList.length > 0 ? (
          <ul>
            {uList
              .slice()
              .reverse()
              .map((ru) => (
                <li key={ru}>RU {ru}</li>
              ))}
          </ul>
        ) : (
          <div>No UPosition data returned.</div>
        )}
      </div>
    </div>
  );
}
