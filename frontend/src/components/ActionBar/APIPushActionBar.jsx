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
  const ButtonStyle = "bg-blue-600 text-white rounded px-3 py-1 mx-2";
  //   function sendAPIPush() {
  //     const payload = APIStore.getState().payload || {};

  //     const config = {
  //       method: "post",
  //       maxBodyLength: Infinity,
  //       url: "https://10.34.0.25/api/v2/dcimoperations/items?returnDetails=false",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //         Authorization: "Basic YWRtaW46c3VuYmlyZA==",
  //       },
  //       data: JSON.stringify(payload),
  //     };

  //     axios
  //       .request(config)
  //       .then((res) => {
  //         setCode(res.status);
  //         setAPIMessage(res);
  //       })
  //       .catch((err) => {
  //         setCode(err.code);
  //         setAPIMessage(err);
  //       });
  //   }
  return (
    <div>
      {APIAction === "ADD" ? (
        <div className="flex flex-row justify-around items-start my-2">
          {/* <div>{code !== "" ? <button className={button}>{code}</button> : null}</div> */}
          <div className="flex flex-row gap-3 justify-end">
            <ToggleSwitch label={"Show Required"} checked={showRequired} onChange={setShowRequired} />
            <div>
              <button
                className={
                  Object.keys(APIPayloadHolder).length === 0 ? "bg-gray border px-2 py-1 text-white rounded-md" : ButtonStyle
                }
                disabled={Object.keys(APIPayloadHolder).length === 0}
                onClick={() => {
                  // setAPIAction("ADD");
                  // setObjectFields("");
                  // setObjectType("");
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
          </div>

          <div>
            <button
              className={button}
              onClick={() => {
                const form = document.querySelector("form");
                if (form) form.requestSubmit();
              }}
            >
              Push
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-row justify-around items-start my-2">
          {/* <div>{code !== "" ? <button className={button}>{code}</button> : null}</div> */}
          <div className="flex flex-row gap-3 justify-end">
            <ToggleSwitch label={"Show Required"} checked={showRequired} onChange={setShowRequired} />
            <div>
              <button
                className={
                  Object.keys(APIPayloadHolder).length === 0 ? "bg-gray border px-2 py-1 text-white rounded-md" : ButtonStyle
                }
                disabled={Object.keys(APIPayloadHolder).length === 0}
                onClick={() => {
                  // setAPIAction("ADD");
                  // setObjectFields("");
                  // setObjectType("");
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
          </div>
          <div>
            <button
              className={button}
              onClick={() => {
                const form = document.querySelector("form");
                if (form) form.requestSubmit();
              }}
            >
              EDIT
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
