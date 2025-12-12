import { input } from "@tensorflow/tfjs";
import { ReuseDataStateStore } from "./store/Store";

const PrimaryOrange = "#f18a20";
const PrimaryGray = "#4b4f54";

const SecondaryPurple = "#863594";
const SecondaryOrange = "#f26b3e";
const SecondaryGreen = "#00b188";
const SecondaryLime = "#e1e61e";

const TertiaryTeal = "#629bb6";
const TertiaryBlue = "#556fa4";
const TertiaryRed = "#b7415d";
const TertiaryGold = "#e59a43";

const Light = {
  // BACKGROUND COLORS
  mainBackground: { backgroundColor: "white" },
  CardBackGround: { backgroundColor: "#f1f1f1", borderColor: "#f1f1f1" },
  CardSectionBackGround: { backgroundColor: "white", borderColor: "#f1f1f1" },
  CardEmptyBackGround: { backgroundColor: "yellow", borderColor: "purple" },
  CardInnerBackGround: { backgroundColor: "#ffffff", borderColor: "#f1f1f1" },
  CardTextBackGround: { backgroundColor: "white", borderColor: "#f1f1f1" },
  BladeBackground: { backgroundColor: "#f1f1f1", borderColor: PrimaryGray },
  BladeFilledBackground: { backgroundColor: TertiaryTeal, borderColor: "#f1f1f1" },
  IconBackground: { backgroundColor: "#e5e5e5", borderColor: "#f1f1f1" },

  // BUTTON COLORS
  baseButton: { backgroundColor: "#e5e5e5", color: PrimaryGray },
  activeButton: { backgroundColor: PrimaryOrange, color: "white" },
  disabledButton: { backgroundColor: "#a1a1a1", color: "white" },
  cautionButton: { backgroundColor: "#d31f1f", color: "white" },
  closeButton: { backgroundColor: "#ef4444", color: "white" },
  infoButton: { backgroundColor: PrimaryOrange, color: "white" },
  toggleOn: { backgroundColor: SecondaryPurple },
  toggleOff: { backgroundColor: PrimaryGray },

  // TEXT COLORS
  text: { color: "black" },
  pageHeaderText: { color: PrimaryGray },

  //   FOOTER COLORS
  footerBackground: { backgroundColor: "#d4d4d4" },
  footerIcon: { color: "black" },
  footerActiveIcon: { color: PrimaryOrange },

  //   BothDarkandLightMode
  input: { backgroundColor: "white", color: "black" },
  inputDark: { backgroundColor: "#808080", color: "white" },
};

const Dark = {
  // BACKGROUND COLORS
  mainBackground: { backgroundColor: "#121212" },
  CardBackGround: { backgroundColor: PrimaryGray, borderColor: PrimaryGray },
  CardSectionBackGround: { backgroundColor: "#1a1a1a", borderColor: "white" },
  CardEmptyBackGround: { backgroundColor: PrimaryGray, borderColor: PrimaryGray },
  CardInnerBackGround: { backgroundColor: "#2a2a2a", borderColor: "#2a2a2a" },
  CardTextBackGround: { backgroundColor: "#333333", borderColor: PrimaryGray },
  BladeBackground: { backgroundColor: "#8d8d8d", borderColor: PrimaryGray },
  BladeFilledBackground: { backgroundColor: PrimaryGray, borderColor: PrimaryGray },
  IconBackground: { backgroundColor: PrimaryGray, borderColor: "#2a2a2a" },

  // BUTTON COLORS
  baseButton: { backgroundColor: "#3a3a3a", color: "white" },
  activeButton: { backgroundColor: PrimaryOrange, color: "white" },
  disabledButton: { backgroundColor: "#5a5a5a", color: "white" },
  cautionButton: { backgroundColor: "#d31f1f", color: "white" },
  closeButton: { backgroundColor: "#dc2626", color: "white" },
  infoButton: { backgroundColor: PrimaryOrange, color: "white" },
  toggleOn: { backgroundColor: SecondaryPurple },
  toggleOff: { backgroundColor: "#5a5a5a" },

  // TEXT COLORS
  text: { color: "white" },
  pageHeaderText: { color: "white" },

  //   FOOTER COLORS
  footerBackground: { backgroundColor: "#1a1a1a" },
  footerIcon: { color: "gray" },
  footerActiveIcon: { color: PrimaryOrange },

  //   BothDarkandLightMode
  input: { backgroundColor: "white", color: "black" },
  inputDark: { backgroundColor: "#2a2a2a", color: "white" },
};

export function getStyles() {
  const dark = ReuseDataStateStore.getState().data.DarkMode;
  return dark ? Dark : Light;
}
