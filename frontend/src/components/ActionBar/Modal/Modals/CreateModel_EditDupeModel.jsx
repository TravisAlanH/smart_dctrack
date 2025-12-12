import React from "react";
import { APIStore } from "../../../../../store/Store";
import CreateModel_GetMake from "./CreateModel_GetMake";
import { ReuseDataStateStore } from "../../../../../store/Store";
import { getStyles } from "../../../../../Styles";

export default function CreateModel_EditDupeModel({ ui }) {
  const darkMode = ReuseDataStateStore((s) => s.data.DarkMode);
  const style = getStyles();
  const CloneModelData = APIStore((s) => s.data.CreateModel);
  const setCreateModel = APIStore((s) => s.setCreateModel);
  const createModel = APIStore((s) => s.createModel);

  const keysToRemove = [
    "modelId",
    "creationDate",
    "updateDate",
    "createdBy",
    "libraryVersion",
    "warrantyPeriod",
    "weightCapacity",
    "autoPowerBudget",
    "budgetStatus",
    "originalPower",
    "potentialPower",
    "psRedundancy",
    "powerSupplySlotCount",
    "isArchived",
    "dontUpdate",
    "origin",
    "dimWidth",
    "dimDepth",
    "status",
    "frontImage",
    "rearImage",
    "powerPortsCount",
    "airFlow",
    "weight",
  ];

  const OrderOfKeys = [
    "make",
    "model",
    "mounting",
    "class",
    "subclass",
    "formFactor",
    "companyStandard",
    "ruHeight",
    "dimHeight",
    "dimWidth",
    "dimDepth",
    "powerPortsCount",
    "dataPortsCount",
    "frontSlotsCount",
    "backSlotsCount",
    "datasheet",
  ];

  React.useEffect(() => {
    const newPayload = { ...CloneModelData.payload };

    keysToRemove.forEach((k) => {
      delete newPayload[k];
    });

    const ordered = {};

    OrderOfKeys.forEach((k) => {
      if (k in newPayload) {
        ordered[k] = newPayload[k];
        delete newPayload[k];
      }
    });

    Object.keys(newPayload).forEach((k) => {
      ordered[k] = newPayload[k];
    });

    const clearKeys = ["make", "model", "datasheet"];
    clearKeys.forEach((k) => {
      if (k in ordered) {
        ordered[k] = "";
      }
    });

    setCreateModel({
      payload: ordered,
      url: "/v2/models",
      setting: "Payload",
    });
  }, []);

  const numberKeys = [
    "ruHeight",
    "dimHeight",
    "dimWidth",
    "dimDepth",
    "powerPortsCount",
    "dataPortsCount",
    "frontSlotsCount",
    "backSlotsCount",
  ];

  const readOnlyKeys = ["dimHeight", "mounting", "class", "formFactor", "subclass"];

  return (
    <div className="flex flex-col gap-3" style={style.text}>
      <div className="flex flex-row justify-start gap-2 px-2">
        <span className="font-bold">Cloning From:</span>
        <div className="flex flex-row gap-2">
          <div>{CloneModelData.holdMake}</div>
          <div>{CloneModelData.holdModel}</div>
        </div>
      </div>
      {/* <div className="flex flex-row justify-center">
          <span>Model Data to be Created:</span>
        </div> */}
      <form
        className="px-2 pb-2 flex flex-col gap-1 justify-between"
        onSubmit={(e) => {
          e.preventDefault();
          let holdCloneData = { ...CloneModelData };
          numberKeys.forEach((key) => {
            const value = parseInt(holdCloneData.payload[key]);
            holdCloneData.payload[key] = isNaN(value) ? 0 : value;
          });
          Object.keys(holdCloneData.payload).forEach((key) => {
            if (
              holdCloneData.payload[key] === null ||
              holdCloneData.payload[key] === undefined ||
              holdCloneData.payload[key] === ""
            ) {
              delete holdCloneData.payload[key];
            }
          });
          setCreateModel({
            payload: holdCloneData.payload,
            url: "/v2/models",
            setting: "Payload",
          });
          createModel();
        }}
      >
        {Object.entries(CloneModelData.payload).map(([key, value]) => {
          return (
            <div key={key} className="flex flex-row justify-between rounded-md p-1 h-full" style={style.CardBackGround}>
              <div className="flex flex-col justify-center h-[2rem] items-center pl-1">
                <label className="text-white text-sm">
                  {(() => {
                    const txt = key.replace("dim", "");
                    return txt.charAt(0).toUpperCase() + txt.slice(1);
                  })()}
                  :
                </label>
              </div>
              <div className="flex flex-row w-[60%]">
                {key === "companyStandard" ? (
                  <select
                    className={ui.select}
                    value={value}
                    onChange={(e) => {
                      setCreateModel({
                        payload: { ...CloneModelData.payload, [key]: e.target.value },
                        url: "/v2/models",
                        setting: "Payload",
                      });
                    }}
                  >
                    <option value="">-- Select Standard --</option>
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </select>
                ) : numberKeys.includes(key) ? (
                  <input
                    className={ui.input}
                    style={readOnlyKeys.includes(key) ? style.inputDark : style.input}
                    type="tel"
                    value={value}
                    readOnly={readOnlyKeys.includes(key) ? true : false}
                    onChange={(e) => {
                      const text = e.target.value;
                      const data = parseInt(text) || 0;

                      const out = {
                        ...CloneModelData.payload,
                        [key]: data,
                      };
                      if (key === "ruHeight") out.dimHeight = (data * 1.75).toString();

                      setCreateModel({
                        payload: out,
                        url: "/v2/models",
                        setting: "Payload",
                      });
                    }}
                  />
                ) : key === "make" ? (
                  <CreateModel_GetMake ui={ui} />
                ) : (
                  <input
                    className={ui.input}
                    style={readOnlyKeys.includes(key) ? style.inputDark : style.input}
                    type="text"
                    placeholder={key === "datasheet" ? "" : ""}
                    value={value}
                    readOnly={readOnlyKeys.includes(key) ? true : false}
                    onChange={(e) => {
                      setCreateModel({
                        payload: { ...CloneModelData.payload, [key]: e.target.value },
                        url: "/v2/models",
                        setting: "Payload",
                      });
                    }}
                  />
                )}
                {key === "datasheet" ? (
                  <button
                    className={ui.infoButton + " ml-2"}
                    style={style.baseButton}
                    onClick={(e) => {
                      e.preventDefault();
                      const make = CloneModelData.payload.make;
                      const model = CloneModelData.payload.model;
                      const terms = `${make} ${model} filetype:pdf`;
                      const url = `https://www.google.com/search?q=${encodeURIComponent(terms)}`;
                      console.log(url);
                      window.open(url, "_blank");
                    }}
                  >
                    Search
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
        <div className="flex flex-row justify-between w-full mt-3">
          <button
            className={"rounded"}
            style={style.cautionButton}
            type="button"
            onClick={() => {
              setCreateModel({
                payload: {},
                url: "/v2/models",
                setting: "Reset",
              });
            }}
          >
            Reset
          </button>
          <button className={ui.mainButton} type="submit" style={style.baseButton}>
            Create
          </button>

          {/* setCreateModel({
      payload: ordered,
      url: "/v2/models",
      setting: "Payload",
    }); */}
        </div>
      </form>
    </div>
  );
}
