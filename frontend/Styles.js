// export const Modes_Styles = {
//   DarkMode: {
//     cardOuter: "flex flex-col bg-slate-600 rounded-md mx-2",
//     cardHeader: "px-3 pt-2 pb-1 text-xs sm:text-sm font-semibold text-white",
//     cardBody: "w-full flex flex-row items-center gap-2 px-3 pb-2",

//     label: "text-sm sm:text-sm",
//     labelRequired: "text-sm sm:text-sm text-red-400 font-bold",

//     // iOS zoom fix: use text-base
//     input: "border border-gray-400 rounded px-2 py-1 text-base w-full bg-white text-black",
//     select: "border border-gray-400 rounded px-2 py-1 text-base w-full bg-white text-black",

//     mainButton: "bg-blue-600 text-white rounded px-3 py-1 text-sm sm:text-sm whitespace-nowrap",
//     infoButton: "bg-green-600 text-white rounded px-2 py-1 text-sm sm:text-sm whitespace-nowrap",
//   },
//   LightMode: {
//     cardOuter: "flex flex-col bg-slate-300 rounded-md mx-2",
//     cardHeader: "px-3 pt-2 pb-1 text-xs sm:text-sm font-semibold text-black",
//     cardBody: "w-full flex flex-row items-center gap-2 px-3 pb-2",
//     label: "text-sm sm:text-sm",
//     labelRequired: "text-sm sm:text-sm text-red-400 font-bold",
//     // iOS zoom fix: use text-base
//     input: "border border-gray-400 rounded px-2 py-1 text-base w-full bg-white text-black",
//     select: "border border-gray-400 rounded px-2 py-1 text-base w-full bg-white text-black",
//     mainButton: "bg-blue-400 text-white rounded px-3 py-1 text-sm sm:text-sm whitespace-nowrap",
//     infoButton: "bg-green-400 text-white rounded px-2 py-1 text-sm sm:text-sm whitespace-nowrap",
//   },
// };

export const Modes_Styles = {
  DarkMode: {
    // Audit
    cardOuter: "bg-slate-600",
    cardHeader: "text-white",
    cardBody: "",
    label: "",
    labelRequired: "text-red-400",
    input: "border-gray-400 bg-white text-black",
    select: "border-gray-400 bg-white text-black",
    mainButton: "bg-blue-600 text-white",
    infoButton: "bg-green-600 text-white",

    // Home
    pageWrapper: "text-white bg-slate-900",
    button: "bg-slate-800 text-white hover:bg-slate-700",
    buttonActive: "bg-blue-600 text-white hover:bg-blue-500",
    cardOuterHome: "bg-slate-600 text-white",
    cardInnerHome: "bg-slate-700 text-white",
    listItem: "bg-white text-black",
    leftTag: "bg-slate-200 text-black",
    rowText: "text-black",

    // Cabinet
    cabinetWrapper: "text-white bg-slate-900",
    cabinetHeader: "text-white",
    cabinetSubHeader: "text-white",
    emptyU: "bg-slate-500 text-white",
    emptyUInput: "bg-gray-300 text-black border-gray-400",
    filledU: "bg-slate-600 text-white",
    filledUInner: "bg-white text-black border-gray-400",
    actButton: "bg-green-500 text-black border border-green-700",
    halfView: "bg-slate-500",
    slotBox: "bg-slate-50 text-black border-gray-400",
    slotBoxRed: "bg-red-500 text-white border-gray-400",

    // Settings
    settingsWrapper: "bg-slate-900 text-white",
    settingsMessageBox: "bg-gray-700 rounded-lg shadow-lg text-white",
    settingsDangerButton: "bg-red-600 text-white rounded px-3 py-2",
    settingsLinkButton: "bg-gray-800 text-white rounded px-2 py-1",
  },

  LightMode: {
    // Audit
    cardOuter: "bg-slate-300",
    cardHeader: "text-black",
    cardBody: "",
    label: "",
    labelRequired: "text-red-400",
    input: "border-gray-400 bg-white text-black",
    select: "border-gray-400 bg-white text-black",
    mainButton: "bg-blue-400 text-white",
    infoButton: "bg-green-400 text-white",

    // Home
    pageWrapper: "text-black bg-slate-100",
    button: "bg-slate-300 text-black hover:bg-slate-200",
    buttonActive: "bg-blue-400 text-white hover:bg-blue-300",
    cardOuterHome: "bg-slate-200 text-black",
    cardInnerHome: "bg-slate-100 text-black",
    listItem: "bg-white text-black",
    leftTag: "bg-slate-300 text-black",
    rowText: "text-black",

    // Cabinet
    cabinetWrapper: "text-black bg-slate-100",
    cabinetHeader: "text-black",
    cabinetSubHeader: "text-black",
    emptyU: "bg-slate-300 text-black",
    emptyUInput: "bg-gray-200 text-black border-gray-400",
    filledU: "bg-slate-200 text-black",
    filledUInner: "bg-white text-black border-gray-400",
    actButton: "bg-green-400 text-black border border-green-600",
    halfView: "bg-slate-200",
    slotBox: "bg-slate-50 text-black border-gray-400",
    slotBoxRed: "bg-red-500 text-white border-gray-400",

    // Settings
    settingsWrapper: "bg-slate-100 text-black",
    settingsMessageBox: "bg-gray-200 rounded-lg shadow-lg text-black",
    settingsDangerButton: "bg-red-400 text-white rounded px-3 py-2",
    settingsLinkButton: "bg-gray-300 text-black rounded px-2 py-1",
  },
};

