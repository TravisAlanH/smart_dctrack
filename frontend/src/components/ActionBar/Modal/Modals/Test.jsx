import React from "react";
import { ReuseDataStateStore } from "../../../../../store/Store";

export default function Test() {
  const setModalOpen = ReuseDataStateStore((s) => s.setModalOpen);
  return (
    <div>
      <div className="flex flex-row overflow-auto h-full">text</div>
    </div>
  );
}
