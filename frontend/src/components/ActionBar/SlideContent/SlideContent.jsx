import React from "react";
import SlideMessage from "./SlideMessage";

export default function SlideContent({ setShow }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-end">
        <button className="bg-red-600 text-white rounded px-3 py-1" onClick={() => setShow(0)}>
          Close
        </button>
      </div>
      <SlideMessage />
    </div>
  );
}
