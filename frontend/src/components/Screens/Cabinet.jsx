import React from "react";
import { APIStore, ReuseDataStateStore } from "../../../store/Store";
import ToggleSwtich from "../Interactions/ToggleSwitch";

export default function Cabinet({ setShow }) {
  const currentCabinetID = APIStore((s) => s.data.CurrentCabinetID);
  const currentLocationID = APIStore((s) => s.data.CurrnetLocationID);
  const cabinetsInLocation = APIStore((s) => s.data.CabinetsInLocation);
  const pullAllAssetFromCabinet = APIStore((s) => s.pullAllAssetFromCabinet);
  const setMessage = APIStore((s) => s.setResponseMessage);
  const AssetsInCabinet = APIStore((s) => s.data.AssetsInCabinet);

  const ShowEmptyUPToggleWatcher = ReuseDataStateStore((s) => s.data.ShowEmptyUPToggleWatcher);
  const setShowEmptyUPToggleWatcher = ReuseDataStateStore((s) => s.setShowEmptyUPToggleWatcher);

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

  React.useEffect(() => {
    if (currentCabinetID) {
      pullAllAssetFromCabinet(currentCabinetID);
    }
  }, [currentCabinetID]);

  if (!currentLocationID || !currentCabinetID) {
    return <div>Please select a location and cabinet.</div>;
  }

  const selectedCabinet =
    (cabinetsInLocation?.cabinets || []).find((cab) => cab.cabinetId.toString() === currentCabinetID) || null;

  const cabinetHeight = 42;

  const uList = Array.from({ length: cabinetHeight }, (_, i) => (i + 1).toString());

  // Build two maps:
  // startMap: RU → item at starting RU only
  // skipSet: all RUs that belong to multi-RU items except start
  const startMap = {};
  const skipSet = new Set();

  (AssetsInCabinet?.cabinetItems || []).forEach((item) => {
    const start = item.cmbUPosition;
    const count = item.tiRackUnits;

    startMap[start] = item;

    for (let i = 1; i < count; i++) {
      skipSet.add(start + i);
    }
  });

  return (
    <div>
      <div className="flex flex-row justify-between px-4">
        <h2 className="font-bold text-lg">{selectedCabinet?.cabinet || "Cabinet Not Found"}</h2>
        <ToggleSwtich checked={ShowEmptyUPToggleWatcher} onChange={setShowEmptyUPToggleWatcher} label={"Hide Empty"} />
      </div>

      <div className="flex flex-col gap-1">
        {uList
          .slice()
          .reverse()
          .map((ru) => {
            const ruNum = Number(ru);

            // skip rows covered by multi-RU items
            if (skipSet.has(ruNum)) {
              return null;
            }

            // render only the starting RU
            if (startMap[ruNum]) {
              return <FilledUPosition key={ru} ru={ru} item={startMap[ruNum]} />;
            }

            if (ShowEmptyUPToggleWatcher) {
              return null;
            }

            return <EmptyUPosition key={ru} ru={ru} />;
          })}
      </div>
    </div>
  );
}

const boxStyleEmpty = "flex flex-row items-center bg-slate-400 mx-3 rounded-md py-1 h-9";
const labelDivStyle = "flex flex-col h-10 w-10 justify-center items-center";
const labelStyle = "text-sm";
const innerBoxStyleEmpty = "w-full h-full flex flex-row gap-2 pr-2";
const innerBoxStyle = "w-full h-full flex flex-row gap-2 pr-2";
const inputStyle = "border border-gray-400 rounded px-2 py-1 text-sm w-full bg-white";
const inputStyleEmpty = "border border-gray-400 rounded px-2 py-1 text-sm w-full bg-gray-400";

function EmptyUPosition({ ru }) {
  return (
    <div className={boxStyleEmpty}>
      <div className={labelDivStyle}>
        <label className={labelStyle}>{ru}</label>
      </div>
      <div className={innerBoxStyleEmpty}>
        <input type="text" className={inputStyleEmpty} value={`Empty`} readOnly />
      </div>
    </div>
  );
}

function FilledUPosition({ ru, item }) {
  const height = `${item.tiRackUnits * 2.5}rem`;
  const lableHeight = `${item.tiRackUnits * 2.5}rem`;

  return (
    <div className="flex flex-row items-center bg-slate-300 mx-3 rounded-md py-1" style={{ height }}>
      <div className="flex flex-col w-10 justify-around items-center" style={{ height: lableHeight }}>
        {[...Array(item.tiRackUnits)].map((_, idx) => {
          const start = Number(ru);
          const size = item.tiRackUnits;
          const value = start + (size - 1) - idx;
          return (
            <label className={labelStyle} key={idx}>
              {value}
            </label>
          );
        })}
      </div>
      <div className={innerBoxStyle}>
        <span type="text" className={inputStyle}>{`${item.tiName} ${item.cmbMake} ${item.cmbModel}`}</span>
        <button className="border px-2 bg-green-500 rounded-md h-8">Act</button>
      </div>
    </div>
  );
}
