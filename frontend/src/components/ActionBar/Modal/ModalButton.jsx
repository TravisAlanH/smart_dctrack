import React from "react";
import { ReuseDataStateStore } from "../../../../store/Store";
import { MdAdd } from "react-icons/md";

export default function ModalButton({ child: Component_Name }) {
  const setModalOpen = ReuseDataStateStore((s) => s.setModalOpen);
  return (
    <div>
      <div
        className="bg-orange-600 text-white rounded px-2 py-1"
        onClick={() => {
          setModalOpen({ open: true, child: Component_Name });
        }}
      >
        <MdAdd size={20} />
      </div>
    </div>
  );
}
