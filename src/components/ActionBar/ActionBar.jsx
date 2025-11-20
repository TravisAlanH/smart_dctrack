import React from "react";
import APIPushActionBar from "./APIPushActionBar";

export default function ActionBar({ setShow }) {
  const button = "bg-blue-600 text-white rounded text-lg px-3 py-.5";

  const ActionBarTemplate = [<APIPushActionBar style={button} setShow={setShow} />];

  return <div className="border bg-slate-800">{ActionBarTemplate[0]}</div>;
}
