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
  const cabinetViewFrontBack = ReuseDataStateStore((s) => s.data.cabinetViewFrontBack);
  const setCabinetViewFrontBack = ReuseDataStateStore((s) => s.setCabinetViewFrontBack);
  const CassisModelsInCabinet = APIStore((s) => s.data.CassisModelsInCabinet);
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
        <button
          onClick={() => {
            const railArray = ["Front", "Back"];
            const currentRail = railArray.indexOf(cabinetViewFrontBack);
            let nextRail = currentRail + 1;

            if (nextRail >= railArray.length) nextRail = 0;

            setCabinetViewFrontBack(railArray[nextRail]);
          }}
        >
          {`${cabinetViewFrontBack} Rail`}
        </button>
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
                  cabinetViewFrontBack={cabinetViewFrontBack}
                  CassisModelsInCabinet={CassisModelsInCabinet}
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
const labelStyle = "text-sm hover:font-bold";
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

function FilledUPosition({
  ru,
  item,
  setSelectedInCabinetAsset,
  setCabinetActionBar,
  cabinetViewFrontBack,
  CassisModelsInCabinet,
}) {
  const height = `${item.tiRackUnits * 2.5}rem`;
  const lableHeight = `${item.tiRackUnits * 2.5}rem`;

  return (
    <div className="flex flex-row items-center justify-center bg-slate-300 mx-3 rounded-md py-1" style={{ height }}>
      <div className="flex flex-col w-10 justify-around items-center" style={{ height: lableHeight }}>
        {[...Array(item.tiRackUnits)].map((_, idx) => {
          const start = Number(ru);
          const size = item.tiRackUnits;
          const value = start + (size - 1) - idx;
          // console.log(item.tiName, item);
          return (
            <label className={labelStyle} key={idx}>
              {value}
            </label>
          );
        })}
      </div>
      {cabinetViewFrontBack === "Front"
        ? (() => {
            if (item.radioRailsUsed === "Back") {
              return (
                <HalfView
                  item={item}
                  setSelectedInCabinetAsset={setSelectedInCabinetAsset}
                  setCabinetActionBar={setCabinetActionBar}
                  Rail="Back"
                />
              );
            }
            return (
              <FullView
                item={item}
                setSelectedInCabinetAsset={setSelectedInCabinetAsset}
                setCabinetActionBar={setCabinetActionBar}
                CassisModelsInCabinet={CassisModelsInCabinet}
                cabinetViewFrontBack={"Front"}
              />
            );
          })()
        : cabinetViewFrontBack === "Back"
        ? (() => {
            if (item.radioRailsUsed === "Front") {
              return (
                <HalfView
                  item={item}
                  setSelectedInCabinetAsset={setSelectedInCabinetAsset}
                  setCabinetActionBar={setCabinetActionBar}
                  Rail="Front"
                />
              );
            }
            return (
              <FullView
                item={item}
                setSelectedInCabinetAsset={setSelectedInCabinetAsset}
                setCabinetActionBar={setCabinetActionBar}
                CassisModelsInCabinet={CassisModelsInCabinet}
                cabinetViewFrontBack={"Back"}
              />
            );
          })()
        : (() => {
            return (
              <FullView
                item={item}
                setSelectedInCabinetAsset={setSelectedInCabinetAsset}
                setCabinetActionBar={setCabinetActionBar}
                CassisModelsInCabinet={CassisModelsInCabinet}
                cabinetViewFrontBack={cabinetViewFrontBack}
              />
            );
          })()}
    </div>
  );
}

