import React from "react";
import { APIStore, ReuseDataStateStore } from "../../../store/Store";
import { Modes_Styles, CabinetLayoutStyles } from "../../../Styles";

export default function PDUVIew() {
  const currentCabinetID = APIStore((s) => s.data.CurrentCabinetID);
  const ZeroUAssetsInCabinet = APIStore((s) => s.data.ZeroUAssetsInCabinet);
  const setSelectedInCabinetAsset = ReuseDataStateStore((s) => s.setSelectedInCabinetAsset);
  const setCabinetActionBar = ReuseDataStateStore((s) => s.setCabinetActionBar);
  const CurrentCabinetName = APIStore((s) => s.data.CurrentCabinetName);
  const darkMode = ReuseDataStateStore((s) => s.data.DarkMode);

  const theme = darkMode ? Modes_Styles.DarkMode : Modes_Styles.LightMode;
  const ui = {
    ...CabinetLayoutStyles,
    ...theme,
  };

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

  return (
    <div className={`${ui.wrapper} ${ui.cabinetWrapper}`}>
      <div className={ui.headerRow}>
        <h2 className={`font-bold text-lg ${ui.cabinetHeader}`}>{CurrentCabinetName}</h2>
      </div>

      <div className="flex flex-row w-full h-full gap-4">
        {/* Left */}
        <div className="w-full border rounded-lg ml-4">
          <div className="flex flex-row justify-center">
            <span className={ui.cabinetHeader}>Left</span>
          </div>

          <div className="flex flex-row justify-around h-[35rem] px-2">
            {positionsLeft.map((pos, idx) => {
              const item = ZeroUAssetsInCabinet.find(
                (z) => z.radioDepthPosition === pos.depth && z.radioCabinetSide.split(" ")[0] === pos.side
              );

              return (
                <PositionItems
                  key={idx}
                  pos={pos}
                  item={item}
                  ui={ui}
                  setCabinetActionBar={setCabinetActionBar}
                  setSelectedInCabinetAsset={setSelectedInCabinetAsset}
                />
              );
            })}
          </div>
        </div>

        {/* Right */}
        <div className="w-full border rounded-lg mr-4">
          <div className="flex flex-row justify-center">
            <span className={ui.cabinetHeader}>Right</span>
          </div>

          <div className="flex flex-row justify-around h-[35rem] px-2">
            {positionsRight.map((pos, idx) => {
              const item = ZeroUAssetsInCabinet.find(
                (z) => z.radioDepthPosition === pos.depth && z.radioCabinetSide.split(" ")[0] === pos.side
              );

              return (
                <PositionItems
                  key={idx}
                  pos={pos}
                  item={item}
                  ui={ui}
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

function PositionItems({ pos, item, ui, setSelectedInCabinetAsset, setCabinetActionBar }) {
  return (
    <div className="flex flex-col justify-between border">
      <div className="flex flex-row justify-around">
        <span className={ui.cabinetHeader}>{pos.depth[0]}</span>
      </div>

      <div className="flex flex-row gap-1 h-full">
        {item ? (
          <div className="w-[3rem] h-full border-gray-400 rounded flex flex-col items-center justify-between p-1 gap-2">
            <div className={`flex flex-col items-center justify-between w-full flex-1 rounded px-2 py-1 ${ui.filledUInner}`}>
              <div className="rotate-90 w-[50%] whitespace-nowrap text-center">
                <div className="flex flex-row justify-start">{item.tiName}</div>
              </div>
              <div className="rotate-90 w-[50%] whitespace-nowrap text-sm text-center">
                <div className="flex flex-row justify-end">
                  {item.cmbMake} {item.cmbModel}
                </div>
              </div>
            </div>

            <button
              className={ui.actButton}
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
            <div className={`flex flex-col items-center justify-between w-full flex-1 rounded px-2 py-1 ${ui.emptyU}`}>
              <div className="rotate-90 w-[50%] whitespace-nowrap text-center">
                <div className="flex flex-row justify-start">Empty</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
