import React from "react";
import { APIStore, ReuseDataStateStore } from "../../../store/Store";
import PDUVIew from "./PDUVIew";
import SOPButton from "../Interactions/Buttons/SOPButton";
import { getStyles } from "../../../Styles";

export default function Cabinet({ pageView }) {
  const darkMode = ReuseDataStateStore((s) => s.data.DarkMode);
  const ui = getStyles();
  const currentCabinetID = APIStore((s) => s.data.CurrentCabinetID);
  const LOCATIONCODE = APIStore((s) => s.data.LOCATIONCODE);
  const pullAllAssetFromCabinet = APIStore((s) => s.pullAllAssetFromCabinet);
  const setMessage = APIStore((s) => s.setResponseMessage);
  const AssetsInCabinet = APIStore((s) => s.data.AssetsInCabinet);
  const CurrentCabinetName = APIStore((s) => s.data.CurrentCabinetName);
  const CassisModelsInCabinet = APIStore((s) => s.data.CassisModelsInCabinet);

  const ShowEmptyUPToggleWatcher = ReuseDataStateStore((s) => s.data.ShowEmptyUPToggleWatcher);
  const showPDUToggleWatcher = ReuseDataStateStore((s) => s.data.ShowPDUToggleWatcher);
  const setSelectedInCabinetAsset = ReuseDataStateStore((s) => s.setSelectedInCabinetAsset);
  const setCabinetActionBar = ReuseDataStateStore((s) => s.setCabinetActionBar);
  const cabinetViewFrontBack = ReuseDataStateStore((s) => s.data.cabinetViewFrontBack);
  const setCabinetViewFrontBack = ReuseDataStateStore((s) => s.setCabinetViewFrontBack);

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
  }, [LOCATIONCODE, currentCabinetID, pageView, setMessage]);

  React.useEffect(() => {
    if (currentCabinetID) {
      pullAllAssetFromCabinet(currentCabinetID);
    }
  }, [currentCabinetID, pullAllAssetFromCabinet]);

  if (!LOCATIONCODE || !currentCabinetID) {
    return (
      <div className="flex flex-row justify-between p-4">
        <span className="text-base " style={ui.text}>
          Please select a location and cabinet
        </span>
        <SOPButton />
      </div>
    );
  }

  if (showPDUToggleWatcher) {
    return (
      <div className="w-full h-full overflow-y-auto">
        <PDUVIew />
      </div>
    );
  }

  const cabinetHeight = 42;
  const uList = Array.from({ length: cabinetHeight }, (_, i) => (i + 1).toString());

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

  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={ui.text}>
      <div className="flex flex-row items-center justify-between px-4 pt-2 pb-1">
        <h2 className="font-bold text-base truncate max-w-[65%] " style={ui.pageHeaderText}>
          {CurrentCabinetName}
        </h2>
        <div className="flex flex-row gap-2 items-center">
          <button
            className="text-base border rounded px-2 py-1 "
            style={ui.baseButton}
            onClick={() => {
              const railArray = ["Front", "Back"];
              const currentRail = railArray.indexOf(cabinetViewFrontBack);
              const nextRail = currentRail + 1 >= railArray.length ? 0 : currentRail + 1;
              setCabinetViewFrontBack(railArray[nextRail]);
            }}
          >
            {cabinetViewFrontBack} Rail
          </button>
          <SOPButton />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-24">
        <div className="flex flex-col gap-2">
          {uList
            .slice()
            .reverse()
            .map((ru) => {
              const ruNum = Number(ru);

              if (skipSet.has(ruNum)) {
                return null;
              }

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
                    ui={ui}
                  />
                );
              }

              if (ShowEmptyUPToggleWatcher) {
                return null;
              }

              return <EmptyUPosition key={ru} ru={ru} ui={ui} />;
            })}
        </div>
      </div>
    </div>
  );
}

