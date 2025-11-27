import React from "react";
import { APIStore, ReuseDataStateStore } from "../../../store/Store";
import { header } from "../Helpers/HeadersAsObjects";
import { dcTrack_ENDPOINTS } from "../Helpers/dcTrackAPIReturns";
import ToggleSwitch from "../Interactions/ToggleSwitch";

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

  console.log(cabinetActionBar);

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
}) {
  console.log(SelectedInCabinetAsset);
  return (
    <div className="flex flex-row items-center">
      <div>
        <span className="text-lg font-semibold mx-2">{SelectedInCabinetAsset.tiName}</span>
      </div>
      <div>
        <button
          className="bg-red-600 text-white rounded px-3 py-1 mx-2"
          onClick={() => {
            // GETAssetDataByID(SelectedInCabinetAsset.id);
            const payload = {
              id: SelectedInCabinetAsset.id,
              action: "update",
            };
            const class_sub = SelectedInCabinetAsset.hasOwnProperty("tiClass")
              ? SelectedInCabinetAsset["tiClass"]
              : `${SelectedInCabinetAsset.className} / ${SelectedInCabinetAsset.subClassName}`;

            console.log(class_sub);
            setAPIAction("EDIT");
            setObjectType(class_sub);
            GETAssetDataByID(payload);
            setObjectFields(dcTrack_ENDPOINTS[class_sub]);
            setPageView(3);
          }}
        >
          Edit
        </button>
      </div>
      <div>
        <button
          className="bg-red-600 text-white rounded px-3 py-1 mx-2"
          onClick={() => {
            setMessage({
              type: "Delete Asset",
              text: "Are you sure you want to delete this asset? This action cannot be undone.",
              label: SelectedInCabinetAsset,
            });
          }}
        >
          Delete
        </button>
      </div>
      <div>
        <button
          className="bg-red-600 text-white rounded px-3 py-1 mx-2"
          onClick={() => {
            setCabinetActionBar(0);
          }}
        >
          Close
        </button>
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
