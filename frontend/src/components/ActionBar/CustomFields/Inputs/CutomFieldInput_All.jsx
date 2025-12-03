import React from "react";
import { APIStore, ReuseDataStateStore } from "../../../../../store/Store";

export default function CutomFieldInput_All({ ui, data, label }) {
  const setMessage = APIStore((s) => s.setResponseMessage);
  const setAPIPayloadHolder = APIStore((s) => s.setAPIPayloadHolder);
  const APIPayloadHolder = APIStore((s) => s.data.APIPayloadHolder);
  const InputType = data.inputType;
  const objectType = ReuseDataStateStore((s) => s.data.objectType);

  const shared = {
    setMessage,
    ui,
    data,
    label,
    setAPIPayloadHolder,
    APIPayloadHolder,
    objectType,
  };

  const type = {
    Text: <TextInput {...shared} />,
    Numeric: <NumberInput {...shared} />,
    "Single Select List": <SelectInput {...shared} />,
    "Multi Select List": <MultiSelectInput {...shared} />,
    Date: <DateInput {...shared} />,
    Checkbox: <CheckboxInput {...shared} />,
  };

  return <div>{type[InputType]}</div>;
}

const CustomFieldLable = "tiCustomField_";

function TextInput({ setMessage, ui, data, label, APIPayloadHolder, setAPIPayloadHolder, objectType }) {
  const req = data.Required;
  return (
    <div className={ui.cardOuter}>
      <div className={ui.cardHeader}>
        <label className={req ? ui.labelRequired : ui.label}>{CustomFieldLable + label}</label>
      </div>

      <div className={ui.cardBody}>
        <input
          name={label}
          required={req}
          placeholder={label}
          type="text"
          className={ui.input}
          value={APIPayloadHolder[CustomFieldLable + label] ?? ""}
          onChange={(e) => {
            setAPIPayloadHolder({ type: objectType, field: CustomFieldLable + label, value: e.target.value });
          }}
        />

        <button
          type="button"
          className={ui.infoButton}
          onClick={() => {
            const text = "Custom field Created on dcTrack instance.";
            setMessage({ type: "Custom_Field_info_header", text, label: label });
          }}
        >
          ?
        </button>
      </div>
    </div>
  );
}

function CheckboxInput({ setMessage, ui, data, label, APIPayloadHolder, setAPIPayloadHolder, objectType }) {
  const req = data.Required;
  const cardBody = "w-full flex flex-row items-center justify-between gap-2 px-3 pb-2";

  React.useEffect(() => {
    if (APIPayloadHolder[CustomFieldLable + label] === undefined) {
      setAPIPayloadHolder({
        type: objectType,
        field: CustomFieldLable + label,
        value: "false",
      });
    }
  }, []);

  return (
    <div className={ui.cardOuter}>
      <div className={ui.cardHeader}>
        <label className={req ? ui.labelRequired : ui.label}>{CustomFieldLable + label}</label>
      </div>

      <div className={cardBody}>
        <input
          name={label}
          type="checkbox"
          className="w-5 h-5"
          checked={APIPayloadHolder[CustomFieldLable + label] === "true"}
          onChange={(e) => {
            const val = e.target.checked ? "true" : "false";

            setAPIPayloadHolder({
              type: objectType,
              field: CustomFieldLable + label,
              value: val,
            });
          }}
        />

        <button
          type="button"
          className={ui.infoButton}
          onClick={() => {
            const text = "Custom field created on dcTrack instance.";
            setMessage({
              type: "Custom_Field_info_header",
              text,
              label: label,
            });
          }}
        >
          ?
        </button>
      </div>
    </div>
  );
}

