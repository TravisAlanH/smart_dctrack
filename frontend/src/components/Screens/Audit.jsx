import { useState } from "react";
import { APIStore, ReuseDataStateStore } from "../../../store/Store";
import CameraModal from "../Camera/CameraModal/CameraModal";
import { header, headerTypes, headerDescriptions } from "../Helpers/HeadersAsObjects";
import { apiUrls } from "../Helpers/Endpoints";
import { headerEndpoints } from "../Helpers/Endpoints";

function Audit({ setShow }) {
  const APIPayloadHolder = APIStore((s) => s.data.APIPayloadHolder);
  const setAPIPayloadHolder = APIStore((s) => s.setAPIPayloadHolder);
  const setMessage = APIStore((s) => s.setResponseMessage);
  const setAuditURL = APIStore((s) => s.setAuditUrl);
  const setPayload = APIStore((s) => s.setAuditPayload);
  const sendAPIPush = APIStore((s) => s.sendAPIPush);

  const [objectFields, setObjectFields] = useState("");
  const [objectType, setObjectType] = useState("");

  const setCameraStatus = ReuseDataStateStore((s) => s.setCameraStatus);
  const setCameraRequiredToProcess = ReuseDataStateStore((s) => s.setCameraRequiredToProcess);

  function handleFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const out = {};

    for (const [key, val] of formData.entries()) out[key] = val;

    setPayload(APIPayloadHolder);
    sendAPIPush();
  }

  return (
    <div className="App w-screen h-screen flex flex-col">
      <CameraModal />
      {/* 
      <div className="w-full h-[5%] flex flex-row justify-center items-center text-2xl font-bold gap-3">
        <button
          className="bg-slate-200 rounded-md px-3"
          onClick={() => (document.getElementById("CameraModal").style.display = "block")}
        >
          ORC
        </button>
        <button
          className="bg-slate-200 rounded-md px-3"
          onClick={() => (document.getElementById("CameraModal").style.display = "block")}
        >
          IMG
        </button>
        <button
          className="bg-slate-200 rounded-md px-3"
          onClick={() => (document.getElementById("CameraModal").style.display = "block")}
        >
          Asset
        </button>
      </div> */}

      {/* <APIPushActionBar setShow={setShow} /> */}

      <div className="w-full h-[95%] flex flex-col gap-3 mt-4">
        {objectFields === "" ? (
          <div className="w-full h-[95%] flex flex-col gap-3 mt-4">
            <OperationInput />
            <ObjectInput
              setObjectFields={setObjectFields}
              setObjectType={setObjectType}
              setURL={setAuditURL}
              setAPIPayloadHolder={setAPIPayloadHolder}
            />
          </div>
        ) : (
          <form className="w-full h-[95%] flex flex-col gap-3 mt-4" onSubmit={handleFormSubmit}>
            {Object.keys(objectFields).map((label, index) => {
              const type = headerTypes[objectType][label];

              const props = {
                label,
                objectType,
                setShow,
                setMessage,
                APIPayloadHolder,
                setAPIPayloadHolder,
              };

              switch (type) {
                case "Operation":
                  return <OperationInput key={index} {...props} />;

                case "Object":
                  return (
                    <ObjectInput
                      key={index}
                      {...props}
                      setObjectFields={setObjectFields}
                      setObjectType={setObjectType}
                      setURL={setAuditURL}
                    />
                  );

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

                default:
                  return <TextInput key={index} {...props} />;
              }
            })}
          </form>
        )}
      </div>
    </div>
  );
}

const boxStyle = "flex flex-col items-start bg-slate-400 mx-3 rounded-md py-1";
const innerBoxStyle = "w-full flex flex-row gap-2 px-2";
const labelStyle = "px-2 text-sm";
const inputStyle = "border border-gray-400 rounded px-2 py-1 text-lg w-full";
const buttonStyle = "bg-blue-600 text-white w-[20%] rounded text-lg";
const selectStyle = "border border-gray-400 rounded px-2 py-1 text-lg w-full";
const descriptionButtonStyle = "bg-green-600 text-white rounded px-2 py-1 text-sm";

function TextInput({ label, objectType, setShow, setMessage, setAPIPayloadHolder, APIPayloadHolder }) {
  return (
    <div className={boxStyle}>
      <label className={labelStyle}>{label}</label>
      <div className={innerBoxStyle}>
        <input
          name={label}
          required={label.includes("*")}
          onChange={(e) => {
            setAPIPayloadHolder({ type: objectType, field: label, value: e.target.value });
          }}
          type="text"
          placeholder={label}
          className={inputStyle}
          value={APIPayloadHolder[headerEndpoints[objectType][label]]}
        />
        <button
          type="button"
          className={descriptionButtonStyle}
          onClick={() => {
            const text = headerDescriptions[objectType]?.[label] || "No data available";
            setMessage({ type: "info", text, label });
            setShow(1);
          }}
        >
          ?
        </button>
      </div>
    </div>
  );
}