function FullView({ item, setSelectedInCabinetAsset, setCabinetActionBar, CassisModelsInCabinet, cabinetViewFrontBack }) {
  function trimName(str) {
    if (!str) return "";
    if (str.length > 27) return str.slice(0, 27) + "...";
    return str;
  }

  return (
    <div className="flex flex-row w-full h-full items-center">
      <div
        className={`w-full h-full flex flex-col gap-2 pr-2 border border-gray-400 rounded px-2 py-1 bg-white justify-between items-center `}
      >
        <div
          className={`w-full flex flex-row gap-2 pr-2 rounded px-2 py-1 items-center justify-between  ${
            item.formFactor === "Chassis" ? "h-[3rem]" : "h-full"
          }`}
        >
          <span type="text" className="">{`${item.tiName}`}</span>
          <div className="flex flex-row text-sm gap-2 text-right w-[50%]">
            <span type="text" className="text-right">{`${trimName(item.cmbMake)}`}</span>
            <span type="text" className="">{`${trimName(item.cmbModel)}`}</span>
          </div>
        </div>

        {item.formFactor === "Chassis"
          ? (() => {
              const modelId = item.modelId;
              const chassisModel = CassisModelsInCabinet.find((m) => m && m.modelId === modelId);
              if (!chassisModel) {
                return null;
              }
              const faces = chassisModel.chassisFaces;
              if (!faces || !Array.isArray(faces) || faces.length === 0) {
                return null;
              }
              const face = faces.find((f) => f.face === cabinetViewFrontBack);
              if (!face) {
                return null;
              }
              const slots = face.chassisSlots;
              return <SlotView slots={slots} cabinetViewFrontBack={cabinetViewFrontBack} rackUnits={item.tiRackUnits} />;
            })()
          : null}
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
  );
}

function HalfView({ item, setSelectedInCabinetAsset, setCabinetActionBar, Rail }) {
  return (
    <div className="flex flex-row w-full h-full justify-end items-center">
      <div
        className="flex flex-row w-full h-full justify-center items-center p-2"
        style={{
          backgroundImage: "repeating-linear-gradient(45deg, #ccc 0 2px, transparent 2px 6px)",
        }}
      >
        <div className="bg-white px-2 rounded-md">{`${Rail} Rail`}</div>
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
  );
}

function SlotView({ slots, cabinetViewFrontBack, rackUnits }) {
  const [screenWidth, setScreenWidth] = React.useState(window.innerWidth);

  React.useEffect(() => {
    function handleResize() {
      setScreenWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const count = slots.length;

  const sorted = [...slots].sort((a, b) => {
    const numA = Number(a.slotLabel);
    const numB = Number(b.slotLabel);
    if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
    return a.slotLabel.localeCompare(b.slotLabel);
  });

  const half = Math.ceil(count / 2);

  const SlotsTop = sorted.slice(0, half);
  const SlotsBottom = sorted.slice(half);

  console.log("Screen width:", screenWidth);
  console.log("SlotsTop:", SlotsTop);

  return (
    <div className="flex flex-col w-full gap-2  overflow-auto">
      {rackUnits <= 4 ? (
        <div className={`flex flex-col overflow-auto ${screenWidth < 400 ? "w-[15rem]" : "w-[18rem]"}`}>
          <div className="flex flex-row">
            {sorted.map((slot) => (
              <div
                key={slot.slotId}
                className="p-2 border rounded bg-white text-center flex items-center justify-center w-[3rem] h-[9em]"
              >
                <span>{`Slot ${slot.slotNumber} - ${cabinetViewFrontBack} Face`}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={`flex flex-col overflow-auto ${screenWidth < 400 ? "w-[15rem]" : "w-[18rem]"}`}>
          <div className="flex flex-row">
            {SlotsBottom.map((slot) => (
              <div
                key={slot.slotId}
                className="p-2 border rounded bg-white text-center flex items-center justify-center w-[3rem] h-[9rem]"
              >
                <span>{`Slot ${slot.slotNumber} - ${cabinetViewFrontBack} Face`}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-row">
            {SlotsTop.map((slot) => (
              <div
                key={slot.slotId}
                className="p-2 border rounded bg-white text-center flex items-center justify-center w-[3rem] h-[9rem]"
              >
                <span>{`Slot ${slot.slotNumber} - ${cabinetViewFrontBack} Face`}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