function DateInput({ setMessage, ui, data, label, APIPayloadHolder, setAPIPayloadHolder, objectType }) {
  const req = data.Required;
  return (
    <div className={ui.cardOuter}>
      <div className={ui.cardHeader}>
        <label className={req ? ui.labelRequired : ui.label}>{CustomFieldLable + label}</label>
      </div>

      <div className={ui.cardBody}>
        <input
          name={label}
          required={req}
          type="date"
          className={ui.input}
          value={APIPayloadHolder[CustomFieldLable + label] ?? ""}
          onChange={(e) => {
            setAPIPayloadHolder({ type: objectType, field: CustomFieldLable + label, value: e.target.value });
          }}
        />

        <button
          type="button"
          className={ui.infoButton}
          onClick={() => {
            const text = "Custom field created on dcTrack instance.";
            setMessage({
              type: "Custom_Field_info_header",
              text,
              label: label,
            });
          }}
        >
          ?
        </button>
      </div>
    </div>
  );
}

function NumberInput({ setMessage, ui, data, label, APIPayloadHolder, setAPIPayloadHolder, objectType }) {
  const req = data.Required;
  return (
    <div className={ui.cardOuter}>
      <div className={ui.cardHeader}>
        <label className={req ? ui.labelRequired : ui.label}>{CustomFieldLable + label}</label>
      </div>

      <div className={ui.cardBody}>
        <input
          name={label}
          required={req}
          placeholder={label}
          type="tel"
          className={ui.input}
          value={APIPayloadHolder[CustomFieldLable + label] ?? ""}
          onChange={(e) => {
            setAPIPayloadHolder({ type: objectType, field: CustomFieldLable + label, value: e.target.value });
          }}
        />

        <button
          type="button"
          className={ui.infoButton}
          onClick={() => {
            const text = "Custom field Created on dcTrack instance.";
            setMessage({ type: "Custom_Field_info_header", text, label: label });
          }}
        >
          ?
        </button>
      </div>
    </div>
  );
}

function SelectInput({ setMessage, ui, data, label, APIPayloadHolder, setAPIPayloadHolder, objectType }) {
  const req = data.Required;
  const options = data.listValues;
  const field = CustomFieldLable + label;

  const current = APIPayloadHolder[field] || [];

  return (
    <div className={ui.cardOuter}>
      <div className={ui.cardHeader}>
        <label className={req ? ui.labelRequired : ui.label}>{field}</label>
      </div>

      <div className={ui.cardBody}>
        <select
          className={ui.select}
          required={req}
          value={current[0] || ""}
          onChange={(e) => {
            const out = [e.target.value];

            setAPIPayloadHolder({
              type: objectType,
              field,
              value: out,
            });
          }}
        >
          <option value="">Select {label}</option>

          {options.map((opt) => (
            <option key={opt.id} value={opt.value}>
              {opt.value}
            </option>
          ))}
        </select>

        <button
          type="button"
          className={ui.infoButton}
          onClick={() => {
            const text = "Custom field Created on dcTrack instance.";
            setMessage({
              type: "Custom_Field_info_header",
              text,
              label,
            });
          }}
        >
          ?
        </button>
      </div>
    </div>
  );
}

function MultiSelectInput({ setMessage, ui, data, label, APIPayloadHolder, setAPIPayloadHolder, objectType }) {
  const req = data.Required;
  const options = data.listValues;
  const field = CustomFieldLable + label;

  const current = APIPayloadHolder[field] || [];

  return (
    <div className={ui.cardOuter}>
      <div className={ui.cardHeader}>
        <label className={req ? ui.labelRequired : ui.label}>{field}</label>
      </div>

      <div className={ui.cardBody}>
        <select
          className={ui.select}
          required={req}
          multiple
          value={current}
          onChange={(e) => {
            const values = Array.from(e.target.selectedOptions).map((o) => o.value);

            setAPIPayloadHolder({
              type: objectType,
              field,
              value: values,
            });
          }}
        >
          {options.map((opt) => (
            <option key={opt.id} value={opt.value}>
              {opt.value}
            </option>
          ))}
        </select>

        <button
          type="button"
          className={ui.infoButton}
          onClick={() => {
            const text = "Custom field created on dcTrack instance.";
            setMessage({
              type: "Custom_Field_info_header",
              text,
              label,
            });
          }}
        >
          ?
        </button>
      </div>
    </div>
  );
}
