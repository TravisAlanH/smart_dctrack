import React from "react";
import { MdOutlineSettings } from "react-icons/md";

export default function DataNeeded() {
  return (
    <div className="flex flex-col w-full h-full justify-center items-center">
      <div>
        <span className="text-white text-2xl">Data Needed</span>
      </div>
      <div className="text-white">
        <MdOutlineSettings size={32} />
      </div>
    </div>
  );
}
