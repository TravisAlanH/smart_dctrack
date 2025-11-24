import React from "react";
import { APIStore, ReuseDataStateStore } from "../../../../store/Store";
import SlideSetCabLoc from "./SlideSetCabLoc";

export default function SlideMessage({ setShow }) {
  const msg = APIStore((s) => s.data.ResponseMessage);
  const [deleteHold, setDeleteHold] = React.useState("");
  const deleteAsset = APIStore((s) => s.deleteAsset);
  const pullAllAssetFromCabinet = APIStore((s) => s.pullAllAssetFromCabinet);
  const cabinetId = APIStore((s) => s.data.CurrentCabinetID);
  const setCabinetActionBar = ReuseDataStateStore((s) => s.setCabinetActionBar);
  const setOpenResponseMessage = APIStore((s) => s.setOpenResponseMessage);

  function formatMessage(m) {
    if (!m) return null;

    React.useEffect(() => {
      console.log(m.type);
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
      const disabledStyle = "bg-gray-600 text-white rounded px-3 py-1 mx-2 cursor-not-allowed";
      const enabledStyle = "bg-red-600 text-white rounded px-3 py-1 mx-2";

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
            className="text-black mt-3 px-2 py-1 rounded"
            onChange={(e) => setDeleteHold(e.target.value)}
          />

          <button
            className={deleteHold === name ? enabledStyle : disabledStyle}
            disabled={deleteHold !== name}
            onClick={async () => {
              if (deleteHold !== name) return;

              await deleteAsset(m.label.id);

              if (cabinetId) {
                await pullAllAssetFromCabinet(cabinetId);
              }

              setShow(false);
              setCabinetActionBar(0);
            }}
          >
            Confirm Delete
          </button>
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

    return <div className="p-2 text-sm">Unknown result</div>;
  }

  return <div className="w-full bg-black text-white text-center">{formatMessage(msg)}</div>;
}
