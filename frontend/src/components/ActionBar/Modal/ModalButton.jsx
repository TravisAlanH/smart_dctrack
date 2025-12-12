import React from "react";
import { ReuseDataStateStore } from "../../../../store/Store";
import { MdAdd } from "react-icons/md";
import { getStyles } from "../../../../Styles";

export default function ModalButton({ child: Component_Name }) {
  const darkMode = ReuseDataStateStore((s) => s.data.DarkMode);
  const ui = getStyles();
  const setModalOpen = ReuseDataStateStore((s) => s.setModalOpen);
  return (
    <div>
      <div
        className=" rounded px-2 py-1"
        style={ui.baseButton}
        onClick={() => {
          setModalOpen({ open: true, child: Component_Name });
        }}
      >
        <MdAdd size={20} />
      </div>
    </div>
  );
}
