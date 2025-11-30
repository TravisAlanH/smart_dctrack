import React from "react";
import { APIStore, ReuseDataStateStore } from "../../../store/Store";
import { header } from "../Helpers/HeadersAsObjects";
import { dcTrack_ENDPOINTS } from "../Helpers/dcTrackAPIReturns";
import ToggleSwitch from "../Interactions/ToggleSwitch";
import { dcTrack_COPY_REQUIRED } from "../Helpers/dcTrackCopyRequiredList";
import { MdDelete, MdFileCopy, MdEditSquare, MdOutlineClose } from "react-icons/md";

export default function CabinetActionBar({ style: button, setShow }) {
  const cabinetActionBar = ReuseDataStateStore((s) => s.data.cabinetActionBar);
  const SelectedInCabinetAsset = ReuseDataStateStore((s) => s.data.SelectedInCabinetAsset);
  const setCabinetActionBar = ReuseDataStateStore((s) => s.setCabinetActionBar);
  const setMessage = APIStore((s) => s.setResponseMessage);
  const GETAssetDataByID = APIStore((s) => s.GETAssetDataByID);
  const setObjectFields = ReuseDataStateStore((s) => s.setObjectFields);
  const setObjectType = ReuseDataStateStore((s) => s.setObjectType);
  const setAPIAction = APIStore((s) => s.setAPIAction);
  const ShowEmptyUPToggleWatcher = ReuseDataStateStore((s) => s.data.ShowEmptyUPToggleWatcher);
  const setShowEmptyUPToggleWatcher = ReuseDataStateStore((s) => s.setShowEmptyUPToggleWatcher);
  const showPDUToggleWatcher = ReuseDataStateStore((s) => s.data.ShowPDUToggleWatcher);
  const setPDUToggleWatcher = ReuseDataStateStore((s) => s.setPDUToggleWatcher);
  const setCurrentCabinetID = APIStore((s) => s.setCurrentCabinetID);
  const currentCabinetID = APIStore((s) => s.data.CurrentCabinetID);
  const setPageView = ReuseDataStateStore((s) => s.setPageView);
  const setAPIPayloadHolder = APIStore((s) => s.setAPIPayloadHolder);

  const Bars = [
    <BaseActionBar
      ShowEmptyUPToggleWatcher={ShowEmptyUPToggleWatcher}
      setShowEmptyUPToggleWatcher={setShowEmptyUPToggleWatcher}
      setCurrentCabinetID={setCurrentCabinetID}
      currentCabinetID={currentCabinetID}
      showPDUToggleWatcher={showPDUToggleWatcher}
      setPDUToggleWatcher={setPDUToggleWatcher}
    />,
    <AssetActions
      setMessage={setMessage}
      setCabinetActionBar={setCabinetActionBar}
      SelectedInCabinetAsset={SelectedInCabinetAsset}
      GETAssetDataByID={GETAssetDataByID}
      setPageView={setPageView}
      setObjectFields={setObjectFields}
      setObjectType={setObjectType}
      setAPIAction={setAPIAction}
      setAPIPayloadHolder={setAPIPayloadHolder}
    />,
  ];

  return <div className="flex flex-row justify-around items-start my-2">{Bars[cabinetActionBar]}</div>;
}

