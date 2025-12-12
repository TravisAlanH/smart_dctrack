import React from "react";
import { APIStore, ReuseDataStateStore } from "../../../store/Store";
import { MdOutlineHome, MdDataArray, MdOutlineStorage, MdOutlineSettings } from "react-icons/md";
import { getStyles } from "../../../Styles";

export default function Footer() {
  const darkMode = ReuseDataStateStore((s) => s.data.DarkMode);
  const ui = getStyles();
  const pullCabinetData = APIStore((s) => s.pullCabinetData);
  const pullLocationData = APIStore((s) => s.pullLocationData);
  const pullAllAssetFromCabinet = APIStore((s) => s.pullAllAssetFromCabinet);
  const pullAllMakesFromInstance = APIStore((s) => s.pullAllMakesFromInstance);
  const currentCabinetID = APIStore((s) => s.data.CurrentCabinetID);
  const setPageView = ReuseDataStateStore((s) => s.setPageView);
  const pageView = ReuseDataStateStore((s) => s.data.pageView);

  const LOCATIONCODE = APIStore((s) => s.data.LOCATIONCODE);
  const BASE64USERPASS = APIStore((s) => s.data.BASE64USERPASS);
  const pullChassisSQL = APIStore((s) => s.pullChassisSQL);

  return (
    <div className="h-[4rem]" style={ui.footerBackground}>
      <div className="flex flex-row justify-around items-center h-full">
        {/* <div>
          <button
            
            onClick={() => {
              pullCabinetData(4);
            }}
          >
            Cab to Log
          </button>
        </div> */}
        <div>
          <button
            style={pageView === 0 ? ui.footerActiveIcon : ui.footerIcon}
            onClick={() => {
              setPageView(0);
            }}
          >
            <MdOutlineHome size={32} />
          </button>
        </div>
        <div>
          <button
            disabled={LOCATIONCODE === "" || BASE64USERPASS === ""}
            style={pageView === 3 ? ui.footerActiveIcon : ui.footerIcon}
            onClick={() => {
              setPageView(3);
            }}
          >
            <MdDataArray size={32} />
          </button>
        </div>
        <div>
          <button
            disabled={LOCATIONCODE === "" || BASE64USERPASS === ""}
            style={pageView === 1 ? ui.footerActiveIcon : ui.footerIcon}
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
            style={pageView === 2 ? ui.footerActiveIcon : ui.footerIcon}
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
