import React from "react";
import { APIStore } from "../../../store/Store";
import { MdInfoOutline } from "react-icons/md";

export default function AuditLocationInput({ ui }) {
  const LOCATION = APIStore((s) => s.data.LOCATION);
  const setMessage = APIStore((s) => s.setResponseMessage);
  const setSingleAPIPayloadHolder = APIStore((s) => s.setSingleAPIPayloadHolder);

  const label = "LOCATION";

  React.useEffect(() => {
    setSingleAPIPayloadHolder("cmbLocation", LOCATION || "");
  }, [LOCATION, setSingleAPIPayloadHolder]);

  return (
    <div className={ui.cardOuter}>
      <div className={ui.cardHeader}>
        <label className={ui.labelRequired}>Location</label>
      </div>

      <div className={ui.cardBody}>
        <input name="location" readOnly type="text" className={ui.input} value={LOCATION} />

        <button
          type="button"
          className={ui.infoButton}
          onClick={() => {
            const text =
              "The parent location such as ROOM-101. Must match a Location defined in the system. Location is set in the Settings screen.";
            setMessage({ type: "info_header", text, label });
          }}
        >
          <MdInfoOutline size={20} />
        </button>
      </div>
    </div>
  );
}
