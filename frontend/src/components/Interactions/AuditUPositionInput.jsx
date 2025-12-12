import React from "react";
import { APIStore } from "../../../store/Store";
import { MdInfoOutline } from "react-icons/md";

export default function AuditUPositionInput({ objectType, ui, style }) {
  const CabinetsInLocation = APIStore((s) => s.data.CabinetsInLocation);
  const setSingleAPIPayloadHolder = APIStore((s) => s.setSingleAPIPayloadHolder);
  const currentCabinetID = APIStore((s) => s.data.CurrentCabinetID);
  const APIPayloadHolder = APIStore((s) => s.data.APIPayloadHolder);
  const setMessage = APIStore((s) => s.setResponseMessage);

  const selectedCabinet = (CabinetsInLocation?.cabinets || []).find((x) => x.cabinetId == currentCabinetID) || null;

  const filled = APIPayloadHolder["cmbUPosition"];
  const clean = filled ? String(filled).trim() : "";

  const baseList = selectedCabinet?.uPosition
    ? selectedCabinet.uPosition
        .split(",")
        .map((v) => v.trim())
        .filter((v) => v.length > 0)
    : [];

  const uList = clean !== "" && !baseList.includes(clean) ? [...baseList, clean] : baseList;

  const label = "U Position";

  return (
    <div className={ui.cardOuter} style={style.CardBackGround}>
      <div className={ui.cardHeader} style={style.text}>
        <label className={ui.labelRequired}>{label}</label>
      </div>

      <div className={ui.cardBody}>
        <select
          className={ui.select}
          required
          value={APIPayloadHolder["cmbUPosition"] || ""}
          onChange={(e) => {
            setSingleAPIPayloadHolder("cmbUPosition", e.target.value || "");
          }}
        >
          {!currentCabinetID ? <option value="">Cabinet Required</option> : <option value="">Select U Position</option>}

          {objectType === "Rack PDU / AC Power" ? (
            <>
              <option value="2">2</option>
              <option value="1">1</option>
            </>
          ) : (
            [...uList].reverse().map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))
          )}
        </select>

        <button
          type="button"
          className={ui.infoButton}
          style={style.infoButton}
          onClick={() => {
            const text = "Open U Position in the selected cabinet where the device is located.";
            setMessage({ type: "info_header", text, label });
          }}
        >
          <MdInfoOutline size={20} />
        </button>
      </div>
    </div>
  );
}
