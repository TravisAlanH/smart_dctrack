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

  const lable = "font-bold w-20";

  function formatMessage(m) {
    console.log(m);
    if (!m) return "asdf";

    if (m.code === "ERR_NETWORK") {
      return (
        <div className="flex flex-col w-full text-left">
          <div className="flex flex-row items-center w-full">
            <div className="font-bold w-24 flex-shrink-0">Message:</div>
            <div className="flex-1 break-words">{m.message}</div>
          </div>

          <div className="flex flex-row items-center w-full">
            <div className="font-bold w-24 flex-shrink-0">Method:</div>
            <div className="flex-1 break-words">{m.config.method}</div>
          </div>

          <div className="flex flex-col w-full text-left">
            <div className="flex flex-row items-center w-full">
              <div className="font-bold w-24 flex-shrink-0">URL:</div>
              <div className="flex-1 break-words overflow-hidden break-all">{m.config.url}</div>
            </div>
          </div>
        </div>
      );
    }

    if (m >= 200 && m < 300) {
      return "Request completed.";
    }

    if (m.response.data.backendData.httpCode === 400) {
      const data = m.response.data.backendData;
      return (
        <div>
          <div className="font-bold">{data.message}</div>
          <div className="">
            <span>{`${data.httpStatus} : ${data.httpCode}`}</span>
            {data.errorList.map((err, idx) => (
              <div className="text-sm" key={idx}>
                - {err}
              </div>
            ))}
          </div>
          <div>{m.text}</div>
        </div>
      );
    }

    if (m >= 500) {
      return "Server failed to process request.";
    }

    if (m.type === "info_header" && m.text) {
      return (
        <div>
          <div className="font-bold">{m.label}</div>
          <div>{m.text}</div>
        </div>
      );
    }
    console.log("MESSAGE", m.type);
    if (m.type === "setCabLocInfo" && m.text) {
      return (
        <div>
          <SlideSetCabLoc />
        </div>
      );
    }
    if (m.type === "Delete Asset" && m.text) {
      console.log(m);
      const Name = m.label.tiName;
      const deteteDisablesStyle = "bg-gray-600 text-white rounded px-3 py-1 mx-2 cursor-not-allowed";
      const deleteEnabledStyle = "bg-red-600 text-white rounded px-3 py-1 mx-2";
      return (
        <div>
          <div className="flex flex-row justify-center pt-3">
            <span>Type "</span>
            <span className="font-bold">{Name}</span>
            <span>" as it appears to delete </span>
          </div>
          <div className="flex flex-row justify-center pt-2"></div>
          <input
            type="text"
            value={deleteHold}
            className="text-black"
            onChange={(e) => {
              setDeleteHold(e.target.value);
            }}
          />
          <button
            className={deleteHold === Name ? deleteEnabledStyle : deteteDisablesStyle}
            disabled={deleteHold !== Name}
            onClick={async () => {
              if (deleteHold !== Name) return;

              await deleteAsset(m.label.id);

              if (cabinetId) {
                await pullAllAssetFromCabinet(cabinetId);
              }
              setShow(0);
              setCabinetActionBar(0);
            }}
          >
            Confirm Delete
          </button>
        </div>
      );
    }

    return "Unknown result.";
  }

  console.log(msg);

  return <div className="w-full bg-black text-white text-center">{formatMessage(msg)}</div>;
}
