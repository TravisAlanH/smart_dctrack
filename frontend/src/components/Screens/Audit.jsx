import { useState, useEffect } from "react";
import { APIStore, ReuseDataStateStore } from "../../../store/Store";
import CameraModal from "../Camera/CameraModal/CameraModal";
import { dcTrack_DISCRIPTIONS } from "../Helpers/dcTrackAPIDiscriptions";
import { dcTrack_APIREQUIRED } from "../Helpers/dcTrackAPIRequired";
import { dcTrack_EDITABLE } from "../Helpers/dcTrackAPIEditable";
import { dcTrack_READABLE } from "../Helpers/dcTrackAPIReadable";
import { dcTrack_ENDPOINTS } from "../Helpers/dcTrackAPIReturns";
import { dcTrack_INPUTTYPES } from "../Helpers/dcTrackAPIInputTypes";
import { dcTrack_URL } from "../Helpers/dcTrackAPIEndpointURL";
import { dcTrack_Mounting_Translation } from "../Helpers/dcTrackAPIMountingTranslation";
import { loadRequiredMaster } from "../Helpers/RequiredMaster";

import AuditMakeInput from "../Interactions/AuditMakeInput";
import AuditModelInput from "../Interactions/AuditModelInput";
import AuditLocationInput from "../Interactions/AuditLocationInput";
import AuditCabinetInput from "../Interactions/AuditCabinetInput";
import AuditUPositionInput from "../Interactions/AuditUPositionInput";
import AuditCabinetSideInput from "../Interactions/AuditCabinetSideInput";
import AuditDepthPositionInput from "../Interactions/AuditDepthPositionInput";
import AuditRailsUsedInput from "../Interactions/AuditRailsUsedInput";
import AuditOrientationTypeInput from "../Interactions/AuditOrientationTypeInput";
import AuditChassisInput from "../Interactions/AuditChassisInput";
import AuditChassisFaceInput from "../Interactions/AuditChassisFaceInput";
import AuditSlotInput from "../Interactions/AuditSlotInput";

/* Shared UI */
export const auditUI = {
  cardOuter: "flex flex-col bg-slate-600 rounded-md mx-2",
  cardHeader: "px-3 pt-2 pb-1 text-xs sm:text-sm font-semibold text-white",
  cardBody: "w-full flex flex-row items-center gap-2 px-3 pb-2",

  label: "text-sm sm:text-sm",
  labelRequired: "text-sm sm:text-sm text-red-400 font-bold",

  // iOS zoom fix: use text-base
  input: "border border-gray-400 rounded px-2 py-1 text-base w-full bg-white text-black",
  select: "border border-gray-400 rounded px-2 py-1 text-base w-full bg-white text-black",

  mainButton: "bg-blue-600 text-white rounded px-3 py-1 text-sm sm:text-sm whitespace-nowrap",
  infoButton: "bg-green-600 text-white rounded px-2 py-1 text-sm sm:text-sm whitespace-nowrap",
};

