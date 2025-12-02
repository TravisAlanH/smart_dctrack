import React from "react";
import { ReuseDataStateStore } from "../../../../store/Store";

export default function ModalButton({ child: Component_Name }) {
  const setModalOpen = ReuseDataStateStore((s) => s.setModalOpen);
  return (
    <div>
      <button
        className="bg-orange-600 text-white rounded px-3 py-1"
        onClick={() => {
          setModalOpen({ open: true, child: Component_Name });
        }}
      >
        O
      </button>
    </div>
  );
}
