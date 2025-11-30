import React from "react";
import { APIStore } from "../../../store/Store";

export default function AuditSlotInput({ objectType, ui }) {
  const CabinetsInLocation = APIStore((s) => s.data.CabinetsInLocation);
  const setSingleAPIPayloadHolder = APIStore((s) => s.setSingleAPIPayloadHolder);
  const APIPayloadHolder = APIStore((s) => s.data.APIPayloadHolder);
  const setMessage = APIStore((s) => s.setResponseMessage);
  const AssetsInCabinet = APIStore((s) => s.data.AssetsInCabinet);
  const CassisModelsInCabinet = APIStore((s) => s.data.CassisModelsInCabinet);

  const [Slots, setSlots] = React.useState([]);

  // 12-port 100 FX SFP-based MIC

  React.useEffect(() => {
    const chassisName = APIPayloadHolder["cmbChassis"] || "";
    if (!chassisName) {
      setSlots([]);
      console.log("no chassisName");
      return;
    }
    const formFactor = APIPayloadHolder["tiFormFactor"] || "";
    const chassisData = AssetsInCabinet?.cabinetItems.find((asset) => asset.tiName === chassisName);
    const chassisModelID = chassisData ? chassisData["modelId"] : null;

    if (!chassisModelID) {
      setSlots([]);
      console.log("no ChassisModelID");
      return;
    }
    const chassisModel = CassisModelsInCabinet?.find((model) => model.modelId === chassisModelID);
    if (!chassisModel) {
      setSlots([]);
      console.log("no chassisModel");
      return;
    }
    const ChassisFace = APIPayloadHolder["radioChassisFace"] || "";
    if (!ChassisFace) {
      setSlots([]);
      return;
    }
    const ChassisModelFace = chassisModel?.chassisFaces.find((item) => item.face === ChassisFace);
    if (!ChassisModelFace) {
      setSlots([]);
      console.log("no ChassisModelFace");
      return;
    }

    if (ChassisModelFace.chassisSlots.some((s) => s.anchor) && formFactor !== "Full") {
      console.log("Anchor found");
      console.log(ChassisModelFace.chassisSlots.some((s) => s.anchor));
      const AvailableSlots = [];
      ChassisModelFace.chassisSlots.forEach((slot) => {
        AvailableSlots.push(slot.slotLabel);
      });
      setSlots(AvailableSlots);
    } else {
      setSlots(ChassisModelFace.chassisSlots.filter((slot) => slot.anchor).map((slot) => slot.slotLabel));
    }
  }, [APIPayloadHolder, CabinetsInLocation, AssetsInCabinet, CassisModelsInCabinet]);

  // radioChassisFace

  const label = "cmbSlotPosition";
  const APIPayloadCheck = "radioChassisFace";

  return (
    <div className={ui.cardOuter}>
      <div className={ui.cardHeader}>
        <label className={ui.labelRequired}>Slot Position</label>
      </div>

      <div className={ui.cardBody}>
        <select
          className={ui.select}
          required
          value={APIPayloadHolder[label] || ""}
          onChange={(e) => {
            setSingleAPIPayloadHolder(label, e.target.value || "");
          }}
        >
          {APIPayloadHolder[APIPayloadCheck] === "" ? (
            <option value="">Chassis Required</option>
          ) : (
            <option value="">Select Slot</option>
          )}

          {APIPayloadHolder[APIPayloadCheck] === ""
            ? null
            : Slots.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
        </select>

        <button
          type="button"
          className={ui.infoButton}
          onClick={() => {
            const text = "Open U Position in the selected cabinet where the device is located.";
            setMessage({ type: "info_header", text, label: label });
          }}
        >
          ?
        </button>
      </div>
    </div>
  );
}