/* MAIN COMPONENT */
export default function Audit() {
  const APIPayloadHolder = APIStore((s) => s.data.APIPayloadHolder);
  const setAPIPayloadHolder = APIStore((s) => s.setAPIPayloadHolder);
  const setMessage = APIStore((s) => s.setResponseMessage);
  const setAuditURL = APIStore((s) => s.setAuditUrl);
  const setPayload = APIStore((s) => s.setAuditPayload);
  const sendAPIPush = APIStore((s) => s.sendAPIPush);
  const resetAPUIPayloadHolder = APIStore((s) => s.resetAPUIPayloadHolder);

  const objectFields = ReuseDataStateStore((s) => s.data.objectFields);
  const setObjectFields = ReuseDataStateStore((s) => s.setObjectFields);
  const objectType = ReuseDataStateStore((s) => s.data.objectType);
  const setObjectType = ReuseDataStateStore((s) => s.setObjectType);

  const APIAction = APIStore((s) => s.data.APIAction);
  const EditAPIPush = APIStore((s) => s.EditAPIPush);
  const SelectedInCabinetAsset = ReuseDataStateStore((s) => s.data.SelectedInCabinetAsset);
  const setAPIAction = APIStore((s) => s.setAPIAction);

  const showRequired = ReuseDataStateStore((s) => s.data.ShowRequiredAudit);

  const setCameraStatus = ReuseDataStateStore((s) => s.setCameraStatus);
  const setCameraRequiredToProcess = ReuseDataStateStore((s) => s.setCameraRequiredToProcess);

  const [trueRequredMaster, setTrueRequiredMaster] = useState(loadRequiredMaster(dcTrack_APIREQUIRED));
  const requireWatcher = ReuseDataStateStore((s) => s.data.RequireToggleWatcher);

  useEffect(() => {
    setTrueRequiredMaster(loadRequiredMaster(dcTrack_APIREQUIRED));
  }, [requireWatcher]);

  useEffect(() => {
    setTrueRequiredMaster(loadRequiredMaster(dcTrack_APIREQUIRED));
  }, []);

  function handleFormSubmit(e) {
    e.preventDefault();
    setPayload(APIPayloadHolder);

    if (APIAction === "ADD") {
      sendAPIPush();
    } else if (APIAction === "EDIT") {
      EditAPIPush(SelectedInCabinetAsset.id);
    }
  }

  return (
    <div className="w-full h-full flex flex-col overflow-hidden text-white">
      <div className="flex-none">
        <div className="flex flex-row items-center justify-between px-4 pt-2 pb-1">
          <h2 className="font-bold text-lg">Audit</h2>
        </div>

        <div className="z-20">
          <CameraModal />
        </div>

        <div className="px-2 pt-1 pb-2 space-y-2">
          <OperationInput APIAction={APIAction} ui={auditUI} />
          <ObjectInput
            objectType={objectType}
            setObjectFields={setObjectFields}
            setObjectType={setObjectType}
            setURL={setAuditURL}
            setAPIPayloadHolder={setAPIPayloadHolder}
            resetAPUIPayloadHolder={resetAPUIPayloadHolder}
            setAPIAction={setAPIAction}
            ui={auditUI}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-1 pb-24">
        {objectFields !== "" ? (
          <form className="w-full flex flex-col gap-2 pb-6" onSubmit={handleFormSubmit}>
            {Object.keys(objectFields ?? {}).map((label, index) => {
              if (showRequired && !trueRequredMaster[objectType][label]) return null;

              const type = dcTrack_INPUTTYPES[objectType][label];
              const props = {
                label,
                objectType,
                setMessage,
                APIPayloadHolder,
                setAPIPayloadHolder,
                trueRequredMaster,
                ui: auditUI,
              };

              switch (type) {
                case "Number":
                  return <NumberInput key={index} {...props} />;
                case "ORC":
                  return (
                    <OcrInput
                      key={index}
                      {...props}
                      setCameraStatus={setCameraStatus}
                      setCameraRequiredToProcess={setCameraRequiredToProcess}
                    />
                  );
                case "IMG":
                  return (
                    <ImgInput
                      key={index}
                      {...props}
                      setCameraStatus={setCameraStatus}
                      setCameraRequiredToProcess={setCameraRequiredToProcess}
                    />
                  );
                case "QR":
                  return (
                    <QrInput
                      key={index}
                      {...props}
                      setCameraStatus={setCameraStatus}
                      setCameraRequiredToProcess={setCameraRequiredToProcess}
                    />
                  );
                case "IMGMake":
                  return <AuditMakeInput key={index} {...props} ui={auditUI} />;
                case "IMGModel":
                  return <AuditModelInput key={index} {...props} ui={auditUI} />;
                case "LOCATION":
                  return <AuditLocationInput key={index} ui={auditUI} />;
                case "CABINET":
                  return <AuditCabinetInput key={index} ui={auditUI} />;
                case "UPosition":
                  return <AuditUPositionInput key={index} objectType={objectType} ui={auditUI} />;
                case "CABINETSIDE":
                  return <AuditCabinetSideInput key={index} ui={auditUI} />;
                case "DEPTHPOSITION":
                  return <AuditDepthPositionInput key={index} ui={auditUI} />;
                case "RAILSUSED":
                  return <AuditRailsUsedInput key={index} ui={auditUI} />;
                case "ORIENTATION":
                  return <AuditOrientationTypeInput key={index} ui={auditUI} />;
                case "CHASSIS":
                  return <AuditChassisInput key={index} ui={auditUI} />;
                case "CHASSISFACE":
                  return <AuditChassisFaceInput key={index} ui={auditUI} />;
                case "SLOTPOSITION":
                  return <AuditSlotInput key={index} ui={auditUI} />;
                default:
                  return <TextInput key={index} {...props} />;
              }
            })}

            <div className="px-2 pt-2 flex justify-end">
              <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2 text-sm">
                Submit
              </button>
            </div>
          </form>
        ) : null}
      </div>
    </div>
  );
}

