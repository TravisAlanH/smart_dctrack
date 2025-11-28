import React from "react";
import { APIStore } from "../../../store/Store";

export default function AuditDepthPositionInput({ ui }) {
  const setSingleAPIPayloadHolder = APIStore((s) => s.setSingleAPIPayloadHolder);
  const setMessage = APIStore((s) => s.setResponseMessage);

  const label = "Depth Position";
  const options = ["FRONT", "CENTER", "BACK"];

  return (
    <div className={ui.cardOuter}>
      <div className={ui.cardHeader}>
        <label className={ui.labelRequired}>Depth Position</label>
      </div>

      <div className={ui.cardBody}>
        <select
          className={ui.select}
          required
          onChange={(e) => {
            setSingleAPIPayloadHolder("radioDepthPosition", e.target.value || "");
          }}
        >
          <option value="">Select Depth Position</option>
          {options.map((data) => (
            <option key={data} value={data}>
              {data}
            </option>
          ))}
        </select>

        <button
          type="button"
          className={ui.infoButton}
          onClick={() => {
            const text = "Defines front, middle, or rear mounting depth depending on the PDU installation.";
            setMessage({ type: "info_header", text, label });
          }}
        >
          ?
        </button>
      </div>
    </div>
  );
}
