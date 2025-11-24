import React from "react";
import { APIStore, ReuseDataStateStore } from "../../../store/Store";
import { header } from "../Helpers/HeadersAsObjects";

export default function CabinetActionBar({ style: button, setShow }) {
  const cabinetActionBar = ReuseDataStateStore((s) => s.data.cabinetActionBar);
  const SelectedInCabinetAsset = ReuseDataStateStore((s) => s.data.SelectedInCabinetAsset);
  const setCabinetActionBar = ReuseDataStateStore((s) => s.setCabinetActionBar);
  const setMessage = APIStore((s) => s.setResponseMessage);
  const GETAssetDataByID = APIStore((s) => s.GETAssetDataByID);
  const setObjectFields = ReuseDataStateStore((s) => s.setObjectFields);
  const setObjectType = ReuseDataStateStore((s) => s.setObjectType);
  const setAPIAction = APIStore((s) => s.setAPIAction);

  const setPageView = ReuseDataStateStore((s) => s.setPageView);

  const Bars = [
    <EMPTYACTIONBAR />,
    <AssetActions
      setMessage={setMessage}
      setCabinetActionBar={setCabinetActionBar}
      SelectedInCabinetAsset={SelectedInCabinetAsset}
      setShow={setShow}
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
  setShow,
  GETAssetDataByID,
  setPageView,
  setObjectFields,
  setObjectType,
  setAPIAction,
}) {
  return (
    <div className="flex flex-row">
      <div>
        <button
          className="bg-red-600 text-white rounded px-3 py-1 mx-2"
          onClick={() => {
            // GETAssetDataByID(SelectedInCabinetAsset.id);
            const payload = {
              id: SelectedInCabinetAsset.id,
              action: "update",
            };
            setAPIAction("EDIT");
            GETAssetDataByID(payload);
            setObjectFields(header["Devices"]);
            setObjectType("Devices");
            setPageView(0);
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
            setShow(1);
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

function EMPTYACTIONBAR() {
  return <div className="bg-transparent"></div>;
}
