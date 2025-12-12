import React from "react";
import { APIStore } from "../../../store/Store";
import { MdInfoOutline } from "react-icons/md";

export default function AuditCabinetSideInput({ ui, style }) {
  const setSingleAPIPayloadHolder = APIStore((s) => s.setSingleAPIPayloadHolder);
  const setMessage = APIStore((s) => s.setResponseMessage);
  const APIPayloadHolder = APIStore((s) => s.data.APIPayloadHolder);

  const label = "Cabinet Side";
  const options = ["Left", "Right"];

  return (
    <div className={ui.cardOuter} style={style.CardBackGround}>
      <div className={ui.cardHeader} style={style.text}>
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
          style={style.infoButton}
          onClick={() => {
            const text = "Left or right side of the cabinet where the PDU is mounted.";
            setMessage({ type: "info_header", text, label });
          }}
        >
          <MdInfoOutline size={20} />
        </button>
      </div>
    </div>
  );
}