/* INPUT CARDS */

function TextInput({ label, objectType, setMessage, setAPIPayloadHolder, APIPayloadHolder, trueRequredMaster, ui }) {
  const req = trueRequredMaster[objectType][label];
  const edit = dcTrack_EDITABLE[objectType][label];

  return (
    <div className={ui.cardOuter}>
      <div className={ui.cardHeader}>
        <label className={req ? ui.labelRequired : ui.label}>{dcTrack_READABLE[objectType][label]}</label>
      </div>

      <div className={ui.cardBody}>
        <input
          name={label}
          required={req}
          readOnly={!edit}
          placeholder={label}
          type="text"
          className={ui.input}
          value={APIPayloadHolder[label] || ""}
          onChange={(e) => {
            setAPIPayloadHolder({ type: objectType, field: label, value: e.target.value });
          }}
        />

        <button
          type="button"
          className={ui.infoButton}
          onClick={() => {
            const text = dcTrack_DISCRIPTIONS[objectType]?.[label] || "No data";
            setMessage({ type: "info_header", text, label });
          }}
        >
          ?
        </button>
      </div>
    </div>
  );
}

function NumberInput({ label, objectType, setMessage, setAPIPayloadHolder, APIPayloadHolder, trueRequredMaster, ui }) {
  const req = trueRequredMaster[objectType][label];
  const edit = dcTrack_EDITABLE[objectType][label];

  return (
    <div className={ui.cardOuter}>
      <div className={ui.cardHeader}>
        <label className={req ? ui.labelRequired : ui.label}>{dcTrack_READABLE[objectType][label]}</label>
      </div>

      <div className={ui.cardBody}>
        <input
          name={label}
          type="number"
          required={req}
          readOnly={!edit}
          placeholder={label}
          className={ui.input}
          value={APIPayloadHolder[label] ?? ""}
          onChange={(e) => {
            setAPIPayloadHolder({ type: objectType, field: label, value: e.target.value });
          }}
        />

        <button
          type="button"
          className={ui.infoButton}
          onClick={() => {
            const text = dcTrack_DISCRIPTIONS[objectType]?.[label] || "No data";
            setMessage({ type: "info_header", text, label });
          }}
        >
          ?
        </button>
      </div>
    </div>
  );
}

function OcrInput({
  label,
  objectType,
  setMessage,
  setAPIPayloadHolder,
  APIPayloadHolder,
  setCameraStatus,
  setCameraRequiredToProcess,
  trueRequredMaster,
  ui,
}) {
  const req = trueRequredMaster[objectType][label];
  const edit = dcTrack_EDITABLE[objectType][label];

  return (
    <div className={ui.cardOuter}>
      <div className={ui.cardHeader}>
        <label className={req ? ui.labelRequired : ui.label}>{dcTrack_READABLE[objectType][label]}</label>
      </div>

      <div className={ui.cardBody}>
        <input
          name={label}
          type="text"
          required={req}
          readOnly={!edit}
          placeholder={label}
          className={ui.input}
          value={APIPayloadHolder[label] || ""}
          onChange={(e) => {
            setAPIPayloadHolder({ type: objectType, field: label, value: e.target.value });
          }}
        />

        <button
          type="button"
          className={ui.mainButton}
          onClick={() => {
            setCameraRequiredToProcess(objectType, label);
            setCameraStatus(0);
            const el = document.getElementById("CameraModal");
            if (el) el.style.display = "block";
          }}
        >
          ORC
        </button>

        <button
          type="button"
          className={ui.infoButton}
          onClick={() => {
            const text = dcTrack_DISCRIPTIONS[objectType]?.[label] || "No data";
            setMessage({ type: "info_header", text, label });
          }}
        >
          ?
        </button>
      </div>
    </div>
  );
}

