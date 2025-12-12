import React from "react";
import { APIStore } from "../../../store/Store";
import { MdInfoOutline } from "react-icons/md";

export default function AuditChassisFaceInput({ ui, style }) {
  const setSingleAPIPayloadHolder = APIStore((s) => s.setSingleAPIPayloadHolder);
  const setMessage = APIStore((s) => s.setResponseMessage);
  const APIPayloadHolder = APIStore((s) => s.data.APIPayloadHolder);

  const label = "Chassis Face";
  const api = "radioChassisFace";

  const options = ["Front", "Back"];

  const APIPayloadCheck = "cmbChassis";

  return (
    <div className={ui.cardOuter} style={style.CardBackGround}>
      <div className={ui.cardHeader} style={style.text}>
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
          {APIPayloadHolder[APIPayloadCheck] === "" ? (
            <option value="">Chassis Required</option>
          ) : (
            <option value="">Select Chassis Face</option>
          )}

          {APIPayloadHolder[APIPayloadCheck] === ""
            ? null
            : options.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
        </select>

        <button
          type="button"
          className={ui.infoButton}
          style={style.infoButton}
          onClick={() => {
            const text = "Select the face of the chassis where the item is located.";
            setMessage({ type: "info_header", text, label: api });
          }}
        >
          <MdInfoOutline size={20} />
        </button>
      </div>
    </div>
  );
}
