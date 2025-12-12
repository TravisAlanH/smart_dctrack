import React from "react";
import { APIStore } from "../../../store/Store";
import { MdInfoOutline } from "react-icons/md";

export default function AuditCabinetInput({ ui, style }) {
  const pullCabinetData = APIStore((s) => s.pullCabinetData);
  const setCurrentCabinetID = APIStore((s) => s.setCurrentCabinetID);
  const CabinetsInLocation = APIStore((s) => s.data.CabinetsInLocation);
  const LOCATIONCODE = APIStore((s) => s.data.LOCATIONCODE);
  const setMessage = APIStore((s) => s.setResponseMessage);
  const setSingleAPIPayloadHolder = APIStore((s) => s.setSingleAPIPayloadHolder);
  const APIPayloadHolder = APIStore((s) => s.data.APIPayloadHolder);

  const label = "Cabinet";

  React.useEffect(() => {
    if (!LOCATIONCODE) return;
    pullCabinetData(LOCATIONCODE);
  }, [LOCATIONCODE, pullCabinetData]);

  return (
    <div className={ui.cardOuter} style={style.CardBackGround}>
      <div className={ui.cardHeader} style={style.text}>
        <label className={ui.labelRequired}>Cabinet</label>
      </div>

      <div className={ui.cardBody}>
        <select
          className={ui.select}
          required
          value={APIPayloadHolder["cmbCabinet"] || ""}
          onChange={(e) => {
            const cab = CabinetsInLocation.cabinets.find((x) => x.cabinet === e.target.value);

            if (!cab) return;

            setCurrentCabinetID(cab.cabinetId);
            setSingleAPIPayloadHolder("cmbCabinet", cab.cabinet);
          }}
        >
          {!LOCATIONCODE ? <option value="">Location Required</option> : <option value="">Select Cabinet</option>}

          {(CabinetsInLocation?.cabinets || []).map((cab) => (
            <option key={cab.cabinetId} value={cab.cabinet}>
              {cab.cabinet}
            </option>
          ))}
        </select>

        <button
          type="button"
          className={ui.infoButton}
          style={style.infoButton}
          onClick={() => {
            const text = "Select the cabinet inside the chosen location. The list comes from the system after a location is set.";
            setMessage({ type: "info_header", text, label });
          }}
        >
          <MdInfoOutline size={20} />
        </button>
      </div>
    </div>
  );
}