function NumberInput({ label, objectType, setShow, setMessage, setAPIPayloadHolder, APIPayloadHolder }) {
  return (
    <div className={boxStyle}>
      <label className={labelStyle}>{label}</label>
      <div className={innerBoxStyle}>
        <input
          name={label}
          type="number"
          placeholder={label}
          className={inputStyle}
          value={APIPayloadHolder[headerEndpoints[objectType][label]]}
          onChange={(e) => {
            setAPIPayloadHolder({ type: objectType, field: label, value: e.target.value });
          }}
        />
        <button
          type="button"
          className={descriptionButtonStyle}
          onClick={() => {
            const text = headerDescriptions[objectType]?.[label] || "No data available";
            setMessage({ type: "info", text, label });
            setShow(1);
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
  setShow,
  setMessage,
  setAPIPayloadHolder,
  APIPayloadHolder,
  setCameraStatus,
  setCameraRequiredToProcess,
}) {
  return (
    <div className={boxStyle}>
      <label className={labelStyle}>{label}</label>
      <div className={innerBoxStyle}>
        <input
          name={label}
          type="text"
          placeholder={label}
          className={inputStyle}
          onChange={(e) => {
            setAPIPayloadHolder({ type: objectType, field: label, value: e.target.value });
          }}
          value={APIPayloadHolder[headerEndpoints[objectType][label]] || ""}
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
            const text = headerDescriptions[objectType]?.[label] || "No data available";
            setMessage({ type: "info", text, label });
            setShow(1);
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
  setShow,
  setMessage,
  setAPIPayloadHolder,
  APIPayloadHolder,
  setCameraStatus,
  setCameraRequiredToProcess,
}) {
  return (
    <div className={boxStyle}>
      <label className={labelStyle}>{label}</label>
      <div className={innerBoxStyle}>
        <input
          name={label}
          type="text"
          placeholder={label}
          className={inputStyle}
          onChange={(e) => {
            setAPIPayloadHolder({ type: objectType, field: label, value: e.target.value });
          }}
          value={APIPayloadHolder[headerEndpoints[objectType][label]] || ""}
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
            const text = headerDescriptions[objectType]?.[label] || "No data available";
            setMessage({ type: "info", text, label });
            setShow(1);
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
  setShow,
  setMessage,
  setAPIPayloadHolder,
  APIPayloadHolder,
  setCameraStatus,
  setCameraRequiredToProcess,
}) {
  return (
    <div className={boxStyle}>
      <label className={labelStyle}>{label}</label>
      <div className={innerBoxStyle}>
        <input
          name={label}
          type="text"
          placeholder={label}
          className={inputStyle}
          onChange={(e) => {
            setAPIPayloadHolder({ type: objectType, field: label, value: e.target.value });
          }}
          value={APIPayloadHolder[headerEndpoints[objectType][label]] || ""}
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
            const text = headerDescriptions[objectType]?.[label] || "No data available";
            setMessage({ type: "info", text, label });
            setShow(1);
          }}
        >
          ?
        </button>
      </div>
    </div>
  );
}

function OperationInput() {
  return (
    <div className={boxStyle}>
      <label className={labelStyle}>Operation</label>
      <div className={innerBoxStyle}>
        <select name="Operation" className={selectStyle}>
          <option value="Add">Add</option>
          <option value="Edit">Edit</option>
          <option value="Delete">Delete</option>
        </select>
      </div>
    </div>
  );
}

function ObjectInput({ setObjectFields, setObjectType, setURL, setAPIPayloadHolder }) {
  return (
    <div className={boxStyle}>
      <label className={labelStyle}>Object</label>
      <div className={innerBoxStyle}>
        <select
          className={selectStyle}
          onChange={(e) => {
            const type = e.target.value;
            if (type === "") return;

            setObjectFields(header[type]);
            setObjectType(type);
            setURL(apiUrls[type]);

            // add objectType into APIPayloadHolder for API calls
            setAPIPayloadHolder({
              type: type,
              field: "Object ",
              value: type,
            });
          }}
        >
          <option value="">Select</option>
          {Object.keys(header).map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default Audit;
