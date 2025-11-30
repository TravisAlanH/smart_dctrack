import React from "react";
import { APIStore, ReuseDataStateStore } from "../../../store/Store";
import { MdOutlineHome, MdDataArray, MdOutlineStorage, MdOutlineSettings } from "react-icons/md";

export default function Footer() {
  const pullCabinetData = APIStore((s) => s.pullCabinetData);
  const pullLocationData = APIStore((s) => s.pullLocationData);
  const pullAllAssetFromCabinet = APIStore((s) => s.pullAllAssetFromCabinet);
  const pullAllMakesFromInstance = APIStore((s) => s.pullAllMakesFromInstance);
  const currentCabinetID = APIStore((s) => s.data.CurrentCabinetID);
  const setPageView = ReuseDataStateStore((s) => s.setPageView);

  const buttonStyle = "bg-transparent text-white rounded px-3 py-1";
  const LOCATIONCODE = APIStore((s) => s.data.LOCATIONCODE);
  const BASE64USERPASS = APIStore((s) => s.data.BASE64USERPASS);
  const pullChassisSQL = APIStore((s) => s.pullChassisSQL);

  return (
    <div className="bg-gray-800 h-[4rem]">
      <div className="flex flex-row justify-around items-center h-full">
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
            <MdOutlineHome size={32} />
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
            <MdDataArray size={32} />
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
            <MdOutlineStorage size={32} />
          </button>
        </div>
        <div>
          <button
            className={buttonStyle}
            onClick={() => {
              setPageView(2);
            }}
          >
            <MdOutlineSettings size={32} />
          </button>
        </div>
      </div>
    </div>
  );
}
