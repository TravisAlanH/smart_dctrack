import React from "react";
import { APIStore, ReuseDataStateStore } from "../../../../store/Store";
import SlideSetCabLoc from "./SlideSetCabLoc";
import { dcTrack_READABLE } from "../../Helpers/dcTrackAPIReadable";
import { getStyles } from "../../../../Styles";

export default function SlideMessage({ setShow }) {
  const darkMode = ReuseDataStateStore((s) => s.data.DarkMode);
  const ui = getStyles();
  const msg = APIStore((s) => s.data.ResponseMessage);
  const [deleteHold, setDeleteHold] = React.useState("");
  const [resetHold, setResetHold] = React.useState(false);
  const deleteAsset = APIStore((s) => s.deleteAsset);
  const pullAllAssetFromCabinet = APIStore((s) => s.pullAllAssetFromCabinet);
  const cabinetId = APIStore((s) => s.data.CurrentCabinetID);
  const setCabinetActionBar = ReuseDataStateStore((s) => s.setCabinetActionBar);
  const setOpenResponseMessage = APIStore((s) => s.setOpenResponseMessage);
  const setAPIAction = APIStore((s) => s.setAPIAction);
  const setObjectFields = ReuseDataStateStore((s) => s.setObjectFields);
  const setObjectType = ReuseDataStateStore((s) => s.setObjectType);
  const resetAPUIPayloadHolder = APIStore((s) => s.resetAPUIPayloadHolder);
  const objectType = ReuseDataStateStore((s) => s.data.objectType);
  const setZeroUAuditMap = APIStore((s) => s.setZeroUAuditMap);
  const setBladeAuditMap = APIStore((s) => s.setBladeAuditMap);

  function formatMessage(m) {
    if (!m) return null;

    React.useEffect(() => {
      if (Object.keys(m).length !== 0) setOpenResponseMessage(true);
    }, [m]);

    const type = m.type || "";
    const data = m.data || {};
    const backend = data || {};

    if (type === "setCabLocInfo") {
      return (
        <div className="w-full">
          <SlideSetCabLoc />
        </div>
      );
    }

    if (type === "Delete Asset") {
      const name = m.label?.tiName || "";
      const disabledStyle = "text-white rounded px-3 py-1 mx-2 cursor-not-allowed";
      const enabledStyle = "rounded px-3 py-1 mx-2";
      console.log(m.label);
      return (
        <div className="flex flex-col items-center pt-3">
          <div className="flex flex-row">
            <span>Type "</span>
            <span className="font-bold">{name}</span>
            <span>" to delete</span>
          </div>

          <input
            type="text"
            value={deleteHold}
            className="mt-3 px-2 py-1 rounded"
            onChange={(e) => setDeleteHold(e.target.value)}
          />

          <button
            className={deleteHold === name ? enabledStyle : disabledStyle}
            style={deleteHold === name ? ui.cautionButton : ui.disabledButton}
            disabled={deleteHold !== name}
            onClick={async () => {
              if (deleteHold !== name) return;
              if (m.label?.tiMounting?.includes("Blade")) {
                setBladeAuditMap({});
              }
              if (m.label?.tiMounting?.includes("ZeroU")) {
                setZeroUAuditMap({});
              }
              await deleteAsset(m.label.id);

              if (cabinetId) {
                await pullAllAssetFromCabinet(cabinetId);
              }

              setShow(false);
              setDeleteHold("");
              setCabinetActionBar(0);
            }}
          >
            Confirm Delete
          </button>
        </div>
      );
    }

    if (type === "Reset Audit Form") {
      // const name = m.label?.tiName || "";
      const disabledStyle = "bg-gray-600 text-white rounded px-3 py-1 mx-2 cursor-not-allowed";
      const enabledStyle = "bg-red-600 text-white rounded px-3 py-1 mx-2";

      return (
        <div className="flex flex-col items-center pt-3">
          <div className="flex flex-row">Are you sure you want to reset all Fields in this Audit Form?</div>
          <div className="flex flex-row w-full justify-center items-center">
            <input
              type="checkbox"
              value={resetHold}
              className=" px-2 py-1 rounded h-[1.5rem] w-[1.5rem]"
              onChange={() => setResetHold(!resetHold)}
            />

            <button
              className={!resetHold ? disabledStyle : enabledStyle}
              disabled={!resetHold}
              onClick={() => {
                setAPIAction("ADD");
                setObjectFields("");
                setObjectType("");
                resetAPUIPayloadHolder({});
                setShow(false);
              }}
            >
              Confirm Reset
            </button>
          </div>
        </div>
      );
    }

    if (type === "APIResponse" && backend.success === false && backend.httpCode === 400) {
      return (
        <div className="flex flex-col text-left p-2 text-sm">
          <div className="font-bold">{backend.message}</div>

          <div className="mt-2">
            <span>
              {backend.httpStatus}. Code {backend.httpCode}
            </span>
          </div>

          {backend.errorList?.map((err, i) => (
            <div key={i} className="mt-1">
              • {err}
            </div>
          ))}
        </div>
      );
    }

    if (type === "APIResponse" && backend.success !== false) {
      return (
        <div className="flex flex-col text-left p-2 text-sm">
          <div className="font-bold">Success</div>
        </div>
      );
    }

    if (type === "info_header") {
      return (
        <div className="flex flex-col text-left p-2 text-sm">
          <div className="flex flex-row w-full justify-center">
            <span className="font-bold">{dcTrack_READABLE[objectType][m.label]}</span>
          </div>
          <div className="mt-2 flex flex-row w-full justify-center">{m.text}</div>
        </div>
      );
    }
    if (type === "Custom_Field_info_header") {
      return (
        <div className="flex flex-col text-left p-2 text-sm">
          <div className="flex flex-row w-full justify-center">
            <span className="font-bold">{[m.label]}</span>
          </div>
          <div className="mt-2 flex flex-row w-full justify-center">{m.text}</div>
        </div>
      );
    }

    return <div className="p-2 text-sm">Unknown result</div>;
  }

  return <div className="w-full text-center">{formatMessage(msg)}</div>;
}
