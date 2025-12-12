import React from "react";
import APIPushActionBar from "./APIPushActionBar";
import CabinetActionBar from "./CabinetActionBar";
import { ReuseDataStateStore } from "../../../store/Store";
import { getStyles } from "../../../Styles";

export default function ActionBar({}) {
  const darkMode = ReuseDataStateStore((s) => s.data.DarkMode);
  const style = getStyles();
  const pageView = ReuseDataStateStore((s) => s.data.pageView);

  const ActionBarTemplate = [
    <BlankActionBar />,
    <CabinetActionBar style={style} />,
    <BlankActionBar />,
    <APIPushActionBar style={style} />,
  ];

  return <div className="bg-transparent">{ActionBarTemplate[pageView]}</div>;
}

function BlankActionBar() {
  return null;
}
