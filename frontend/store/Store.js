import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { dcTrack_URL } from "../src/components/Helpers/dcTrackAPIEndpointURL";
import { loadSettingsMaster } from "../src/components/Helpers/SettingsMaster";
import axios from "axios";

const BACKEND = import.meta.env.DEV ? "https://192.168.68.58:10000" : import.meta.env.VITE_BACKEND_URL;

let initState = {
  NAMESTATE: {
    NAMEDATA: {},
  },
  ReuseDataState: {
    CameraText: "",
    CameraPermission: false,
    CameraIndex: 0,
    OcrTrigger: 0,
    CameraStatus: 0,
    PredictTrigger: 0,
    pageView: 0,
    cabinetActionBar: 0,
    cabinetViewFrontBack: "Front",
    Make: "",
    Model: "",
    AssetTag: "",
    ORCCropTop: 0.45,
    ORCCropBottom: 0.55,
    ORCCropLeft: 0.22,
    ORCCropRight: 0.75,
    CameraRequiredToProcess: {
      type: "",
      field: "",
    },
    RequireToggleWatcher: false,
    ShowEmptyUPToggleWatcher: true,
    ShowPDUToggleWatcher: false,
    ShowRequiredAudit: true,
    SelectedMake: "",
    SelectedModel: "",
    SelectedInCabinetAsset: {},
    objectFields: "",
    objectType: "",
    settingPassVarified: false,
  },
  DataState: {
    TextData: "",
  },
  APIStore: {
    ContentLoading: true,
    BaseURL: "10.34.2.111",
    ResponseMessage: {},
    ResponseCode: "",
    openResponseMessage: false,
    sendAPIPush: () => {},
    auditRequest: {
      url: "",
      payload: {},
    },
    APIPayloadHolder: {},
    APIAction: "ADD",
    LocationsOnInstance: {},
    CabinetsInLocation: {},
    AssetsInCabinet: {},
    ZeroUAssetsInCabinet: [],
    BladesInCabinet: [],
    BladesSignature: "",
    ChassisSignature: "",
    BladesModelsInCabinet: [],
    CassisModelsInCabinet: [],
    CurrnetLocationID: null,
    CurrentCabinetName: "",
    CurrentCabinetID: null,
    MakeDatafromInstance: { make: [] },
    ModelDatafromInstance: { model: [] },
    IPADDRESS: "",
    USERNAME: "",
    PASSWORD: "",
    BASE64USERPASS: "",
    LOCATION: "",
    LOCATIONCODE: "",
    SelectedModelUR: 0,
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
    setPageView: (num) => {
      set((state) => ({
        data: { ...state.data, pageView: num },
      }));
      if (num !== 2) {
        set((state) => ({
          data: { ...state.data, settingPassVarified: false },
        }));
      }
    },
    setSettingPassVarified: (bool) => {
      set((state) => ({
        data: { ...state.data, settingPassVarified: bool },
      }));
    },
    setCabinetActionBar: (num) => {
      set((state) => ({
        data: { ...state.data, cabinetActionBar: num },
      }));
    },
    setSelectedInCabinetAsset: (data) => {
      set((state) => ({
        data: { ...state.data, SelectedInCabinetAsset: data },
      }));
    },
    setObjectFields: (data) => {
      set((state) => ({
        data: { ...state.data, objectFields: data },
      }));
    },
    setObjectType: (type) => {
      set((state) => ({
        data: { ...state.data, objectType: type },
      }));
    },
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
    setCabinetViewFrontBack: (View) => {
      set((state) => ({
        data: {
          ...state.data,
          cabinetViewFrontBack: View,
        },
      }));
    },
    setShowRequiredAudit: (bool) => {
      set((state) => ({
        data: {
          ...state.data,
          ShowRequiredAudit: bool,
        },
      }));
    },
    setPDUToggleWatcher: (bool) => {
      set((state) => ({
        data: {
          ...state.data,
          ShowPDUToggleWatcher: bool,
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
    setSelectedMake: (make) => {
      set((state) => ({
        data: {
          ...state.data,
          SelectedMake: make,
        },
      }));
    },
    setSelectedModel: (model) => {
      set((state) => ({
        data: {
          ...state.data,
          SelectedModel: model,
        },
      }));
    },
  }))
);

export const APIStore = create(
  devtools((set, get) => ({
    data: initState.APIStore,

    setAPIAction: (action) => {
      set((state) => ({
        data: { ...state.data, APIAction: action },
      }));
    },

    setContentLoading: (bool) => {
      set((state) => ({
        data: { ...state.data, ContentLoading: bool },
      }));
    },

    runWithLoading: async (fn) => {
      get().setContentLoading(true);
      try {
        return await fn();
      } finally {
        get().setContentLoading(false);
      }
    },

    setResponseMessage: (obj) => {
      set((state) => ({
        data: { ...state.data, ResponseMessage: obj },
      }));
      const hasContent = obj && Object.keys(obj).length > 0;
      if (hasContent) get().setOpenResponseMessage(true);
      else get().setOpenResponseMessage(false);
    },

    setResponseCode: (code) => {
      set((state) => ({
        data: { ...state.data, ResponseCode: code },
      }));
    },

    setOpenResponseMessage: (bool) => {
      set((state) => ({
        data: { ...state.data, openResponseMessage: bool },
      }));
    },

    sendAPIPush: () =>
      get().runWithLoading(async () => {
        const { url, payload } = get().data.auditRequest;
        const IP = get().data.IPADDRESS;
        const LOGIN = get().data.BASE64USERPASS;

        const cleanPayload = Object.fromEntries(Object.entries(payload).filter(([k]) => k !== "objectType"));

        const apiURL = `${BACKEND}/api${url}?returnDetails=false`;

        try {
          const res = await axios.post(apiURL, cleanPayload, {
            headers: {
              "x-dctrack-host": IP,
              "x-login-details": LOGIN,
            },
          });

          get().setResponseCode(res.status);
          get().setResponseMessage({
            type: "APIResponse",
            data: res.data,
          });
        } catch (err) {
          const code = err.response?.data?.backendData?.httpCode || err.code || "ERR";

          const backend = err.response?.data?.backendData || err.response?.data || err;

          get().setResponseCode(code);
          get().setResponseMessage({
            type: "APIResponse",
            data: backend,
          });
        }
      }),

    EditAPIPush: (id) =>
      get().runWithLoading(async () => {
        const { payload } = get().data.auditRequest;
        const IP = get().data.IPADDRESS;
        const LOGIN = get().data.BASE64USERPASS;

        const cleanPayload = Object.fromEntries(Object.entries(payload).filter(([k]) => k != "objectType"));

        cleanPayload["_tiProceedOnWarning"] = true;

        const apiURL = `${BACKEND}/api/v2/dcimoperations/items/${id}?returnDetails=true`;

        try {
          const res = await axios.put(apiURL, cleanPayload, {
            headers: {
              "x-dctrack-host": IP,
              "x-login-details": LOGIN,
            },
          });

          const code = res.data.backendData?.httpCode || res.status;
          get().setResponseCode(code);
          get().setResponseMessage({
            type: "APIResponse",
            data: res.data.backendData,
          });
        } catch (err) {
          const code = err.response?.data?.backendData?.httpCode || err.code;

          get().setResponseCode(code);
          get().setResponseMessage({
            type: "APIResponse",
            data: err.response?.data?.backendData,
          });
        }
      }),

    pullAllAssetFromCabinet: async (cabinetId) =>
      get().runWithLoading(async () => {
        const IP = get().data.IPADDRESS;
        const LOGIN = get().data.BASE64USERPASS;

        const url = `/v2/items/cabinetItems/${cabinetId}`;
        const apiURL = `${BACKEND}/api${url}`;

        try {
          const res = await axios.get(apiURL, {
            headers: {
              "x-dctrack-host": IP,
              "x-login-details": LOGIN,
            },
          });

          const items = res.data.cabinetItems || [];

          // ------------------------------------------------
          // Build signatures for change detection
          // ------------------------------------------------
          const newChassisSignature = items
            .filter((i) => i.formFactor === "Chassis")
            .map((i) => i.modelId)
            .join("|");

          const newBladeSignature = items
            .filter((i) => i.mounting === "Blade")
            .map((i) => i.modelId)
            .join("|");

          const { ChassisSignature: oldChassisSignature, BladesSignature: oldBladeSignature } = get().data;

          // ------------------------------------------------
          // Always update the base cabinet items
          // ------------------------------------------------
          set((state) => ({
            data: { ...state.data, AssetsInCabinet: res.data },
          }));

          // ------------------------------------------------
          // Zero U: ALWAYS refresh (as requested)
          // ------------------------------------------------
          const ZeroUData = [];
          for (const item of items) {
            if (item.mounting === "ZeroU") {
              const data = await get().GETAssetDataByID({
                id: item.id,
                action: "get",
              });
              ZeroUData.push(data?.data?.item || null);
            }
          }

          set((state) => ({
            data: {
              ...state.data,
              ZeroUAssetsInCabinet: ZeroUData,
            },
          }));

          // ------------------------------------------------
          // Blade models: refresh ONLY IF signature changed
          // ------------------------------------------------
          if (newBladeSignature !== oldBladeSignature) {
            const BladeModels = [];
            const usedBladeModels = new Set();

            for (const item of items) {
              if (item.mounting === "Blade" && !usedBladeModels.has(item.modelId)) {
                const data = await get().pullAllAssetData(item.modelId);
                usedBladeModels.add(item.modelId);
                BladeModels.push(data || null);
              }
            }

            set((state) => ({
              data: {
                ...state.data,
                BladesModelsInCabinet: BladeModels,
                BladesSignature: newBladeSignature,
              },
            }));
          }

          const BladeData = [];
          for (const item of items) {
            if (item.mounting === "Blade") {
              const data = await get().GETAssetDataByID({
                id: item.id,
                action: "get",
              });
              BladeData.push(data?.data?.item || null);
            }
          }

          set((state) => ({
            data: {
              ...state.data,
              BladesInCabinet: BladeData,
            },
          }));

          // ------------------------------------------------
          // Chassis models: refresh ONLY IF signature changed
          // ------------------------------------------------
          if (newChassisSignature !== oldChassisSignature) {
            const CassisModels = [];
            const modelIDs = new Set();

            for (const item of items) {
              if (item.formFactor === "Chassis" && !modelIDs.has(item.modelId)) {
                const data = await get().pullAllAssetData(item.modelId);
                modelIDs.add(item.modelId);
                CassisModels.push(data || null);
              }
            }

            set((state) => ({
              data: {
                ...state.data,
                CassisModelsInCabinet: CassisModels,
                ChassisSignature: newChassisSignature,
              },
            }));
          }

          return res.data;
        } catch (err) {
          const status = err.response?.data?.backendData?.httpCode || err.code || "ERR";

          get().setResponseCode(status);
          get().setResponseMessage({
            type: "APIResponse",
            data: err,
          });
          return null;
        }
      }),

    deleteAsset: async (assetId) =>
      get().runWithLoading(async () => {
        const IP = get().data.IPADDRESS;
        const LOGIN = get().data.BASE64USERPASS;

        const url = `/v2/dcimoperations/items/${assetId}`;
        const apiURL = `${BACKEND}/api${url}`;

        try {
          const res = await axios.delete(apiURL, {
            headers: {
              "x-dctrack-host": IP,
              "x-login-details": LOGIN,
            },
          });

          return res.data;
        } catch (err) {
          const status = err.response?.data?.backendData?.httpCode || err.code || "ERR";

          get().setResponseCode(status);
          get().setResponseMessage({
            type: "APIResponse",
            data: err,
          });
          return null;
        }
      }),

    pullCabinetData: async (locationId) =>
      get().runWithLoading(async () => {
        const IP = get().data.IPADDRESS;
        const LOGIN = get().data.BASE64USERPASS;

        const url = "/v2/capacity/cabinets/list/search";
        const apiURL = `${BACKEND}/api${url}`;

        const payload = {
          ruHeight: 1,
          locationIds: [locationId],
        };

        try {
          const res = await axios.post(apiURL, payload, {
            headers: {
              "x-dctrack-host": IP,
              "x-login-details": LOGIN,
            },
          });

          set((state) => ({
            data: { ...state.data, CabinetsInLocation: res.data },
          }));

          return res.data;
        } catch (err) {
          const status = err.response?.data?.backendData?.httpCode || err.code || "ERR";

          get().setResponseCode(status);
          get().setResponseMessage({
            type: "APIResponse",
            data: err,
          });
          return null;
        }
      }),

    GETAssetDataByID: async (payload) =>
      get().runWithLoading(async () => {
        const IP = get().data.IPADDRESS;
        const LOGIN = get().data.BASE64USERPASS;

        const apiURL = `${BACKEND}/api/v2/dcimoperations/items/${payload.id}`;

        try {
          const res = await axios.get(apiURL, {
            headers: {
              "x-dctrack-host": IP,
              "x-login-details": LOGIN,
            },
          });

          if (payload.action === "update") {
            set((state) => ({
              data: { ...state.data, APIPayloadHolder: res.data.item },
            }));
          }

          return res;
        } catch (err) {
          const status = err.response?.data?.backendData?.httpCode || err.code || "ERR";

          get().setResponseCode(status);
          get().setResponseMessage({
            type: "APIResponse",
            data: err,
          });

          return null;
        }
      }),

    pullLocationData: async () =>
      get().runWithLoading(async () => {
        const IP = get().data.IPADDRESS;
        const LOGIN = get().data.BASE64USERPASS;

        const apiURL = `${BACKEND}/api/v1/locations`;

        try {
          const res = await axios.get(apiURL, {
            headers: {
              "x-dctrack-host": IP,
              "x-login-details": LOGIN,
            },
          });

          set((state) => ({
            data: { ...state.data, LocationsOnInstance: res.data },
          }));

          return res.data;
        } catch (err) {
          const status = err.response?.data?.backendData?.httpCode || err.code || "ERR";

          get().setResponseCode(status);
          get().setResponseMessage({
            type: "APIResponse",
            data: err,
          });
          return null;
        }
      }),

    pullRUDataFromSelectedModel: async (modelID) =>
      get().runWithLoading(async () => {
        const IP = get().data.IPADDRESS;
        const LOGIN = get().data.BASE64USERPASS;

        const apiURL = `${BACKEND}/api/v2/models/${modelID}`;

        try {
          const res = await axios.get(apiURL, {
            headers: {
              "x-dctrack-host": IP,
              "x-login-details": LOGIN,
            },
          });

          return res.data;
        } catch (err) {
          return null;
        }
      }),

    pullAllAssetData: async (ID) =>
      get().runWithLoading(async () => {
        const IP = get().data.IPADDRESS;
        const LOGIN = get().data.BASE64USERPASS;

        const apiURL = `${BACKEND}/api/v2/models/${ID}`;

        try {
          const res = await axios.get(apiURL, {
            headers: {
              "x-dctrack-host": IP,
              "x-login-details": LOGIN,
            },
          });
          return res.data;
        } catch (err) {
          return null;
        }
      }),

    pullAllMakesFromInstance: async (query) =>
      get().runWithLoading(async () => {
        const IP = get().data.IPADDRESS;
        const LOGIN = get().data.BASE64USERPASS;

        const term = query || "";
        const apiURL = `${BACKEND}/api/v2/dcimoperations/search/makes/${encodeURIComponent(term)}`;

        try {
          const res = await axios.get(apiURL, {
            headers: {
              "x-dctrack-host": IP,
              "x-login-details": LOGIN,
            },
          });

          const list = res.data?.make ?? [];
          const top10 = list.slice(0, 10);

          set((state) => ({
            data: {
              ...state.data,
              MakeDatafromInstance: { make: top10 },
            },
          }));

          return list;
        } catch (err) {
          return null;
        }
      }),

    pullAllModelsFromMake: async () =>
      get().runWithLoading(async () => {
        const IP = get().data.IPADDRESS;
        const LOGIN = get().data.BASE64USERPASS;

        const selectedMake = ReuseDataStateStore.getState().data.SelectedMake;
        const selectedModel = ReuseDataStateStore.getState().data.SelectedModel;

        const url = `/v2/quicksearch/models?pageNumber=1&pageSize=10`;
        const apiURL = `${BACKEND}/api${url}`;

        const payload = {
          columns: [
            {
              name: "make",
              filter: { contains: selectedMake },
            },
            { name: "model", filter: { contains: selectedModel } },
          ],
          selectedColumns: [{ name: "make" }, { name: "model" }, { name: "class" }],
          customFieldByLabel: false,
        };

        try {
          const res = await axios.post(apiURL, payload, {
            headers: {
              "x-dctrack-host": IP,
              "x-login-details": LOGIN,
            },
          });

          set((state) => ({
            data: {
              ...state.data,
              ModelDataFromInstance: res.data?.searchResults?.models || [],
            },
          }));

          return res.data;
        } catch (err) {
          const status = err.response?.data?.backendData?.httpCode || err.code || "ERR";

          get().setResponseCode(status);
          get().setResponseMessage({
            type: "APIResponse",
            data: err,
          });

          return null;
        }
      }),

    pullAuditTrail: async () =>
      get().runWithLoading(async () => {
        const IP = get().data.IPADDRESS;
        const LOGIN = get().data.BASE64USERPASS;

        const apiURL = `${BACKEND}/api/v2/quicksearch/auditTrail?pageNumber=1&pageSize=0`;

        try {
          const res = await axios.post(
            apiURL,
            {
              columns: [
                {
                  name: "entityType",
                  filter: { eq: "Item" },
                },
              ],
              selectedColumns: [],
            },
            {
              headers: {
                "x-dctrack-host": IP,
                "x-login-details": LOGIN,
              },
            }
          );

          return res.data;
        } catch (err) {
          return null;
        }
      }),

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
      const key = data.field;

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

    setSingleAPIPayloadHolder: (key, value) => {
      const state = get().data;
      set(() => ({
        data: {
          ...state,
          APIPayloadHolder: {
            ...state.APIPayloadHolder,
            [key]: value,
          },
        },
      }));
    },

    setEditAPIPayloadHolder: (data) => {
      const state = get().data;
      set(() => ({
        data: {
          ...state,
          APIPayloadHolder: data,
        },
      }));
    },

    setCurrentLocationID: (id) => {
      set((state) => ({
        data: { ...state.data, CurrnetLocationID: id },
      }));
    },

    setCurrentCabinetID: (id) => {
      const CabinetsInLocation = get().data.CabinetsInLocation;
      const cabinetName = (CabinetsInLocation?.cabinets || []).find((cab) => cab.cabinetId == id)?.cabinet;

      set((state) => ({
        data: {
          ...state.data,
          CurrentCabinetName: cabinetName || "",
          CurrentCabinetID: id,
        },
      }));
    },

    setSelectedModelUR: (modelUR) => {
      set((state) => ({
        data: { ...state.data, SelectedModelUR: modelUR },
      }));
    },

    loadSettingsIntoStore: async () =>
      get().runWithLoading(async () => {
        const defaults = {
          IP_ADDRESS: "",
          USERNAME: "",
          PASSWORD: "",
          BASE64USERPASS: "",
          SETTINGPASS: "",
          LOCATION: "",
          LOCATIONCODE: "",
        };

        const stored = await loadSettingsMaster(defaults);

        set((state) => ({
          data: {
            ...state.data,
            IPADDRESS: stored.IP_ADDRESS || "",
            USERNAME: stored.USERNAME || "",
            PASSWORD: stored.PASSWORD || "",
            BASE64USERPASS: stored.BASE64USERPASS || "",
            LOCATION: stored.LOCATION || "",
            LOCATIONCODE: stored.LOCATIONCODE || "",
          },
        }));
      }),
  }))
);
