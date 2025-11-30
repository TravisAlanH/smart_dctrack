import React from "react";
import "./Modal.css";
import Test from "./Modals/Test";
import { ReuseDataStateStore } from "../../../../store/Store";

export default function Modal({ child }) {
  const setModalOpen = ReuseDataStateStore((s) => s.setModalOpen);
  return (
    <div id="MainModal" className="MainModalClass">
      <div className="ModalContent flex flex-col">
        <div className="flex flex-row justify-end w-full items-center">
          <button
            className="text-2xl font-bold cursor-pointer w-[2.5rem] h-[2.5rem] flex justify-center items-center"
            onClick={() => {
              setModalOpen(false);
            }}
          >
            &times;
          </button>
        </div>
        <div className="flex flex-row justify-center overflow-auto">
          <Test />
        </div>
      </div>
    </div>
  );
}
