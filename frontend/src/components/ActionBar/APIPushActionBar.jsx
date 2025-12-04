import React from "react";
import axios from "axios";
import { APIStore, ReuseDataStateStore } from "../../../store/Store";
import ToggleSwitch from "../Interactions/ToggleSwitch";

export default function APIPushActionBar({ style: button }) {
  const code = APIStore((s) => s.data.ResponseCode);
  const APIAction = APIStore((s) => s.data.APIAction);
  const setAPIAction = APIStore((s) => s.setAPIAction);
  const setObjectFields = APIStore((s) => s.setObjectFields);
  const setObjectType = APIStore((s) => s.setObjectType);
  const showRequired = ReuseDataStateStore((s) => s.data.ShowRequiredAudit);
  const setShowRequired = ReuseDataStateStore((s) => s.setShowRequiredAudit);
  const setMessage = APIStore((s) => s.setResponseMessage);
  const APIPayloadHolder = APIStore((s) => s.data.APIPayloadHolder);
  const ButtonStyle = "bg-red-500 text-white rounded px-3 py-1 mx-2";

  return (
    <div className="flex flex-row justify-around items-start my-2">
      {/* <div>{code !== "" ? <button className={button}>{code}</button> : null}</div> */}
      <div className="flex flex-row gap-3 justify-around w-full">
        <div>
          <button
            className={
              Object.keys(APIPayloadHolder).length === 0 ? "bg-gray border px-2 py-1 text-white rounded-md" : ButtonStyle
            }
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
        <ToggleSwitch label={"Show Required"} checked={showRequired} onChange={setShowRequired} lableColor="white" />
      </div>
    </div>
  );
}
