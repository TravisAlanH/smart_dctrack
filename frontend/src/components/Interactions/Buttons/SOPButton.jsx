import React from "react";
import { ReuseDataStateStore } from "../../../../store/Store";
import { MdQuestionMark } from "react-icons/md";

export default function SOPButton() {
  const pageView = ReuseDataStateStore((s) => s.data.pageView);
  const setModalOpen = ReuseDataStateStore((s) => s.setModalOpen);

  const Component_Name = "sop_Modal";

  return (
    <div>
      <button
        className="rounded-full bg-orange-500 text-white w-[1.6rem] h-[1.6rem] flex flex-row justify-center items-center"
        onClick={() => {
          setModalOpen({ open: true, child: Component_Name });
        }}
      >
        <MdQuestionMark size={20} />
      </button>
    </div>
  );
}
