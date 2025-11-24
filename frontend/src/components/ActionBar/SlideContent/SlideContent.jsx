import React from "react";
import SlideMessage from "./SlideMessage";
import { APIStore } from "../../../../store/Store";
import { loadRequiredMaster, updateRequiredField } from "../../Helpers/RequiredMaster";
import { required_master } from "../../Helpers/Endpoints";
import ToggleSwitch from "../../Interactions/ToggleSwitch";

export default function SlideContent({}) {
  const msg = APIStore((s) => s.data.ResponseMessage);
  const setShow = APIStore((s) => s.setOpenResponseMessage);

  const [trueRequredMaster, setTrueRequiredMaster] = React.useState(loadRequiredMaster(required_master));

  React.useEffect(() => {
    const stored = localStorage.getItem("required_master_override");
    const out = stored ? JSON.parse(stored) : { ...required_master };
    setTrueRequiredMaster(out);
  }, [msg.label]);

  function handleToggleRequired(newValue) {
    const updated = updateRequiredField(trueRequredMaster, msg.label, newValue);
    setTrueRequiredMaster(updated);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between">
        <div>
          {msg.type === "info_header" && !required_master[msg.label] ? (
            <ToggleSwitch label={"Required?"} checked={trueRequredMaster[msg.label]} onChange={handleToggleRequired} />
          ) : null}
        </div>
        <button className="bg-red-600 text-white rounded px-3 py-1" onClick={() => setShow(false)}>
          Close
        </button>
      </div>
      <SlideMessage setShow={setShow} />
    </div>
  );
}
