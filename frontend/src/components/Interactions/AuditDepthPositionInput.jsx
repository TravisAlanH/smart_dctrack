import React from "react";
import { APIStore } from "../../../store/Store";
import { MdInfoOutline } from "react-icons/md";

export default function AuditDepthPositionInput({ ui, style }) {
  const setSingleAPIPayloadHolder = APIStore((s) => s.setSingleAPIPayloadHolder);
  const setMessage = APIStore((s) => s.setResponseMessage);
  const APIPayloadHolder = APIStore((s) => s.data.APIPayloadHolder);

  const label = "Depth Position";
  const options = ["Front", "Center", "Back"];

  return (
    <div className={ui.cardOuter} style={style.CardBackGround}>
      <div className={ui.cardHeader} style={style.text}>
        <label className={ui.labelRequired}>Depth Position</label>
      </div>

      <div className={ui.cardBody}>
        <select
          className={ui.select}
          required
          value={APIPayloadHolder["radioDepthPosition"] || ""}
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
          style={style.infoButton}
          onClick={() => {
            const text = "Defines front, middle, or rear mounting depth depending on the PDU installation.";
            setMessage({ type: "info_header", text, label });
          }}
        >
          <MdInfoOutline size={20} />
        </button>
      </div>
    </div>
  );
}