function EmptyUPosition({ ru, ui }) {
  return (
    <div className="flex flex-row items-center rounded-md h-10 px-2" style={ui.CardEmptyBackGround}>
      <div className="flex flex-col h-full w-10 justify-center items-center">
        <label className="text-base">{ru}</label>
      </div>

      <div className="flex-1 h-full flex items-center">
        <input
          style={ui.text}
          type="text"
          className="border border-gray-500 rounded px-2 py-1 text-base w-full bg-gray-400"
          value="Empty"
          readOnly
        />
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
  ui,
}) {
  const minHeight = `${item.tiRackUnits * 2.3}rem`;

  const renderBody = () => {
    if (cabinetViewFrontBack === "Front") {
      if (item.radioRailsUsed === "Back") {
        return (
          <HalfView
            item={item}
            setSelectedInCabinetAsset={setSelectedInCabinetAsset}
            setCabinetActionBar={setCabinetActionBar}
            Rail="Back"
            ui={ui}
          />
        );
      }
      return (
        <FullView
          item={item}
          setSelectedInCabinetAsset={setSelectedInCabinetAsset}
          setCabinetActionBar={setCabinetActionBar}
          CassisModelsInCabinet={CassisModelsInCabinet}
          cabinetViewFrontBack="Front"
          ui={ui}
        />
      );
    }

    if (cabinetViewFrontBack === "Back") {
      if (item.radioRailsUsed === "Front") {
        return (
          <HalfView
            item={item}
            setSelectedInCabinetAsset={setSelectedInCabinetAsset}
            setCabinetActionBar={setCabinetActionBar}
            Rail="Front"
            ui={ui}
          />
        );
      }
      return (
        <FullView
          item={item}
          setSelectedInCabinetAsset={setSelectedInCabinetAsset}
          setCabinetActionBar={setCabinetActionBar}
          CassisModelsInCabinet={CassisModelsInCabinet}
          cabinetViewFrontBack="Back"
          ui={ui}
        />
      );
    }

    return (
      <FullView
        item={item}
        setSelectedInCabinetAsset={setSelectedInCabinetAsset}
        setCabinetActionBar={setCabinetActionBar}
        CassisModelsInCabinet={CassisModelsInCabinet}
        cabinetViewFrontBack={cabinetViewFrontBack}
        ui={ui}
      />
    );
  };

  return (
    <div className="flex flex-row items-stretch rounded-md px-2 py-1" style={{ minHeight, ...ui.CardBackGround }}>
      <div className="flex flex-col w-10 justify-around items-center">
        {[...Array(item.tiRackUnits)].map((_, idx) => {
          const start = Number(ru);
          const size = item.tiRackUnits;
          const value = start + (size - 1) - idx;
          return (
            <label className="text-base" key={idx}>
              {value}
            </label>
          );
        })}
      </div>

      <div className="flex-1 flex flex-row items-center overflow-hidden">{renderBody()}</div>

      <div className="w-16 flex justify-center items-center pl-1">
        <button
          className="border  px-2 rounded-md h-8 text-base "
          style={ui.baseButton}
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

function FullView({ item, setSelectedInCabinetAsset, setCabinetActionBar, CassisModelsInCabinet, cabinetViewFrontBack, ui }) {
  function trimName(str) {
    if (!str) return "";
    if (str.length > 27) return str.slice(0, 27) + "...";
    return str;
  }

  const isChassis = item.formFactor === "Chassis";

  let chassisSlots = null;
  if (isChassis && Array.isArray(CassisModelsInCabinet) && CassisModelsInCabinet.length > 0) {
    const modelId = item.modelId;
    const chassisModel = CassisModelsInCabinet.find((m) => m && m.modelId === modelId);
    if (chassisModel && Array.isArray(chassisModel.chassisFaces)) {
      const face = chassisModel.chassisFaces.find((f) => f.face === cabinetViewFrontBack);
      if (face && Array.isArray(face.chassisSlots)) {
        chassisSlots = face.chassisSlots;
      }
    }
  }

  return (
    <div className="w-full h-full flex flex-col gap-1 border  rounded px-2 py-1 overflow-hidden" style={ui.CardTextBackGround}>
      <div className={`w-full flex flex-row items-center justify-between gap-2 ${isChassis ? "min-h-[2.5rem]" : ""}`}>
        <span className="text-base truncate max-w-[50%]">{item.tiName}</span>

        <div className="flex flex-row text-xs gap-1 justify-end w-1/2">
          <span className="truncate text-right max-w-[40%] text-base">{trimName(item.cmbMake)}</span>
          <span className="truncate max-w-[60%] text-base">{trimName(item.cmbModel)}</span>
        </div>
      </div>

      {isChassis && chassisSlots ? (
        <div className="w-full flex-1 overflow-hidden">
          <SlotView
            Chassis={item}
            slots={chassisSlots}
            cabinetViewFrontBack={cabinetViewFrontBack}
            rackUnits={item.tiRackUnits}
            ui={ui}
          />
        </div>
      ) : null}
    </div>
  );
}

function HalfView({ item, setSelectedInCabinetAsset, setCabinetActionBar, Rail, ui }) {
  return (
    <div className="flex flex-row w-full h-full items-center">
      <div
        className="flex flex-row flex-1 h-full justify-center items-center px-2 py-1 rounded"
        style={{
          backgroundImage: "repeating-linear-gradient(45deg, #737373 0 2px, transparent 2px 6px)",
        }}
      >
        <div className=" px-2 py-1 rounded-md text-base " style={{ ...ui.CardTextBackGround, ...ui.text }}>
          {Rail} Rail
        </div>
      </div>
    </div>
  );
}

function SlotView({ Chassis, slots, cabinetViewFrontBack, rackUnits, ui }) {
  const hasAnchor = slots.some((s) => s.anchor === true);

  if (hasAnchor) {
    return (
      <AnchoredSlotView
        Chassis={Chassis}
        slots={slots}
        cabinetViewFrontBack={cabinetViewFrontBack}
        rackUnits={rackUnits}
        ui={ui}
      />
    );
  }
  return (
    <NonAnchoredSlotView
      Chassis={Chassis}
      slots={slots}
      cabinetViewFrontBack={cabinetViewFrontBack}
      rackUnits={rackUnits}
      ui={ui}
    />
  );

  const count = slots.length;

  const sorted = [...slots].sort((a, b) => {
    const numA = Number(a.slotLabel);
    const numB = Number(b.slotLabel);

    if (!Number.isNaN(numA) && !Number.isNaN(numB)) {
      return numA - numB;
    }
    return String(a.slotLabel).localeCompare(String(b.slotLabel));
  });

  const half = Math.ceil(count / 2);
  const SlotsTop = sorted.slice(0, half);
  const SlotsBottom = sorted.slice(half);

  const containerBase = "flex flex-col gap-1 w-full max-w-full overflow-x-auto overflow-y-hidden";

  const slotRowClass = "flex flex-row gap-1";

  const slotBoxClass =
    "flex flex-col items-center justify-center text-center border rounded px-1 py-1 " +
    "min-w-[3rem] max-w-[4rem] h-[6rem] text-base bg-slate-50 text-black";

  // if anchor true split between two and bottom
  // else each slot is its own

  return (
    <div className={containerBase}>
      {rackUnits <= 4 ? (
        <div className="flex flex-row gap-1 w-full overflow-x-auto">
          {sorted.map((slot) => (
            <div key={slot.slotId} className={slotBoxClass}>
              <span>{`Slot ${slot.slotNumber}`}</span>
              <span>{`${cabinetViewFrontBack} Face`}</span>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className={slotRowClass}>
            {SlotsBottom.map((slot) => (
              <div key={slot.slotId} className={slotBoxClass}>
                <span>{`Slot ${slot.slotNumber}`}</span>
                <span>{`${cabinetViewFrontBack} Face`}</span>
              </div>
            ))}
          </div>
          <div className={slotRowClass}>
            {SlotsTop.map((slot) => (
              <div key={slot.slotId} className={slotBoxClass}>
                <span>{`Slot ${slot.slotNumber}`}</span>
                <span>{`${cabinetViewFrontBack} Face`}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function AnchoredSlotView({ Chassis, slots, cabinetViewFrontBack, ui }) {
  const BladesInCabinet = APIStore((s) => s.data.BladesInCabinet);
  const BladesInChassis = BladesInCabinet.filter((b) => b.cmbChassis === Chassis.tiName);
  const BladesInView = BladesInChassis.filter((b) => b.radioChassisFace === cabinetViewFrontBack);

  const sorted = [...slots].sort((a, b) => a.slotLabel - b.slotLabel);
  const half = Math.floor(sorted.length / 2);

  const top = sorted.slice(0, half);
  const bottom = sorted.slice(half);

  const containerBase = "flex flex-col gap-1 w-full max-w-full overflow-x-auto overflow-y-hidden pb-2";
  const slotRowClass = "flex flex-row gap-1";

  const box =
    "flex flex-col items-center justify-between text-center border rounded px-1 py-1 " +
    "min-w-[2.5rem] max-w-[2.5rem] h-[8rem] text-base";

  const boxRed =
    "flex flex-col items-center justify-between text-center border rounded px-1 py-1 " +
    "min-w-[2.5rem] max-w-[2.5rem] h-[8rem] text-base";

  const boxRedFull =
    "flex flex-col items-center justify-between text-center border rounded px-1 pt-1 " +
    "min-w-[2.5rem] max-w-[2.5rem] h-[16rem] text-base";

  // helper
  function isBladeInSlot(label) {
    return BladesInView.find((b) => String(b.cmbSlotPosition) === String(label));
  }

  function isBladeInSlotFull(blade) {
    return blade.tiFormFactor === "Full";
  }

  return (
    <div className={containerBase}>
      <div className={slotRowClass}>
        {top.map((slot, idx) => {
          const paired = bottom[idx];

          const bladeTop = isBladeInSlot(slot.slotLabel);
          const bladeBottom = isBladeInSlot(paired.slotLabel);

          const bladeTopFull = bladeTop ? isBladeInSlotFull(bladeTop) : false;
          const bladeBottomFull = bladeBottom ? isBladeInSlotFull(bladeBottom) : false;

          // if (bladeTop) console.log("Top match", slot.slotLabel, bladeTop);
          // if (bladeBottom) console.log("Bottom match", paired.slotLabel, bladeBottom);

          return (
            <div key={slot.modelChassisSlotId} className="flex flex-col items-center gap-2">
              {/* top slot */}
              {bladeTopFull || bladeBottomFull ? (
                <div
                  className={boxRedFull}
                  style={bladeTop?.tiName || bladeBottom?.tiName ? ui.BladeFilledBackground : ui.BladeBackground}
                >
                  <div className="flex flex-col items-center justify-between w-full flex-1">
                    <div className="rotate-90 w-[50%] whitespace-nowrap text-center">
                      <div className=" flex flex-row justify-start">{bladeTop?.tiName || bladeBottom?.tiName || ""}</div>
                    </div>
                  </div>
                  <ActionButtons item={bladeTop || bladeBottom} ui={ui} />
                </div>
              ) : (
                <div>
                  <div className={bladeTop ? boxRed : box} style={bladeBottom ? ui.BladeFilledBackground : ui.BladeBackground}>
                    <span>{slot.slotLabel}</span>
                    {bladeTop ? <ActionButtons item={bladeTop} ui={ui} /> : slot.anchor ? <span>A</span> : null}
                  </div>

                  {/* bottom slot */}
                  <div className={bladeBottom ? boxRed : box} style={bladeBottom ? ui.BladeFilledBackground : ui.BladeBackground}>
                    <span>{paired.slotLabel}</span>
                    {bladeBottom ? <ActionButtons item={bladeBottom} ui={ui} /> : paired.anchor ? <span>A</span> : null}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NonAnchoredSlotView({ Chassis, slots, cabinetViewFrontBack, ui }) {
  const BladesInCabinet = APIStore((s) => s.data.BladesInCabinet);
  const BladesInChassis = BladesInCabinet.filter((b) => b.cmbChassis === Chassis.tiName);
  const BladesInView = BladesInChassis.filter((b) => b.radioChassisFace === cabinetViewFrontBack);
  const sorted = [...slots].sort((a, b) => a.slotLabel - b.slotLabel);
  const containerBase = "flex flex-col gap-1 w-full max-w-full overflow-x-auto overflow-y-hidden pb-2";
  const slotRowClass = "flex flex-row gap-1";

  const box =
    "flex flex-col items-center justify-between text-center border rounded px-1 py-1 " +
    "min-w-[2.5rem] max-w-[2.5rem] h-[8rem] text-base";

  const boxRed =
    "flex flex-col items-center justify-between text-center border rounded px-1 pt-1 " +
    "min-w-[2.5rem] max-w-[2.5rem] h-[8rem] text-base";

  // helper
  function isBladeInSlot(label) {
    return BladesInView.find((b) => String(b.cmbSlotPosition) === String(label));
  }

  return (
    <div className={containerBase}>
      <div className={slotRowClass}>
        {sorted.map((slot) => {
          const bladeTop = isBladeInSlot(slot.slotLabel);
          return (
            <div key={slot.modelChassisSlotId} className="flex flex-col justify-between items-center gap-2">
              {/* top slot */}

              <div className={bladeTop ? boxRed : box} style={bladeTop ? ui.BladeFilledBackground : ui.BladeBackground}>
                {bladeTop ? (
                  <div className="flex flex-col items-center justify-between w-full flex-1">
                    <div className="rotate-90 w-[50%] whitespace-nowrap text-center">
                      <div className=" flex flex-row justify-start">{bladeTop?.tiName || ""}</div>
                    </div>
                  </div>
                ) : (
                  <span>{slot.slotLabel}</span>
                )}
                {bladeTop ? <ActionButtons item={bladeTop} /> : slot.anchor ? <span>A</span> : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ActionButtons({ item, ui }) {
  const setSelectedInCabinetAsset = ReuseDataStateStore((s) => s.setSelectedInCabinetAsset);
  const setCabinetActionBar = ReuseDataStateStore((s) => s.setCabinetActionBar);
  return (
    <div className="flex flex-col gap-2">
      <button
        className="border rounded-md h-10 w-full text-base px-1"
        style={ui.baseButton}
        onClick={() => {
          setSelectedInCabinetAsset(item);
          setCabinetActionBar(1);
        }}
      >
        Act
      </button>
    </div>
  );
}
