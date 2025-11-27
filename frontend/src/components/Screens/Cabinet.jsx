import React from "react";
import { APIStore, ReuseDataStateStore } from "../../../store/Store";
import ToggleSwtich from "../Interactions/ToggleSwitch";
import PDUVIew from "./PDUVIew";

export default function Cabinet({ pageView }) {
  const currentCabinetID = APIStore((s) => s.data.CurrentCabinetID);
  const currentLocationID = APIStore((s) => s.data.CurrnetLocationID);
  const cabinetsInLocation = APIStore((s) => s.data.CabinetsInLocation);
  const pullAllAssetFromCabinet = APIStore((s) => s.pullAllAssetFromCabinet);
  const setMessage = APIStore((s) => s.setResponseMessage);
  const AssetsInCabinet = APIStore((s) => s.data.AssetsInCabinet);
  const CurrentCabinetName = APIStore((s) => s.data.CurrentCabinetName);
  const ShowEmptyUPToggleWatcher = ReuseDataStateStore((s) => s.data.ShowEmptyUPToggleWatcher);
  const showPDUToggleWatcher = ReuseDataStateStore((s) => s.data.ShowPDUToggleWatcher);
  const setShowEmptyUPToggleWatcher = ReuseDataStateStore((s) => s.setShowEmptyUPToggleWatcher);
  const setSelectedInCabinetAsset = ReuseDataStateStore((s) => s.setSelectedInCabinetAsset);
  const setCabinetActionBar = ReuseDataStateStore((s) => s.setCabinetActionBar);
  const LOCATIONCODE = APIStore((s) => s.data.LOCATIONCODE);
  const setCurrentCabinetID = APIStore((s) => s.setCurrentCabinetID);
  // const [selectedCabinet, setSelectedCabinet] = React.useState(null);

  React.useEffect(() => {
    const missing = !LOCATIONCODE || !currentCabinetID;

    if (missing && pageView === 1) {
      setMessage({
        type: "setCabLocInfo",
        text: "Please select a location and cabinet to view cabinet details.",
        label: "Select Location and Cabinet",
      });
    } else {
      setMessage({});
    }
  }, [LOCATIONCODE, currentCabinetID, setMessage, pageView]);

  React.useEffect(() => {
    if (currentCabinetID) {
      pullAllAssetFromCabinet(currentCabinetID);
    }
  }, [currentCabinetID]);

  if (!LOCATIONCODE || !currentCabinetID) {
    return <div>Please select a location and cabinet.</div>;
  }

  const cabinetHeight = 42;

  const uList = Array.from({ length: cabinetHeight }, (_, i) => (i + 1).toString());

  // Build two maps:
  // startMap: RU → item at starting RU only
  // skipSet: all RUs that belong to multi-RU items except start
  const startMap = {};
  const skipSet = new Set();

  (AssetsInCabinet?.cabinetItems || []).forEach((item) => {
    if (item.mounting === "ZeroU") return;
    const start = item.cmbUPosition;
    const count = item.tiRackUnits;

    startMap[start] = item;

    for (let i = 1; i < count; i++) {
      skipSet.add(start + i);
    }
  });

  if (showPDUToggleWatcher) {
    return (
      <div>
        <PDUVIew />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-row justify-between px-4 m-4">
        <h2 className="font-bold text-lg">{CurrentCabinetName}</h2>
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
              return (
                <FilledUPosition
                  key={ru}
                  ru={ru}
                  item={startMap[ruNum]}
                  setSelectedInCabinetAsset={setSelectedInCabinetAsset}
                  setCabinetActionBar={setCabinetActionBar}
                />
              );
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
const innerBoxStyle =
  "w-full h-full flex flex-row gap-2 pr-2 border border-gray-400 rounded px-2 py-1 bg-white items-center justify-between";
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

function FilledUPosition({ ru, item, setSelectedInCabinetAsset, setCabinetActionBar }) {
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
      <div className="flex flex-row w-full h-full items-center">
        <div className={innerBoxStyle}>
          <span type="text" className="">{`${item.tiName}`}</span>
          <div className="flex flex-row text-sm gap-2">
            <span type="text" className="">{`${item.cmbMake}`}</span>
            <span type="text" className="">{`${item.cmbModel}`}</span>
          </div>
        </div>
        <div className="w-[15%] flex justify-center">
          <button
            className="border px-2 bg-green-500 rounded-md h-8"
            onClick={() => {
              setSelectedInCabinetAsset(item);
              setCabinetActionBar(1);
            }}
          >
            Act
          </button>
        </div>
      </div>
    </div>
  );
}