export const AuditLayoutStyles = {
  cardOuter: "flex flex-col rounded-md mx-2",
  cardHeader: "px-3 pt-2 pb-1 text-xs sm:text-sm font-semibold",
  cardBody: "w-full flex flex-row items-center gap-2 px-3 pb-2",

  label: "text-sm sm:text-sm",
  labelRequired: "text-sm sm:text-sm font-bold",

  input: "border rounded px-2 py-1 text-base w-full",
  select: "border rounded px-2 py-1 text-base w-full",

  mainButton: "rounded px-3 py-1 text-sm sm:text-sm whitespace-nowrap",
  infoButton: "rounded px-2 py-1 text-sm sm:text-sm whitespace-nowrap",
};

export const HomeLayoutStyles = {
  pageWrapper: "w-full h-full overflow-y-auto p-3 pb-24",

  button: "px-3 py-1 rounded text-base",
  cardOuter: "flex flex-col gap-2 border border-gray-500 rounded-lg w-full p-1",
  cardInner: "flex flex-col gap-2 border border-gray-500 rounded-lg w-full p-3",

  listItem: "w-full rounded-md flex flex-row items-center h-14 pr-2",
  leftTag: "rounded-l-md w-12 min-w-[3rem] h-full flex items-center justify-center border-r border-gray-400 text-base font-bold",
  rowText: "text-base truncate",
};

export const CabinetLayoutStyles = {
  wrapper: "w-full h-full flex flex-col overflow-hidden",
  headerRow: "flex flex-row items-center justify-between px-4 pt-2 pb-1",
  scrollBody: "flex-1 overflow-y-auto px-2 pb-24",

  emptyU: "flex flex-row items-center rounded-md h-10 px-2",
  emptyUInput: "border rounded px-2 py-1 text-base w-full",

  filledU: "flex flex-row items-stretch rounded-md px-2 py-1",
  ruColumn: "flex flex-col w-10 justify-around items-center",
  bodyContainer: "flex-1 flex flex-row items-center overflow-hidden",
  actButtonWrap: "w-16 flex justify-center items-center pl-1",
  actButton: "px-2 rounded-md h-8 text-base",

  fullViewOuter: "w-full h-full flex flex-col gap-1 border rounded px-2 py-1 overflow-hidden",
  fullViewHeader: "w-full flex flex-row items-center justify-between gap-2",
  halfViewOuter: "flex flex-row flex-1 h-full items-center px-2 py-1 rounded",

  slotContainer: "flex flex-col gap-1 w-full max-w-full overflow-x-auto overflow-y-hidden pb-2",
  slotRow: "flex flex-row gap-1",
  slotBox:
    "flex flex-col items-center justify-between text-center border rounded px-1 py-1 min-w-[2.5rem] max-w-[2.5rem] h-[8rem] text-base",
  slotBoxTall:
    "flex flex-col items-center justify-between text-center border rounded px-1 pt-1 min-w-[2.5rem] max-w-[2.5rem] h-[16rem] text-base",
};
