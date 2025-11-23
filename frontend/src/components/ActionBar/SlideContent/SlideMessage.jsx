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

  function formatMessage(m) {
    if (!m) return "asdf";

    const safe = {
      type: m.type || "",
      text: m.text || "",
      label: m.label || "",
      data: m.data || {},
      response: m.response || {},
      backend: m.response?.data?.backendData || {},
      status: m.data?.status || m.response?.status || "",
      code: m.data?.code || "",
      url: m.data?.config?.url || m.response?.config?.url || "",
    };

    console.log(safe);

    // API error from Axios with network or VPN issues
    if (safe.type === "APIResponse" && safe.code === "ERR_BAD_RESPONSE") {
      return (
        <div className="flex flex-col w-full text-left pt-2 text-sm">
          <div className="flex flex-row items-center w-full">
            <div className="font-bold w-24 flex-shrink-0">Message:</div>
            <div className="flex-1 break-words">{safe.data.message}</div>
          </div>

          <div className="flex flex-row items-center w-full">
            <div className="font-bold w-24 flex-shrink-0">Resolution:</div>
            <div className="flex-1 break-words">Check VPN Access and Network</div>
          </div>

          <div className="flex flex-row items-center w-full">
            <div className="font-bold w-24 flex-shrink-0">URL:</div>
            <div className="flex-1 break-words break-all">{safe.url}</div>
          </div>
        </div>
      );
    }

    // 200 OK from API
    if (safe.type === "APIResponse" && safe.status === 200) {
      return (
        <div>
          <div className="font-bold">{safe.status}</div>
          <div>{safe.data.message}</div>
        </div>
      );
    }

    // Backend validation or API errors
    if (safe.backend.httpCode === 400 || safe.backend.httpCode === 404) {
      const data = safe.backend;
      return (
        <div>
          <div className="font-bold">{data.message}</div>
          <div>
            <span>{`${data.httpStatus} : ${data.httpCode}`}</span>
            {data.errorList?.map((err, idx) => (
              <div className="text-sm" key={idx}>
                - {err}
              </div>
            ))}
          </div>
          <div>{safe.text}</div>
        </div>
      );
    }

    // User clicked the help icon
    if (safe.type === "info_header" && safe.text) {
      return (
        <div>
          <div className="font-bold">{safe.label}</div>
          <div>{safe.text}</div>
        </div>
      );
    }

    // Set Cabinet Location slide
    if (safe.type === "setCabLocInfo" && safe.text) {
      return (
        <div>
          <SlideSetCabLoc />
        </div>
      );
    }

    // Delete asset workflow
    if (safe.type === "Delete Asset" && safe.text) {
      const Name = safe.label.tiName || "";
      const deteteDisablesStyle = "bg-gray-600 text-white rounded px-3 py-1 mx-2 cursor-not-allowed";
      const deleteEnabledStyle = "bg-red-600 text-white rounded px-3 py-1 mx-2";

      return (
        <div>
          <div className="flex flex-row justify-center pt-3">
            <span>Type "</span>
            <span className="font-bold">{Name}</span>
            <span>" as it appears to delete </span>
          </div>

          <input type="text" value={deleteHold} className="text-black" onChange={(e) => setDeleteHold(e.target.value)} />

          <button
            className={deleteHold === Name ? deleteEnabledStyle : deteteDisablesStyle}
            disabled={deleteHold !== Name}
            onClick={async () => {
              if (deleteHold !== Name) return;

              await deleteAsset(safe.label.id);

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

  return <div className="w-full bg-black text-white text-center">{formatMessage(msg)}</div>;
}
