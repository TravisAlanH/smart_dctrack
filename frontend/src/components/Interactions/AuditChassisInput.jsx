import React from "react";
import { APIStore } from "../../../store/Store";
import { MdInfoOutline } from "react-icons/md";

export default function AuditChassisInput({ ui }) {
  const setCurrentCabinetID = APIStore((s) => s.setCurrentCabinetID);
  const CabinetsInLocation = APIStore((s) => s.data.CabinetsInLocation);
  const AssetsInCabinet = APIStore((s) => s.data.AssetsInCabinet);
  const currentCabinetID = APIStore((s) => s.data.CurrentCabinetID);
  const setMessage = APIStore((s) => s.setResponseMessage);
  const setSingleAPIPayloadHolder = APIStore((s) => s.setSingleAPIPayloadHolder);
  const APIPayloadHolder = APIStore((s) => s.data.APIPayloadHolder);

  const label = "cmbChassis";

  const [ChassisInCabinet, setChassisInCabinet] = React.useState([]);

  React.useEffect(() => {
    if (!currentCabinetID || !AssetsInCabinet?.cabinetItems) return;
    const chassisList = AssetsInCabinet.cabinetItems.filter((asset) => asset.formFactor === "Chassis");
    setChassisInCabinet(chassisList);
  }, [currentCabinetID, AssetsInCabinet]);

  return (
    <div className={ui.cardOuter}>
      <div className={ui.cardHeader}>
        <label className={ui.labelRequired}>Chassis</label>
      </div>

      <div className={ui.cardBody}>
        <select
          className={ui.select}
          required
          value={APIPayloadHolder[label] || ""}
          onChange={(e) => {
            setSingleAPIPayloadHolder(label, e.target.value);
          }}
        >
          {!currentCabinetID ? <option value="">Cabinet Required</option> : <option value="">Select Chassis</option>}

          {(ChassisInCabinet || []).map((cab) => (
            <option key={cab.id} value={cab.tiName}>
              {cab.tiName}
            </option>
          ))}
        </select>

        <button
          type="button"
          className={ui.infoButton}
          onClick={() => {
            const text = "Select the chassis asset that this blade belongs to.";
            setMessage({ type: "info_header", text, label: label });
          }}
        >
          <MdInfoOutline size={20} />
        </button>
      </div>
    </div>
  );
}
