import React from "react";
import { APIStore } from "../../../../../store/Store";
import CutomFieldInput_All from "./CutomFieldInput_All";

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

export default function CustomFieldInput_BASE({ showRequired, style }) {
  const CustomFieldsOnInstance = APIStore((s) => s.data.CustomFieldsOnInstance);

  const selectedClass = CustomFieldsOnInstance.SelectedClass || "";
  const selectedSubclass = CustomFieldsOnInstance.SelectedSubclass || "";

  const splitClass = selectedClass
    .split("/")
    .map((x) => x.trim())
    .filter((x) => x !== "");
  const splitSubclass = selectedSubclass
    .split("/")
    .map((x) => x.trim())
    .filter((x) => x !== "");

  function matchAny(list, values) {
    return values.some((v) => Object.values(list).includes(v));
  }

  const keys = Object.keys(CustomFieldsOnInstance).filter((key) => {
    if (key === "SelectedClass") return false;
    if (key === "SelectedSubclass") return false;

    const item = CustomFieldsOnInstance[key];
    if (!item) return false;

    const matchClass = matchAny(item.cmbClass, splitClass);
    const matchSubclass = matchAny(item.cmbSubclass, splitSubclass);

    return matchClass || matchSubclass;
  });

  return (
    <div>
      <div className="w-full flex flex-col gap-2">
        {keys.map((key, index) => {
          const data = CustomFieldsOnInstance[key];
          if (showRequired && !data.Required) return null;
          return (
            <div key={`customfield-${key}_${index}`}>
              <CutomFieldInput_All ui={auditUI} data={data} label={key} index={index} style={style} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
