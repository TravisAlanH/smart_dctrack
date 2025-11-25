import React from "react";
import APIPushActionBar from "./APIPushActionBar";
import CabinetActionBar from "./CabinetActionBar";
import { ReuseDataStateStore } from "../../../store/Store";

export default function ActionBar({}) {
  const button = "bg-blue-600 text-white rounded text-lg px-3 py-.5";
  const pageView = ReuseDataStateStore((s) => s.data.pageView);

  const ActionBarTemplate = [<APIPushActionBar style={button} />, <CabinetActionBar style={button} />];

  console.log(pageView);

  return <div className="bg-transparent">{ActionBarTemplate[pageView]}</div>;
}
