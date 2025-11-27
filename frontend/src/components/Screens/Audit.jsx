import { useState, useEffect } from "react";
import { APIStore, ReuseDataStateStore } from "../../../store/Store";
import CameraModal from "../Camera/CameraModal/CameraModal";
// import { header, headerTypes, headerDescriptions } from "../Helpers/HeadersAsObjects";
import { dcTrack_DISCRIPTIONS } from "../Helpers/dcTrackAPIDiscriptions";
import { dcTrack_APIREQUIRED } from "../Helpers/dcTrackAPIRequired";
import { dcTrack_EDITABLE } from "../Helpers/dcTrackAPIEditable";
import { dcTrack_READABLE } from "../Helpers/dcTrackAPIReadable";
import { dcTrack_ENDPOINTS } from "../Helpers/dcTrackAPIReturns";
import { dcTrack_INPUTTYPES } from "../Helpers/dcTrackAPIInputTypes";
import { dcTrack_URL } from "../Helpers/dcTrackAPIEndpointURL";
// import { apiUrls } from "../Helpers/Endpoints";
// import { headerEndpoints } from "../Helpers/Endpoints";
import { loadRequiredMaster } from "../Helpers/RequiredMaster";
import AuditMakeInput from "../Interactions/AuditMakeInput";
import AuditModelInput from "../Interactions/AuditModelInput";
import AuditLocationInput from "../Interactions/AuditLocationInput";
import AuditCabinetInput from "../Interactions/AuditCabinetInput";
import AuditUPositionInput from "../Interactions/AuditUPositionInput";
import AuditCabinetSideInput from "../Interactions/AuditCabinetSideInput";
import AuditDepthPositionInput from "../Interactions/AuditDepthPositionInput";

//#region MAIN_COMPONENT
function Audit() {
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
  const setShowRequired = ReuseDataStateStore((s) => s.setShowRequiredAudit);

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

    const formData = new FormData(e.target);
    const out = {};

    for (const [key, val] of formData.entries()) out[key] = val;

    setPayload(APIPayloadHolder);
    if (APIAction === "ADD") {
      sendAPIPush();
    } else if (APIAction === "EDIT") {
      EditAPIPush(SelectedInCabinetAsset.id);
    }
  }

  const ButtonStyle = "bg-blue-600 text-white rounded text-lg px-3 py-1";

  //#region RETURN
  return (
    <div className="App w-screen h-screen flex flex-col">
      <div className="flex flex-row gap-3 justify-end">HEADER</div>
      <div className="z-20">
        <CameraModal />
      </div>

      <div className="w-full h-[95%] flex flex-col gap-3 mt-4">
        <div className="w-full flex flex-col gap-3 mt-4">
          <OperationInput APIAction={APIAction} />
          <ObjectInput
            setObjectFields={setObjectFields}
            setObjectType={setObjectType}
            setURL={setAuditURL}
            setAPIPayloadHolder={setAPIPayloadHolder}
            resetAPUIPayloadHolder={resetAPUIPayloadHolder}
            setAPIAction={setAPIAction}
            objectType={objectType}
          />
        </div>
        {objectFields !== "" ? (
          //#region AUIT_FORM
          <form className="w-full h-[95%] flex flex-col gap-3" onSubmit={handleFormSubmit}>
            {Object.keys(objectFields ?? {}).map((label, index) => {
              console.log(label, trueRequredMaster[objectType][label]);
              if (showRequired && !trueRequredMaster[objectType][label]) return null;
              const type = dcTrack_INPUTTYPES[objectType][label];

              const props = {
                label,
                objectType,
                setMessage,
                APIPayloadHolder,
                setAPIPayloadHolder,
                trueRequredMaster,
                objectType,
              };

              switch (type) {
                // case "Operation":
                //   return <OperationInput APIAction={APIAction} />;
                // case "Object":
                //   return (
                //     <ObjectInput
                //       key={index}
                //       {...props}
                //       setObjectFields={setObjectFields}
                //       setObjectType={setObjectType}
                //       setURL={setAuditURL}
                //       resetAPUIPayloadHolder={resetAPUIPayloadHolder}
                //       setAPIAction={setAPIAction}
                //     />
                //   );
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
                  return <AuditMakeInput key={index} {...props} />;
                case "IMGModel":
                  return <AuditModelInput key={index} {...props} />;
                case "LOCATION":
                  return <AuditLocationInput />;
                case "CABINET":
                  return <AuditCabinetInput />;
                case "UPosition":
                  return <AuditUPositionInput objectType={objectType} />;
                case "CABINETSIDE":
                  return <AuditCabinetSideInput />;
                case "DEPTHPOSITION":
                  return <AuditDepthPositionInput />;
                default:
                  return <TextInput key={index} {...props} />;
              }
            })}
          </form>
        ) : null}
      </div>
    </div>
  );
}
//#endregion MAIN_COMPONENT