function ImgInput({
  label,
  objectType,
  setMessage,
  setAPIPayloadHolder,
  APIPayloadHolder,
  setCameraStatus,
  setCameraRequiredToProcess,
  trueRequredMaster,
  ui,
}) {
  const req = trueRequredMaster[objectType][label];
  const edit = dcTrack_EDITABLE[objectType][label];

  return (
    <div className={ui.cardOuter}>
      <div className={ui.cardHeader}>
        <label className={req ? ui.labelRequired : ui.label}>{dcTrack_READABLE[objectType][label]}</label>
      </div>

      <div className={ui.cardBody}>
        <input
          name={label}
          type="text"
          required={req}
          readOnly={!edit}
          placeholder={label}
          className={ui.input}
          value={APIPayloadHolder[label] || ""}
          onChange={(e) => {
            setAPIPayloadHolder({ type: objectType, field: label, value: e.target.value });
          }}
        />

        <button
          type="button"
          className={ui.mainButton}
          onClick={() => {
            setCameraRequiredToProcess(objectType, label);
            setCameraStatus(1);
            const el = document.getElementById("CameraModal");
            if (el) el.style.display = "block";
          }}
        >
          Scan
        </button>

        <button
          type="button"
          className={ui.infoButton}
          onClick={() => {
            const text = dcTrack_DISCRIPTIONS[objectType]?.[label] || "No data";
            setMessage({ type: "info_header", text, label });
          }}
        >
          ?
        </button>
      </div>
    </div>
  );
}

function QrInput({
  label,
  objectType,
  setMessage,
  setAPIPayloadHolder,
  APIPayloadHolder,
  setCameraStatus,
  setCameraRequiredToProcess,
  trueRequredMaster,
  ui,
}) {
  const req = trueRequredMaster[objectType][label];
  const edit = dcTrack_EDITABLE[objectType][label];

  return (
    <div className={ui.cardOuter}>
      <div className={ui.cardHeader}>
        <label className={req ? ui.labelRequired : ui.label}>{dcTrack_READABLE[objectType][label]}</label>
      </div>

      <div className={ui.cardBody}>
        <input
          name={label}
          type="text"
          required={req}
          readOnly={!edit}
          placeholder={label}
          className={ui.input}
          value={APIPayloadHolder[label] || ""}
          onChange={(e) => {
            setAPIPayloadHolder({ type: objectType, field: label, value: e.target.value });
          }}
        />

        <button
          type="button"
          className={ui.mainButton}
          onClick={() => {
            setCameraRequiredToProcess(objectType, label);
            setCameraStatus(2);
            const el = document.getElementById("CameraModal");
            if (el) el.style.display = "block";
          }}
        >
          Scan
        </button>

        <button
          type="button"
          className={ui.infoButton}
          onClick={() => {
            const text = dcTrack_DISCRIPTIONS[objectType]?.[label] || "No data";
            setMessage({ type: "info_header", text, label });
          }}
        >
          ?
        </button>
      </div>
    </div>
  );
}

/* OPERATION INPUT */
function OperationInput({ APIAction, ui }) {
  return (
    <div className={ui.cardOuter}>
      <div className={ui.cardHeader}>
        <label className={ui.label}>Operation</label>
      </div>

      <div className={ui.cardBody}>
        <input type="text" className={ui.input} value={APIAction} readOnly />
      </div>
    </div>
  );
}

/* OBJECT INPUT */
function ObjectInput({
  objectType,
  setObjectFields,
  setObjectType,
  setURL,
  setAPIPayloadHolder,
  resetAPUIPayloadHolder,
  setAPIAction,
  ui,
}) {
  return (
    <div className={ui.cardOuter}>
      <div className={ui.cardHeader}>
        <label className={ui.label}>Mounting Type</label>
      </div>

      <div className={ui.cardBody}>
        <select
          value={objectType}
          className={ui.select}
          onChange={(e) => {
            const type = e.target.value;
            if (type === "") return;

            setAPIAction("ADD");
            setObjectFields(dcTrack_ENDPOINTS[type]);
            setObjectType(type);
            setURL(dcTrack_URL[type]);
            resetAPUIPayloadHolder();

            setAPIPayloadHolder({
              type,
              field: "Object",
              value: type,
            });
          }}
        >
          <option value="">Select</option>

          {Object.keys(dcTrack_ENDPOINTS).map((key) => (
            <option key={key} value={key}>
              {dcTrack_Mounting_Translation[key]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
