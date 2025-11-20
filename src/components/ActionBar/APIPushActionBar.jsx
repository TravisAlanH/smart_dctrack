import React from "react";
import axios from "axios";
import { APIStore } from "../../../store/Store";

export default function APIPushActionBar({ style: button, setShow }) {
  const code = APIStore((s) => s.data.ResponseCode);
  const setAPIMessage = APIStore((s) => s.setResponseMessage);

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
    <div className="flex flex-row justify-around items-start my-2">
      <div>
        {code !== "" ? (
          <button className={button} onClick={() => setShow(1)}>
            {code}
          </button>
        ) : null}
      </div>

      <div>
        <button
          className={button}
          onClick={() => {
            const form = document.querySelector("form");
            if (form) form.requestSubmit();
          }}
        >
          API Push
        </button>
      </div>
    </div>
  );
}