//#region STYLE_CONSTANTS
const boxStyle = "flex flex-col items-start bg-slate-400 mx-3 rounded-md py-1";
const innerBoxStyle = "w-full flex flex-row gap-2 px-2";
const labelStyle = "px-2 text-sm";
const requiredLableStyle = "px-2 text-sm text-red-600 font-bold";
const inputStyle = "border border-gray-400 rounded px-2 py-1 text-lg w-full";
const buttonStyle = "bg-blue-600 text-white w-[20%] rounded text-lg";
const selectStyle = "border border-gray-400 rounded px-2 py-1 text-lg w-full";
const descriptionButtonStyle = "bg-green-600 text-white rounded px-2 py-1 text-sm";
//#endregion STYLE_CONSTANTS

//#region TEXT_INPUT
function TextInput({ label, objectType, setMessage, setAPIPayloadHolder, APIPayloadHolder, trueRequredMaster }) {
  return (
    <div className={boxStyle}>
      <label className={trueRequredMaster[objectType][label] ? requiredLableStyle : labelStyle}>
        {dcTrack_READABLE[objectType][label]}
      </label>
      <div className={innerBoxStyle}>
        <input
          name={label}
          required={trueRequredMaster[objectType][label]}
          readOnly={!dcTrack_EDITABLE[objectType][label]}
          onChange={(e) => {
            setAPIPayloadHolder({ type: objectType, field: label, value: e.target.value });
          }}
          type="text"
          placeholder={label}
          className={inputStyle}
          value={APIPayloadHolder[label] || ""}
        />
        <button
          type="button"
          className={descriptionButtonStyle}
          onClick={() => {
            const text = dcTrack_DISCRIPTIONS[objectType]?.[label] || "No data available";
            setMessage({ type: "info_header", text, label: label });
          }}
        >
          ?
        </button>
      </div>
    </div>
  );
}
//#endregion TEXT_INPUT

//#region NUMBER_INPUT
function NumberInput({ label, objectType, setMessage, setAPIPayloadHolder, APIPayloadHolder, trueRequredMaster }) {
  return (
    <div className={boxStyle}>
      <label className={trueRequredMaster[objectType][label] ? requiredLableStyle : labelStyle}>
        {dcTrack_READABLE[objectType][label]}
      </label>
      <div className={innerBoxStyle}>
        <input
          name={label}
          type="number"
          placeholder={label}
          className={inputStyle}
          required={trueRequredMaster[objectType][label]}
          readOnly={!dcTrack_EDITABLE[objectType][label]}
          value={APIPayloadHolder[dcTrack_ENDPOINTS[objectType][label]]}
          onChange={(e) => {
            setAPIPayloadHolder({ type: objectType, field: label, value: e.target.value });
          }}
        />
        <button
          type="button"
          className={descriptionButtonStyle}
          onClick={() => {
            const text = dcTrack_DISCRIPTIONS[objectType]?.[label] || "No data available";
            setMessage({ type: "info_header", text, label: label });
          }}
        >
          ?
        </button>
      </div>
    </div>
  );
}
//#endregion NUMBER_INPUT

//#region ORC_INPUT
function OcrInput({
  label,
  objectType,
  setMessage,
  setAPIPayloadHolder,
  APIPayloadHolder,
  setCameraStatus,
  setCameraRequiredToProcess,
  trueRequredMaster,
}) {
  return (
    <div className={boxStyle}>
      <label className={trueRequredMaster[objectType][label] ? requiredLableStyle : labelStyle}>
        {dcTrack_READABLE[objectType][label]}
      </label>
      <div className={innerBoxStyle}>
        <input
          name={label}
          type="text"
          placeholder={label}
          className={inputStyle}
          required={trueRequredMaster[objectType][label]}
          readOnly={!dcTrack_EDITABLE[objectType][label]}
          onChange={(e) => {
            setAPIPayloadHolder({ type: objectType, field: label, value: e.target.value });
          }}
          value={APIPayloadHolder[label] || ""}
        />
        <button
          type="button"
          className={buttonStyle}
          onClick={() => {
            setCameraRequiredToProcess(objectType, label);
            setCameraStatus(0);
            document.getElementById("CameraModal").style.display = "block";
          }}
        >
          ORC
        </button>
        <button
          type="button"
          className={descriptionButtonStyle}
          onClick={() => {
            const text = dcTrack_DISCRIPTIONS[objectType]?.[label] || "No data available";
            setMessage({ type: "info_header", text, label: label });
          }}
        >
          ?
        </button>
      </div>
    </div>
  );
}
//#endregion ORC_INPUT

