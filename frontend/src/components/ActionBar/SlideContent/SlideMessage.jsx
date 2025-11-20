import React from "react";
import { APIStore } from "../../../../store/Store";
import SlideSetCabLoc from "./SlideSetCabLoc";

export default function SlideMessage() {
  const msg = APIStore((s) => s.data.ResponseMessage);

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

    if (m >= 400 && m < 500) {
      return "Client request failed.";
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

    return "Unknown result.";
  }

  console.log(msg);

  return <div className="w-full bg-black text-white text-center">{formatMessage(msg)}</div>;
}
