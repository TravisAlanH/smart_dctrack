import React from "react";
import { APIStore } from "../../../store/Store";

export default function PDUVIew() {
  const currentCabinetID = APIStore((s) => s.data.CurrentCabinetID);
  const cabinetsInLocation = APIStore((s) => s.data.CabinetsInLocation);
  const ZeroUAssetsInCabinet = APIStore((s) => s.data.ZeroUAssetsInCabinet);
  const setSelectedInCabinetAsset = APIStore((s) => s.setSelectedInCabinetAsset);
  const setCabinetActionBar = APIStore((s) => s.setCabinetActionBar);

  const selectedCabinet =
    (cabinetsInLocation?.cabinets || []).find((cab) => cab.cabinetId.toString() === currentCabinetID) || null;

  const positionsLeft = [
    { depth: "Back", side: "Left" },
    { depth: "Center", side: "Left" },
    { depth: "Front", side: "Left" },
  ];

  const positionsRight = [
    { depth: "Front", side: "Right" },
    { depth: "Center", side: "Right" },
    { depth: "Back", side: "Right" },
  ];

  const wrapper = "flex flex-row w-full h-full gap-4";
  const columnBox = "w-full border rounded-lg";
  const leftColumn = `${columnBox} ml-4`;
  const rightColumn = `${columnBox} mr-4`;

  const headerRow = "flex flex-row justify-center";
  const headerText = "text-white p-2";

  const positionsRow = "flex flex-row justify-around h-[35rem] px-2";
  const titleRow = "flex flex-row justify-between";
  const titleText = "font-bold text-lg";

  return (
    <div>
      <div className={titleRow}>
        <h2 className={titleText}>{selectedCabinet?.cabinet || "Cabinet Not Found"}</h2>
      </div>

      <div className={wrapper}>
        <div className={leftColumn}>
          <div className={headerRow}>
            <span className={headerText}>Left</span>
          </div>

          <div className={positionsRow}>
            {positionsLeft.map((pos, idx) => {
              const item = ZeroUAssetsInCabinet.find(
                (z) => z.radioDepthPosition === pos.depth && z.radioCabinetSide.split(" ")[0] === pos.side
              );
              return (
                <PositionItems
                  key={idx}
                  pos={pos}
                  item={item}
                  setCabinetActionBar={setCabinetActionBar}
                  setSelectedInCabinetAsset={setSelectedInCabinetAsset}
                />
              );
            })}
          </div>
        </div>

        <div className={rightColumn}>
          <div className={headerRow}>
            <span className={headerText}>Right</span>
          </div>

          <div className={positionsRow}>
            {positionsRight.map((pos, idx) => {
              const item = ZeroUAssetsInCabinet.find(
                (z) => z.radioDepthPosition === pos.depth && z.radioCabinetSide.split(" ")[0] === pos.side
              );
              return (
                <PositionItems
                  key={idx}
                  pos={pos}
                  item={item}
                  setCabinetActionBar={setCabinetActionBar}
                  setSelectedInCabinetAsset={setSelectedInCabinetAsset}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

const boxStyleEmpty = "flex flex-row items-center bg-slate-400 mx-3 rounded-md py-1 h-9";
const labelDivStyle = "flex flex-col h-10 w-10 justify-center items-center";
const labelStyle = "text-sm";
const innerBoxStyleEmpty = "w-full h-full flex flex-row gap-2 pr-2";
const innerBoxStyle =
  "w-[2.5rem] h-full flex flex-col justify-between gap-2 pr-2 border border-gray-400 rounded px-2 py-1 bg-white";
const inputStyle = "border border-gray-400 rounded px-2 py-1 text-sm w-full bg-white";
const inputStyleEmpty = "border border-gray-400 rounded px-2 py-1 text-sm w-full bg-gray-400";

function PositionItems({ pos, item, idx, setSelectedInCabinetAsset, setCabinetActionBar }) {
  return (
    <div key={idx} className="flex flex-col justify-between border">
      <div className="flex flex-row justify-around">
        <span className="text-white">{pos.depth[0]}</span>
      </div>
      <div className="flex flex-row gap-1 h-full">
        {item ? (
          <div className="w-[3rem] h-full border-gray-400 rounded flex flex-col items-center justify-between p-1 gap-2">
            <div className="flex flex-col items-center justify-between w-full flex-1  bg-white rounded px-2 py-1">
              <div className="rotate-90 w-[50%] whitespace-nowrap text-center">
                <div className=" flex flex-row justify-start">{item.tiName}</div>
              </div>
              <div className="rotate-90 w-[50%] whitespace-nowrap text-sm text-center">
                <div className=" flex flex-row justify-end">
                  {item.cmbMake} {item.cmbModel}
                </div>
              </div>
            </div>

            <button
              className="border px-2 bg-green-500 rounded-md h-10 w-full"
              onClick={() => {
                setSelectedInCabinetAsset(item);
                setCabinetActionBar(1);
              }}
            >
              Act
            </button>
          </div>
        ) : (
          <div className="w-[3rem] h-full border-gray-400 rounded flex flex-col items-center justify-between p-1 gap-2">
            <div className="flex flex-col items-center justify-between w-full flex-1  bg-slate-400 rounded px-2 py-1">
              <div className="rotate-90 w-[50%] whitespace-nowrap text-center">
                <div className=" flex flex-row justify-start">Empty</div>
              </div>
              <div className="rotate-90 w-[50%] whitespace-nowrap text-sm text-center"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
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