//#region IMG_INPUT
function ImgInput({
  label,
  objectType,
  setMessage,
  setAPIPayloadHolder,
  APIPayloadHolder,
  setCameraStatus,
  setCameraRequiredToProcess,
  trueRequredMaster,
}) {
  return (
    <div className={boxStyle}>
      <label className={trueRequredMaster[objectType][label] ? requiredLableStyle : labelStyle}>
        {dcTrack_READABLE[objectType][label]}
      </label>
      <div className={innerBoxStyle}>
        <input
          name={label}
          type="text"
          placeholder={label}
          className={inputStyle}
          required={trueRequredMaster[objectType][label]}
          readOnly={!dcTrack_EDITABLE[objectType][label]}
          onChange={(e) => {
            setAPIPayloadHolder({ type: objectType, field: label, value: e.target.value });
          }}
          value={APIPayloadHolder[label] || ""}
        />
        <button
          type="button"
          className={buttonStyle}
          onClick={() => {
            setCameraRequiredToProcess(objectType, label);
            setCameraStatus(1);
            document.getElementById("CameraModal").style.display = "block";
          }}
        >
          Scan
        </button>
        <button
          type="button"
          className={descriptionButtonStyle}
          onClick={() => {
            const text = dcTrack_DISCRIPTIONS[objectType]?.[label] || "No data available";
            setMessage({ type: "info_header", text, label: label });
          }}
        >
          ?
        </button>
      </div>
    </div>
  );
}
//#endregion IMG_INPUT

//#region QR_INPUT
function QrInput({
  label,
  objectType,
  setMessage,
  setAPIPayloadHolder,
  APIPayloadHolder,
  setCameraStatus,
  setCameraRequiredToProcess,
  trueRequredMaster,
}) {
  return (
    <div className={boxStyle}>
      <label className={trueRequredMaster[objectType][label] ? requiredLableStyle : labelStyle}>
        {dcTrack_READABLE[objectType][label]}
      </label>
      <div className={innerBoxStyle}>
        <input
          name={label}
          type="text"
          placeholder={label}
          className={inputStyle}
          required={trueRequredMaster[objectType][label]}
          readOnly={!dcTrack_EDITABLE[objectType][label]}
          onChange={(e) => {
            setAPIPayloadHolder({ type: objectType, field: label, value: e.target.value });
          }}
          value={APIPayloadHolder[label] || ""}
        />
        <button
          type="button"
          className={buttonStyle}
          onClick={() => {
            setCameraRequiredToProcess(objectType, label);
            setCameraStatus(2);
            document.getElementById("CameraModal").style.display = "block";
          }}
        >
          Scan
        </button>
        <button
          type="button"
          className={descriptionButtonStyle}
          onClick={() => {
            const text = dcTrack_DISCRIPTIONS[objectType]?.[label] || "No data available";
            setMessage({ type: "info_header", text, label: label });
          }}
        >
          ?
        </button>
      </div>
    </div>
  );
}
//#endregion QR_INPUT

//#region OPERATION_INPUT
function OperationInput({ APIAction }) {
  return (
    <div className={boxStyle}>
      <label className={labelStyle}>Operation</label>
      <div className={innerBoxStyle}>
        <input type="text" className={inputStyle} value={APIAction} readOnly />
      </div>
    </div>
  );
}
//#endregion OPERATION_INPUT

//#region OBJECT_INPUT
function ObjectInput({
  objectType,
  setObjectFields,
  setObjectType,
  setURL,
  setAPIPayloadHolder,
  resetAPUIPayloadHolder,
  setAPIAction,
}) {
  return (
    <div className={boxStyle}>
      <label className={labelStyle}>Object</label>
      <div className={innerBoxStyle}>
        <select
          value={objectType}
          className={selectStyle}
          onChange={(e) => {
            const type = e.target.value;
            if (type === "") return;
            setAPIAction("ADD");
            setObjectFields(dcTrack_ENDPOINTS[type]);
            setObjectType(type);
            setURL(dcTrack_URL[type]);
            resetAPUIPayloadHolder();
            setAPIPayloadHolder({
              type: type,
              field: "Object ",
              value: type,
            });
          }}
        >
          <option value="">Select</option>
          {Object.keys(dcTrack_ENDPOINTS).map((key) => {
            return (
              <option key={key} value={key}>
                {key}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
}
//#endregion OBJECT_INPUT

export default Audit;
