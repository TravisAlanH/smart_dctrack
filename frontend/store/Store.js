import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { headerEndpoints } from "../src/components/Helpers/Endpoints";
import axios from "axios";

const BACKEND = import.meta.env.DEV ? "http://192.168.68.51:10000" : import.meta.env.VITE_BACKEND_URL;

let initState = {
  NAMESTATE: {
    NAMEDATA: {},
  },
  ReuseDataState: {
    LocationCode: "",
    CameraText: "",
    CameraPermission: false,
    CameraIndex: 0,
    OcrTrigger: 0,
    CameraStatus: 0,
    PredictTrigger: 0,
    Make: "",
    Model: "",
    AssetTag: "",
    ORCCropTop: 0.2,
    ORCCropBottom: 0.8,
    ORCCropLeft: 0.1,
    ORCCropRight: 0.9,
    CameraRequiredToProcess: {
      type: "",
      field: "",
    },
    RequireToggleWatcher: false,
    ShowEmptyUPToggleWatcher: true,
  },
  DataState: {
    TextData: "",
  },
  APIStore: {
    BaseURL: "10.34.2.111",
    ResponseMessage: {},
    ResponseCode: "",
    sendAPIPush: () => {},
    auditRequest: {
      url: "",
      payload: {},
    },
    APIPayloadHolder: {},
    LocationsOnInstance: {},
    CabinetsInLocation: {},
    AssetsInCabinet: {},
    CurrnetLocationID: null,
    CurrentCabinetID: null,
    MakeDatafromInstance: { make: [] },
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
    setPredictTrigger: (num) => {
      set((state) => ({
        data: { ...state.data, PredictTrigger: num },
      }));
    },
    setCameraStatus: (num) => {
      set((state) => ({
        data: { ...state.data, CameraStatus: num },
      }));
    },
    setMake: (string) => {
      set((state) => ({
        data: { ...state.data, Make: string },
      }));
    },
    setModel: (string) => {
      set((state) => ({
        data: { ...state.data, Model: string },
      }));
    },
    // Add these inside your store's create() block

    setTrainMake: (string) => {
      set((state) => ({
        data: { ...state.data, TrainMake: string },
      }));
    },

    setTrainModel: (string) => {
      set((state) => ({
        data: { ...state.data, TrainModel: string },
      }));
    },
    setORCCrop: (top, bottom, left, right) => {
      set((state) => ({
        data: {
          ...state.data,
          ORCCropTop: top,
          ORCCropBottom: bottom,
          ORCCropLeft: left,
          ORCCropRight: right,
        },
      }));
    },
    setAssetTag: (string) => {
      set((state) => ({
        data: { ...state.data, AssetTag: string },
      }));
    },
    setCameraPermission: (bool) => {
      set((state) => ({
        data: { ...state.data, CameraPermission: bool },
      }));
    },
    setCameraIndex: (num) => {
      set((state) => ({
        data: { ...state.data, CameraIndex: num },
      }));
    },
    setCameraRequiredToProcess: (type, field) => {
      set((state) => ({
        data: {
          ...state.data,
          CameraRequiredToProcess: { type: type, field: field },
        },
      }));
    },
    setRequireToggleWatcher: () => {
      set((state) => ({
        data: {
          ...state.data,
          RequireToggleWatcher: !state.data.RequireToggleWatcher,
        },
      }));
    },
    setShowEmptyUPToggleWatcher: (bool) => {
      set((state) => ({
        data: {
          ...state.data,
          ShowEmptyUPToggleWatcher: bool,
        },
      }));
    },
  }))
);

