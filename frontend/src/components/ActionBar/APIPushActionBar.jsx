import React from "react";
import axios from "axios";
import { APIStore, ReuseDataStateStore } from "../../../store/Store";
import ToggleSwitch from "../Interactions/ToggleSwitch";

export default function APIPushActionBar({ style }) {
  const code = APIStore((s) => s.data.ResponseCode);
  const APIAction = APIStore((s) => s.data.APIAction);
  const setAPIAction = APIStore((s) => s.setAPIAction);
  const setObjectFields = APIStore((s) => s.setObjectFields);
  const setObjectType = APIStore((s) => s.setObjectType);
  const showRequired = ReuseDataStateStore((s) => s.data.ShowRequiredAudit);
  const setShowRequired = ReuseDataStateStore((s) => s.setShowRequiredAudit);
  const setMessage = APIStore((s) => s.setResponseMessage);
  const APIPayloadHolder = APIStore((s) => s.data.APIPayloadHolder);

  return (
    <div className="flex flex-row justify-around items-start my-2">
      {/* <div>{code !== "" ? <button className={button}>{code}</button> : null}</div> */}
      <div className="flex flex-row gap-3 justify-around w-full">
        <div>
          <button
            className="px-2 py-1 rounded-md"
            style={Object.keys(APIPayloadHolder).length === 0 ? style.disabledButton : style.cautionButton}
            disabled={Object.keys(APIPayloadHolder).length === 0}
            onClick={() => {
              setMessage({
                type: "Reset Audit Form",
                text: "Are you sure you want to reset all Fields in this Audit Form?",
                label: "",
              });
            }}
          >
            Reset
          </button>
        </div>
        <ToggleSwitch label={"Show Required"} checked={showRequired} onChange={setShowRequired} />
      </div>
    </div>
  );
}
