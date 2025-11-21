import React from "react";
import { APIStore } from "../../../store/Store";

export default function Footer({ setPageView }) {
  const pullCabinetData = APIStore((s) => s.pullCabinetData);
  const pullLocationData = APIStore((s) => s.pullLocationData);
  const pullAllAssetFromCabinet = APIStore((s) => s.pullAllAssetFromCabinet);
  const pullAllMakesFromInstance = APIStore((s) => s.pullAllMakesFromInstance);

  const buttonStyle = "bg-blue-600 text-white rounded px-3 py-1";

  return (
    <div className="border border-white bg-gray-800 h-[20rem]">
      <div className="flex flex-row justify-around items-start">
        {/* <div>
          <button
            className={buttonStyle}
            onClick={() => {
              pullLocationData();
            }}
          >
            Locations to Log
          </button>
        </div>
        <div>
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
              pullAllMakesFromInstance();
            }}
          >
            Makes to Log
          </button>
        </div>
        <div>
          <button
            className={buttonStyle}
            onClick={() => {
              setPageView(0);
            }}
          >
            Audit
          </button>
        </div>
        <div>
          <button
            className={buttonStyle}
            onClick={() => {
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
              // setPageView(2)
            }}
          >
            Settings
          </button>
        </div>
      </div>
    </div>
  );
}
