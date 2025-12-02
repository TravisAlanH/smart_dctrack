import React from "react";
import "./Modal.css";
import Test from "./Modals/Test";
import { ReuseDataStateStore } from "../../../../store/Store";
import NewModel from "./Modals/CreateModel_GetModelFromInstance";
import CreateModel from "./Modals/CreateModel";

/* Shared UI */
export const auditUI = {
  cardOuter: "flex flex-col bg-slate-600 rounded-md",
  cardHeader: "px-3 pt-2 pb-1 text-xs sm:text-sm font-semibold text-white",
  cardBody: "w-full flex flex-row items-center gap-2 px-3 pb-2",

  label: "text-sm sm:text-sm",
  labelRequired: "text-sm sm:text-sm text-red-400 font-bold",

  // iOS zoom fix: use text-base
  input: "border border-gray-400 rounded px-2 py-1 text-base w-full text-black",
  select: "border border-gray-400 rounded px-2 py-1 text-base w-full bg-white text-black",

  mainButton: "bg-blue-600 text-white rounded px-3 py-1 text-sm sm:text-sm whitespace-nowrap",
  infoButton: "bg-green-600 text-white rounded px-2 py-1 text-sm sm:text-sm whitespace-nowrap",
};

export default function Modal() {
  const setModalOpen = ReuseDataStateStore((s) => s.setModalOpen);
  const ModalOpen = ReuseDataStateStore((s) => s.data.ModalOpen);

  const Modals = {
    new_Model: <CreateModel ui={auditUI} />,
  };

  return (
    <div id="MainModal" className="MainModalClass">
      <div className="ModalContent">
        <div className="flex flex-row justify-end w-full items-center">
          <button
            className="text-2xl font-bold cursor-pointer w-[2.5rem] h-[2.5rem]"
            onClick={() => {
              setModalOpen({ open: false, child: null });
            }}
          >
            &times;
          </button>
        </div>

        <div className="flex justify-center items-center flex-1 h-auto">
          <div className="h-auto w-full relative">{Modals[ModalOpen.child]}</div>
        </div>
      </div>
    </div>
  );
}
