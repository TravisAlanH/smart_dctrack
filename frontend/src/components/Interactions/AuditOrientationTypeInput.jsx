import React from "react";
import { APIStore } from "../../../store/Store";

export default function AuditOrientationTypeInput({ ui }) {
  const setSingleAPIPayloadHolder = APIStore((s) => s.setSingleAPIPayloadHolder);
  const setMessage = APIStore((s) => s.setResponseMessage);
  const APIPayloadHolder = APIStore((s) => s.data.APIPayloadHolder);

  const label = "Orientation Type";
  const api = "cmbOrientation";

  const options = ["Item Front Faces Cabinet Front", "Item Front Faces Cabinet Back"];

  return (
    <div className={ui.cardOuter}>
      <div className={ui.cardHeader}>
        <label className={ui.labelRequired}>{label}</label>
      </div>

      <div className={ui.cardBody}>
        <select
          className={ui.select}
          required
          value={APIPayloadHolder[api] || ""}
          onChange={(e) => {
            setSingleAPIPayloadHolder(api, e.target.value || "");
          }}
        >
          <option value="">Select Orientation</option>

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
            const text = "Defines if the item faces the front or back of the cabinet.";
            setMessage({ type: "info_header", text, label: api });
          }}
        >
          ?
        </button>
      </div>
    </div>
  );
}
