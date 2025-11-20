import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { headerEndpoints } from "../src/components/Helpers/Endpoints";
import axios from "axios";

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
    // sendAPIPush: () => {
    //   const { url, payload } = get().data.auditRequest;
    //   const baseURL = get().data.BaseURL;

    //   // !

    //   const config = {
    //     method: "post",
    //     maxBodyLength: Infinity,
    //     url: `https://${baseURL}${url}?returnDetails=false`,
    //     headers: {
    //       Accept: "application/json",
    //       "Content-Type": "application/json",
    //       Authorization: "Basic YWRtaW46c3VuYmlyZA==",
    //     },
    //     data: JSON.stringify(payload),
    //   };

    //   axios
    //     .request(config)
    //     .then((res) => {
    //       const statusCode = res.status;
    //       const messageObj = res;

    //       get().setResponseCode(statusCode);
    //       get().setResponseMessage(messageObj);
    //     })
    //     .catch((err) => {
    //       const statusCode = err.code || err.response?.status || "ERR";
    //       const messageObj = err;

    //       get().setResponseCode(statusCode);
    //       get().setResponseMessage(messageObj);
    //     });
    // },

    // sendAPIPush: () => {
    //   const { url, payload } = get().data.auditRequest;

    //   const apiURL = `/api${url}?returnDetails=false`;

    //   axios
    //     .post(apiURL, payload)
    //     .then((res) => {
    //       get().setResponseCode(res.status);
    //       get().setResponseMessage(res);
    //     })
    //     .catch((err) => {
    //       const status = err.code || err.response?.status || "ERR";
    //       get().setResponseCode(status);
    //       get().setResponseMessage(err);
    //     });
    // },

    sendAPIPush: () => {
      const { url, payload, BaseURL } = get().data.auditRequest;
      const serverHost = get().data.BaseURL;

      const cleanPayload = Object.fromEntries(Object.entries(payload).filter(([k]) => k !== "objectType"));

      const apiURL = `/api${url}?returnDetails=false`;

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
    setAPIPayloadHolder: (data) => {
      const state = get().data;
      console.log(data.field);
      const endpoints = headerEndpoints[data.type];
      console.log(endpoints);
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
    },
  }))
);
