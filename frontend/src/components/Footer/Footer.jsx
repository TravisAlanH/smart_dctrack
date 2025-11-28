import React from "react";
import { APIStore, ReuseDataStateStore } from "../../../store/Store";

export default function Footer() {
  const pullCabinetData = APIStore((s) => s.pullCabinetData);
  const pullLocationData = APIStore((s) => s.pullLocationData);
  const pullAllAssetFromCabinet = APIStore((s) => s.pullAllAssetFromCabinet);
  const pullAllMakesFromInstance = APIStore((s) => s.pullAllMakesFromInstance);
  const currentCabinetID = APIStore((s) => s.data.CurrentCabinetID);
  const setPageView = ReuseDataStateStore((s) => s.setPageView);

  const buttonStyle = "bg-blue-600 text-white rounded px-3 py-1";
  const LOCATIONCODE = APIStore((s) => s.data.LOCATIONCODE);
  const BASE64USERPASS = APIStore((s) => s.data.BASE64USERPASS);
  const pullChassisSQL = APIStore((s) => s.pullChassisSQL);

  return (
    <div className="border border-white bg-gray-800 h-[9rem]">
      <div className="flex flex-row justify-around items-start">
        {/* <div>
          <button
            className={buttonStyle}
            onClick={() => {
              pullCabinetData(4);
            }}
          >
            Cab to Log
          </button>
        </div> */}
        <div>
          <button
            className={buttonStyle}
            onClick={() => {
              setPageView(0);
            }}
          >
            Home
          </button>
        </div>
        <div>
          <button
            className={buttonStyle}
            disabled={LOCATIONCODE === "" || BASE64USERPASS === ""}
            onClick={() => {
              setPageView(3);
            }}
          >
            Audit
          </button>
        </div>
        <div>
          <button
            className={buttonStyle}
            disabled={LOCATIONCODE === "" || BASE64USERPASS === ""}
            onClick={() => {
              if (currentCabinetID !== null) {
                pullAllAssetFromCabinet(currentCabinetID);
              }

              setPageView(1);
            }}
          >
            Cabinet
          </button>
        </div>
        <div>
          <button
            className={buttonStyle}
            onClick={() => {
              setPageView(2);
            }}
          >
            Settings
          </button>
        </div>
      </div>
    </div>
  );
}