export const APIStore = create(
  devtools((set, get) => ({
    data: initState.APIStore,
    setResponseMessage: (obj) => {
      set((state) => ({
        data: { ...state.data, ResponseMessage: obj },
      }));
    },
    setResponseCode: (code) => {
      set((state) => ({
        data: { ...state.data, ResponseCode: code },
      }));
    },
    sendAPIPush: () => {
      const { url, payload, BaseURL } = get().data.auditRequest;
      const serverHost = get().data.BaseURL;

      const cleanPayload = Object.fromEntries(Object.entries(payload).filter(([k]) => k !== "objectType"));

      const apiURL = `${BACKEND}/api${url}?returnDetails=false`;

      axios
        .post(apiURL, cleanPayload, {
          headers: {
            "x-dctrack-host": serverHost,
          },
        })
        .then((res) => {
          get().setResponseCode(res.status);
          get().setResponseMessage(res);
        })
        .catch((err) => {
          const status = err.code || err.response?.status || "ERR";
          get().setResponseCode(status);
          get().setResponseMessage(err);
        });
    },
    pullAllAssetFromCabinet: async (cabinetId) => {
      const serverHost = get().data.BaseURL;

      const url = `/v2/items/cabinetItems/${cabinetId}`;
      const apiURL = `${BACKEND}/api${url}`;

      try {
        const res = await axios.get(apiURL, {
          headers: {
            "x-dctrack-host": serverHost,
          },
        });
        set((state) => ({
          data: { ...state.data, AssetsInCabinet: res.data },
        }));
        return res.data;
      } catch (err) {
        const status = err.code || err.response?.status || "ERR";
        get().setResponseCode(status);
        get().setResponseMessage(err);
        return null;
      }
    },

    pullCabinetData: async (locationId) => {
      const serverHost = get().data.BaseURL;

      const url = "/v2/capacity/cabinets/list/search";

      const payload = {
        ruHeight: 1,
        locationIds: [locationId],
      };

      const apiURL = `${BACKEND}/api${url}`;

      try {
        const res = await axios.post(apiURL, payload, {
          headers: {
            "x-dctrack-host": serverHost,
          },
        });
        set((state) => ({
          data: { ...state.data, CabinetsInLocation: res.data },
        }));
        return res.data;
      } catch (err) {
        const status = err.code || err.response?.status || "ERR";
        get().setResponseCode(status);
        get().setResponseMessage(err);
        return null;
      }
    },
    pullLocationData: async () => {
      const serverHost = get().data.BaseURL;

      const url = "/v1/locations";
      const apiURL = `${BACKEND}/api${url}`;

      try {
        const res = await axios.get(apiURL, {
          headers: {
            "x-dctrack-host": serverHost,
          },
        });

        set((state) => ({
          data: { ...state.data, LocationsOnInstance: res.data },
        }));
        return res.data;
      } catch (err) {
        const status = err.code || err.response?.status || "ERR";
        get().setResponseCode(status);
        get().setResponseMessage(err);
        return null;
      }
    },
    pullAllMakesFromInstance: async (query) => {
      const serverHost = get().data.BaseURL;

      const term = query || "";
      const url = `/v2/dcimoperations/search/makes/${encodeURIComponent(term)}`;
      const apiURL = `${BACKEND}/api${url}`;

      try {
        const res = await axios.get(apiURL, {
          headers: {
            "x-dctrack-host": serverHost,
          },
        });

        const list = res.data?.make ?? [];

        set((state) => ({
          data: {
            ...state.data,
            MakeDatafromInstance: { make: list },
          },
        }));

        return list;
      } catch (err) {
        const status = err.code || err.response?.status || "ERR";
        console.log(status);
        return null;
      }
    },
    setAuditUrl: (url) => {
      set((state) => ({
        data: {
          ...state.data,
          auditRequest: { ...state.data.auditRequest, url: url },
        },
      }));
    },
    setAuditPayload: (data) => {
      set((state) => ({
        data: {
          ...state.data,
          auditRequest: { ...state.data.auditRequest, payload: data },
        },
      }));
    },
    resetAPUIPayloadHolder: () => {
      set((state) => ({
        data: {
          ...state.data,
          APIPayloadHolder: {},
        },
      }));
    },
    setAPIPayloadHolder: (data) => {
      const state = get().data;
      const endpoints = headerEndpoints[data.type];
      const key = endpoints[data.field];

      set(() => ({
        data: {
          ...state,
          APIPayloadHolder: {
            ...state.APIPayloadHolder,
            [key]: data.value,
          },
        },
      }));
      console.log("APIPayloadHolder", state.APIPayloadHolder);
    },
    setCurrentLocationID: (id) => {
      set((state) => ({
        data: { ...state.data, CurrnetLocationID: id },
      }));
    },
    setCurrentCabinetID: (id) => {
      set((state) => ({
        data: { ...state.data, CurrentCabinetID: id },
      }));
    },
  }))
);
