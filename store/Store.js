import { create } from "zustand";
import { devtools } from "zustand/middleware";

let initState = {
  NAMESTATE: {
    NAMEDATA: {},
  },
  ReuseDataState: {
    LocationCode: "",
    CameraText: "",
    OcrTrigger: 0,
    CameraStatus: 0,
  },
  DataState: {
    TextData: "",
  },
};

export const NAMESTATEStore = create(
  devtools((set) => ({
    data: initState.NAMESTATE,
    setNAMEDATA: (sortedby, sortedOrder) => {
      set((state) => ({
        data: { ...state.data, sortedby: sortedby, sortedOrder: sortedOrder },
      }));
    },
  }))
);

export const DataStateStore = create(
  devtools((set) => ({
    data: initState.DataState,
    setTextData: (text) => {
      set((state) => ({
        data: { ...state.data, TextData: text },
      }));
    },
  }))
);

export const ReuseDataStateStore = create(
  devtools((set) => ({
    data: initState.ReuseDataState,
    setCameraText: (string) => {
      set((state) => ({
        data: { ...state.data, CameraText: string },
      }));
    },
    setORCTrigger: (num) => {
      set((state) => ({
        data: { ...state.data, OcrTrigger: num },
      }));
    },
    setCameraStatus: (num) => {
      set((state) => ({
        data: { ...state.data, CameraStatus: num },
      }));
    },
  }))
);