function AssetActions({
  setCabinetActionBar,
  SelectedInCabinetAsset,
  setMessage,
  GETAssetDataByID,
  setPageView,
  setObjectFields,
  setObjectType,
  setAPIAction,
  setAPIPayloadHolder,
}) {
  return (
    <div className="flex flex-row w-full justify-between items-center">
      <div>
        <span className="text-lg font-semibold mx-2">{SelectedInCabinetAsset.tiName}</span>
      </div>
      <div className="flex flex-row gap-2 justify-end items-center px-2">
        <div>
          <button
            className="bg-red-600 text-white rounded px-3 py-1"
            onClick={() => {
              // GETAssetDataByID(SelectedInCabinetAsset.id);
              const payload = {
                id: SelectedInCabinetAsset.id,
                action: "update",
              };
              let Type = "";
              const m = SelectedInCabinetAsset.tiMounting || "";

              switch (true) {
                case m.includes("Blade"):
                  Type = "Network / Blade";
                  break;

                case m.includes("ZeroU"):
                  Type = "Rack PDU / AC Power";
                  break;

                case m.includes("Free Standing"):
                  Type = "Cabinet";
                  break;

                case m.includes("Rackable"):
                  Type = "Device / Standard";
                  break;

                default:
                  Type = "Device / Standard";
              }
              // const class_sub = SelectedInCabinetAsset.hasOwnProperty("tiClass")
              //   ? SelectedInCabinetAsset["tiClass"]
              //   : `${SelectedInCabinetAsset.className} / ${SelectedInCabinetAsset.subClassName}`;

              console.log(Type);
              setAPIAction("EDIT");
              setObjectType(Type);
              GETAssetDataByID(payload);
              setObjectFields(dcTrack_ENDPOINTS[Type]);
              setPageView(3);
            }}
          >
            <MdEditSquare className="text-xl" />
          </button>
        </div>
        <div>
          <button
            className="bg-red-600 text-white rounded px-3 py-1"
            onClick={async () => {
              // GETAssetDataByID(SelectedInCabinetAsset.id);
              const payload = {
                id: SelectedInCabinetAsset.id,
                action: "update",
              };
              let Type = "";
              const m = SelectedInCabinetAsset.tiMounting || "";

              switch (true) {
                case m.includes("Blade"):
                  Type = "Network / Blade";
                  break;

                case m.includes("ZeroU"):
                  Type = "Rack PDU / AC Power";
                  break;

                case m.includes("Free Standing"):
                  Type = "Cabinet";
                  break;

                case m.includes("Rackable"):
                  Type = "Device / Standard";
                  break;

                default:
                  Type = "Device / Standard";
              }
              // const class_sub = SelectedInCabinetAsset.hasOwnProperty("tiClass")
              //   ? SelectedInCabinetAsset["tiClass"]
              //   : `${SelectedInCabinetAsset.className} / ${SelectedInCabinetAsset.subClassName}`;

              setAPIAction("ADD");
              setObjectType(Type);
              await GETAssetDataByID(payload);
              Object.entries(dcTrack_COPY_REQUIRED[Type]).forEach(([key, flag]) => {
                if (flag === true) {
                  setAPIPayloadHolder({
                    type: Type,
                    field: key,
                    value: "",
                  });
                }
              });
              setObjectFields(dcTrack_ENDPOINTS[Type]);
              setPageView(3);
            }}
          >
            <MdFileCopy className="text-xl" />
          </button>
        </div>
        <div>
          <button
            className="bg-red-600 text-white rounded px-3 py-1"
            onClick={() => {
              setMessage({
                type: "Delete Asset",
                text: "Are you sure you want to delete this asset? This action cannot be undone.",
                label: SelectedInCabinetAsset,
              });
            }}
          >
            <MdDelete className="text-xl" />
          </button>
        </div>
        <div>
          <button
            className="bg-red-600 text-white rounded px-3 py-1"
            onClick={() => {
              setCabinetActionBar(0);
            }}
          >
            <MdOutlineClose className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
}

function BaseActionBar({
  ShowEmptyUPToggleWatcher,
  setShowEmptyUPToggleWatcher,
  setCurrentCabinetID,
  currentCabinetID,
  showPDUToggleWatcher,
  setPDUToggleWatcher,
}) {
  if (currentCabinetID === null || currentCabinetID === "") {
    return null;
  }
  return (
    <div className="bg-transparent flex flex-row justify-between w-full px-4">
      <ToggleSwitch checked={ShowEmptyUPToggleWatcher} onChange={setShowEmptyUPToggleWatcher} label={"Hide Empty"} />
      <ToggleSwitch checked={showPDUToggleWatcher} onChange={setPDUToggleWatcher} label={"PDU"} />
      <button className="px-2 py-0.5 bg-green-500 rounded-md" onClick={() => setCurrentCabinetID("")}>
        Cabinet Select
      </button>
    </div>
  );
}
