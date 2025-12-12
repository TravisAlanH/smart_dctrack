import React from "react";
import SlideMessage from "./SlideMessage";
import { APIStore, ReuseDataStateStore } from "../../../../store/Store";
import { loadRequiredMaster, updateRequiredField } from "../../Helpers/RequiredMaster";
import { required_master } from "../../Helpers/Endpoints";
import { dcTrack_APIREQUIRED } from "../../Helpers/dcTrackAPIRequired";
import { getStyles } from "../../../../Styles";

import ToggleSwitch from "../../Interactions/ToggleSwitch";

export default function SlideContent({}) {
  const darkMode = ReuseDataStateStore((s) => s.data.DarkMode);
  const ui = getStyles();
  const msg = APIStore((s) => s.data.ResponseMessage);
  const setShow = APIStore((s) => s.setOpenResponseMessage);
  const objectType = ReuseDataStateStore((s) => s.data.objectType);

  const [trueRequredMaster, setTrueRequiredMaster] = React.useState(loadRequiredMaster(dcTrack_APIREQUIRED));

  React.useEffect(() => {
    const stored = localStorage.getItem("required_master_override");
    const out = stored ? JSON.parse(stored) : { ...dcTrack_APIREQUIRED };
    setTrueRequiredMaster(out);
  }, [msg.label]);

  function handleToggleRequired(newValue) {
    const updated = updateRequiredField(trueRequredMaster, objectType, msg.label, newValue);
    setTrueRequiredMaster(updated);
  }

  // console.log(objectType);
  // console.log(dcTrack_APIREQUIRED[objectType][msg.label]);
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between">
        <div>
          {msg.type === "info_header" && !dcTrack_APIREQUIRED[objectType][msg.label] ? (
            <ToggleSwitch
              label={"Required?"}
              checked={trueRequredMaster[objectType][msg.label]}
              onChange={handleToggleRequired}
            />
          ) : null}
        </div>
        <button className=" rounded px-3 py-1" onClick={() => setShow(false)} style={ui.closeButton}>
          Close
        </button>
      </div>
      <SlideMessage setShow={setShow} />
    </div>
  );
}
