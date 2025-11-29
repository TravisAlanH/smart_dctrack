import React from "react";
import { APIStore } from "../../../store/Store";

export default function AuditCabinetSideInput({ ui }) {
  const setSingleAPIPayloadHolder = APIStore((s) => s.setSingleAPIPayloadHolder);
  const setMessage = APIStore((s) => s.setResponseMessage);
  const APIPayloadHolder = APIStore((s) => s.data.APIPayloadHolder);

  const label = "Cabinet Side";
  const options = ["Left", "Right"];

  return (
    <div className={ui.cardOuter}>
      <div className={ui.cardHeader}>
        <label className={ui.labelRequired}>Cabinet Side</label>
      </div>

      <div className={ui.cardBody}>
        <select
          className={ui.select}
          required
          value={(APIPayloadHolder["radioCabinetSide"] || "").replace(" Side (Based on Cabinet Rear)", "")}
          onChange={(e) => {
            setSingleAPIPayloadHolder("radioCabinetSide", e.target.value || "");
          }}
        >
          <option value="">Select Cabinet Side</option>
          {options.map((x) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </select>

        <button
          type="button"
          className={ui.infoButton}
          onClick={() => {
            const text = "Left or right side of the cabinet where the PDU is mounted.";
            setMessage({ type: "info_header", text, label });
          }}
        >
          ?
        </button>
      </div>
    </div>
  );
}
