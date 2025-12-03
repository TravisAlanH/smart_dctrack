import React from "react";
import { APIStore } from "../../../../store/Store";
import ToggleSwitch from "../../Interactions/ToggleSwitch";

export default function CutomFieldRequiredToggles() {
  const setCustomFieldRequired = APIStore((s) => s.setCustomFieldRequired);
  const CustomFieldsOnInstance = APIStore((s) => s.data.CustomFieldsOnInstance);
  const pullCustomFields = APIStore((s) => s.pullCustomFields);

  return (
    <div className="m-4 rounded-lg shadow-lg  bg-gray-700 text-white">
      <div className="flex flex-row justify-between px-4">
        <span className="mt-4 font-bold">Custom Field Required</span>
        <button
          className="bg-gray-800 px-2 py-1 rounded mt-4"
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
            <div className="px-4 gap-4 flex flex-row text-white" key={`customfield-required-toggle-${item}_${index}`}>
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
