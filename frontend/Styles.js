import { ReuseDataStateStore } from "./store/Store";

const Light = {
  // BACKGROUND COLORS
  mainBackground: { backgroundColor: "#f0f0f0" },
  CardBackGround: { backgroundColor: "green", borderColor: "yellow" },
  CardSectionBackGround: { backgroundColor: "#3366ff", borderColor: "pink" },
  CardEmptyBackGround: { backgroundColor: "yellow", borderColor: "purple" },
  CardInnerBackGround: { backgroundColor: "#ffffff", borderColor: "green" },
  CardTextBackGround: { backgroundColor: "#e0e0e0", borderColor: "orange" },
  BladeBackground: { backgroundColor: "pink", borderColor: "red" },
  BladeFilledBackground: { backgroundColor: "orange", borderColor: "red" },
  IconBackground: { backgroundColor: "#e5e5e5", borderColor: "blue" },

  // BUTTON COLORS
  baseButton: { backgroundColor: "#e5e5e5", color: "black" },
  activeButton: { backgroundColor: "#b3c6ff", color: "white" },
  disabledButton: { backgroundColor: "#a1a1a1", color: "white" },
  cautionButton: { backgroundColor: "#facc15", color: "black" },
  closeButton: { backgroundColor: "#ef4444", color: "white" },
  infoButton: { backgroundColor: "#38bdf8", color: "black" },
  toggleOn: { backgroundColor: "pink" },
  toggleOff: { backgroundColor: "purple" },

  // TEXT COLORS
  text: { color: "black" },
  pageHeaderText: { color: "black" },
};

const Dark = {
  // BACKGROUND COLORS
  mainBackground: { backgroundColor: "#121212" },
  CardBackGround: { backgroundColor: "#1a1a1a", borderColor: "yellow" },
  CardSectionBackGround: { backgroundColor: "#1a1a1a", borderColor: "pink" },
  CardEmptyBackGround: { backgroundColor: "#00000000", borderColor: "purple" },
  CardInnerBackGround: { backgroundColor: "#2a2a2a", borderColor: "green" },
  CardTextBackGround: { backgroundColor: "#333333", borderColor: "orange" },
  BladeBackground: { backgroundColor: "#2a2a2a", borderColor: "red" },
  BladeFilledBackground: { backgroundColor: "#3a3a3a", borderColor: "red" },
  IconBackground: { backgroundColor: "#2a2a2a", borderColor: "blue" },

  // BUTTON COLORS
  baseButton: { backgroundColor: "#3a3a3a", color: "white" },
  activeButton: { backgroundColor: "#1e40af", color: "white" },
  disabledButton: { backgroundColor: "#5a5a5a", color: "white" },
  cautionButton: { backgroundColor: "#eab308", color: "black" },
  closeButton: { backgroundColor: "#dc2626", color: "white" },
  infoButton: { backgroundColor: "#0ea5e9", color: "white" },
  toggleOn: { backgroundColor: "#3b82f6" },
  toggleOff: { backgroundColor: "#5a5a5a" },

  // TEXT COLORS
  text: { color: "white" },
  pageHeaderText: { color: "white" },
};

export function getStyles() {
  const dark = ReuseDataStateStore.getState().data.DarkMode;
  return dark ? Dark : Light;
}
