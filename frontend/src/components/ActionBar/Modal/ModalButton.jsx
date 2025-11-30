import React from "react";
import { ReuseDataStateStore } from "../../../../store/Store";

export default function ModalButton() {
  const setModalOpen = ReuseDataStateStore((s) => s.setModalOpen);
  return (
    <div>
      <button
        className="bg-orange-600 text-white rounded px-3 py-1"
        onClick={() => {
          setModalOpen(true);
        }}
      >
        O
      </button>
    </div>
  );
}
