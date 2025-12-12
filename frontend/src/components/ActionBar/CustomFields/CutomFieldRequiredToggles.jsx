import React from "react";
import { APIStore, ReuseDataStateStore } from "../../../../store/Store";
import ToggleSwitch from "../../Interactions/ToggleSwitch";
import { getStyles } from "../../../../Styles";

export default function CutomFieldRequiredToggles() {
  const darkMode = ReuseDataStateStore((s) => s.data.DarkMode);
  const ui = getStyles();
  const setCustomFieldRequired = APIStore((s) => s.setCustomFieldRequired);
  const CustomFieldsOnInstance = APIStore((s) => s.data.CustomFieldsOnInstance);
  const pullCustomFields = APIStore((s) => s.pullCustomFields);

  return (
    <div className="m-4 rounded-lg shadow-lg  flex flex-col" style={{ ...ui.CardBackGround, ...ui.text }}>
      <div className="flex flex-row justify-between px-4">
        <span className="mt-4 font-bold">Custom Field Required</span>
        <button
          className=" px-2 py-1 rounded mt-4"
          style={ui.baseButton}
          onClick={() => {
            pullCustomFields();
          }}
        >
          Refresh List
        </button>
      </div>
      <div className="flex flex-col gap-4 py-4">
        {Object.keys(CustomFieldsOnInstance).map((item, index) => {
          const data = CustomFieldsOnInstance[item];
          if (item === "SelectedClass") return null;
          if (item === "SelectedSubclass") return null;
          console.log(CustomFieldsOnInstance[item].Required);
          return (
            <div className="px-4 gap-4 flex flex-row " key={`customfield-required-toggle-${item}_${index}`} style={ui.text}>
              <div className="flex flex-row w-full gap-2 items-center">
                <label className="">{`${item}`}</label>
              </div>
              <div className="flex flex-row w-full gap-2 items-center text-xs">
                <label className="">{`${CustomFieldsOnInstance[item].inputType}`}</label>
              </div>
              <ToggleSwitch
                checked={CustomFieldsOnInstance[item].Required}
                onChange={() => setCustomFieldRequired(item)}
                label=""
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
