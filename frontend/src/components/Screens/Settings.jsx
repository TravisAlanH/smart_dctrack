import React from "react";
import { loadSettingsMaster, saveSettingsMaster, updateSettingsField } from "../Helpers/SettingsMaster";
import { APIStore, ReuseDataStateStore } from "../../../store/Store";
import CustomFieldInput_BASE from "../ActionBar/CustomFields/Inputs/CustomFieldInput_BASE";
import CutomFieldRequiredToggles from "../ActionBar/CustomFields/CutomFieldRequiredToggles";

export default function Settings() {
  //#region STATE_SETTERS
  const settingPassVarified = ReuseDataStateStore((s) => s.data.settingPassVarified);
  const setSettingPassVarified = ReuseDataStateStore((s) => s.setSettingPassVarified);
  const pullLocationData = APIStore((s) => s.pullLocationData);
  const LocationsOnInstance = APIStore((s) => s.data.LocationsOnInstance);
  const loadSettingsIntoStore = APIStore((s) => s.loadSettingsIntoStore);
  const setCurrentLocationID = APIStore((s) => s.setCurrentLocationID);
  const pullCustomFields = APIStore((s) => s.pullCustomFields);
  const CustomFieldsOnInstance = APIStore((s) => s.data.CustomFieldsOnInstance);

  React.useEffect(() => {
    loadSettingsIntoStore();
  }, []);

  const defaults = {
    IP_ADDRESS: "",
    USERNAME: "",
    PASSWORD: "",
    LOCATION: "",
    LOCATIONCODE: "",
    BASE64USERPASS: "",
    SETTINGPASS: "",
  };
  //#endregion

  //#region HELPERS
  function buildBasicAuth(user, pass) {
    const raw = `${user}:${pass}`;
    const encoded = btoa(raw);
    return `Basic ${encoded}`;
  }
  //#endregion

  //#region LOCAL_STATE
  const [form, setForm] = React.useState(defaults);
  const [stored, setStored] = React.useState(defaults);
  const [showPass, setShowPass] = React.useState(false);
  const [pass, setPass] = React.useState("");
  const [varifyPass, setVerifyPass] = React.useState("");
  const [SettingPassword, setSettingPassword] = React.useState("");

  //#endregion

  //#region LOAD_STORED_ON_MOUNT
  React.useEffect(() => {
    async function load() {
      const loaded = await loadSettingsMaster(defaults);
      setForm(loaded);
      setStored(loaded);
    }
    load();
  }, []);
  //#endregion

  //#region FIELD_UPDATE
  async function updateField(label, value) {
    setForm((prev) => {
      const out = { ...prev, [label]: value };
      if (label === "USERNAME" || label === "PASSWORD") {
        out.BASE64USERPASS = buildBasicAuth(out.USERNAME, out.PASSWORD);
      }
      return out;
    });

    const latest = { ...form, [label]: value };
    await saveSettingsMaster(latest);
    loadSettingsIntoStore();
  }
  //#endregion

  //#region SUBMIT_SETTINGS
  async function submitSettings() {
    let current = stored;
    console.log(current);
    for (const key of Object.keys(form)) {
      if (form[key] !== stored[key]) {
        current = await updateSettingsField(current, key, form[key]);
      }
    }

    setStored(current);
    loadSettingsIntoStore();
    pullLocationData();
  }
  //#endregion

  //#region RESET_ALL
  async function resetAllData() {
    setForm(defaults);
    setStored(defaults);

    await saveSettingsMaster(defaults);

    setSettingPassVarified(false);
    setSettingPassword("");
    setPass("");
    setVerifyPass("");
    loadSettingsIntoStore();
  }
  //#endregion

  //#region CREATE_PASS
  function verifySettingPass() {
    console.log("test");
    if (pass !== varifyPass) return;
    updateField("SETTINGPASS", pass);
    setStored((prev) => ({ ...prev, SETTINGPASS: pass }));
    setSettingPassVarified(true);
  }
  //#endregion

  //#region LOGIN_PASS
  function handleLogin() {
    if (SettingPassword === stored.SETTINGPASS) {
      setSettingPassVarified(true);
      setSettingPassword("");
    }
  }
  //#endregion

  //#region VALUE_CHECK
  const hasAnyValues =
    stored.IP_ADDRESS || stored.USERNAME || stored.PASSWORD || stored.LOCATION || stored.BASE64USERPASS || stored.SETTINGPASS;
  //#endregion

  return (
    <div>
      <div className="mx-4 mt-4 text-xl text-white font-bold">SETTINGS</div>
      <div className="w-full h-full flex flex-col justify-center gap-3">
        {/* #region LOGIN_INPUT */}

        {stored.SETTINGPASS && !settingPassVarified && (
          <div className=" bg-gray-700 rounded-lg shadow-lg mx-4">
            <form
              className="p-4 gap-4 flex flex-col text-white"
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
            >
              <div className="flex flex-row gap-2 items-center">
                <label className="w-[25%]">Password</label>
                <input
                  className="text-black px-2 py-1 rounded w-[75%]"
                  type="tel"
                  value={SettingPassword}
                  onChange={(e) => setSettingPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="bg-blue-600 text-white rounded px-3 py-2 mt-4">
                Login
              </button>
            </form>
          </div>
        )}
        {/* #endregion */}

        {/* #region BLOCK_MESSAGE */}
        {!settingPassVarified && (
          <div className="m-4 bg-gray-700 rounded-lg shadow-lg h-[8rem] text-white">
            <div className="flex flex-row justify-center items-center h-full w-full text-white">
              <span className="text-white">Input Pass to view settings</span>
            </div>
          </div>
        )}
        {/* #endregion */}

        {/* #region SETTINGS_FORM */}
        {settingPassVarified && (
          <div>
            <div className="m-4 pt-4 bg-gray-700 rounded-lg shadow-lg">
              <span className="px-4 font-bold text-white">
                LogonBox Install <span className="pl-2 font-normal text-sm">(Required VPN)</span>
              </span>
              <div className="p-4 flex flex-row justify-between w-full text-white">
                <span>Install Link</span>
                <div className="flex flex-row gap-2">
                  <a
                    href="https://apps.apple.com/us/app/logonbox-vpn-client/id1570800936"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-800 text-white rounded px-2 py-1"
                  >
                    iOS
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.logonbox.vpn&hl=en_US"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-800 text-white rounded px-2 py-1"
                  >
                    Android
                  </a>
                </div>
              </div>
            </div>
            <div className="m-4 pt-4 bg-gray-700 rounded-lg shadow-lg">
              <span className="px-4 font-bold text-white">
                Backend Connection <span className="pl-2 font-normal text-sm">(When Instance changes)</span>
              </span>
              <div className="p-4 flex flex-row justify-between w-full text-white">
                <span>Authorize Backend</span>
                <a
                  href="https://10.34.5.85:10000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 text-white rounded px-2 py-1"
                >
                  Authorize
                </a>
              </div>
            </div>
            <div className="m-4 pt-4 bg-gray-700 rounded-lg shadow-lg">
              <span className="px-4 font-bold text-white">Set Up Target Instance</span>
              <form
                className="p-4 gap-4 flex flex-col text-white"
                onSubmit={(e) => {
                  e.preventDefault();
                  submitSettings();
                }}
              >
                <div className="flex flex-row gap-2 items-center">
                  <label className="w-[25%]">IP Address</label>
                  <input
                    className="text-black px-2 py-1 rounded w-[75%]"
                    type="text"
                    value={form.IP_ADDRESS}
                    onChange={(e) => updateField("IP_ADDRESS", e.target.value)}
                  />
                </div>

                <div className="flex flex-row gap-2 items-center">
                  <label className="w-[25%]">User Name</label>
                  <input
                    className="text-black px-2 py-1 rounded w-[75%]"
                    type="text"
                    value={form.USERNAME}
                    onChange={(e) => updateField("USERNAME", e.target.value)}
                  />
                </div>

                <div className="flex flex-row gap-2 items-center">
                  <label className="w-[25%]">Password</label>
                  <div className="w-[75%] flex flex-row gap-2 items-center">
                    <input
                      className="text-black px-2 py-1 rounded w-[80%]"
                      type={showPass ? "text" : "password"}
                      value={form.PASSWORD}
                      onChange={(e) => updateField("PASSWORD", e.target.value)}
                    />
                    <button
                      type="button"
                      className="bg-gray-800 text-white rounded px-2 py-1"
                      onClick={() => setShowPass((prev) => !prev)}
                    >
                      {showPass ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="flex flex-row gap-2 items-center">
                  <label className="w-[25%]">Encode</label>
                  <input
                    className="text-black px-2 py-1 rounded w-[75%]"
                    type="text"
                    readOnly
                    value={form.BASE64USERPASS || ""}
                  />
                </div>

                <button type="submit" className="bg-blue-600 text-white rounded px-3 py-2 mt-4">
                  Apply Changes
                </button>
              </form>
            </div>
            <div className="p-4 gap-4 flex flex-col text-white bg-gray-700 m-4 rounded-lg shadow-lg">
              <div className="flex flex-row gap-2 items-center">
                <label className="w-[25%]">Location</label>
                <select
                  className="text-black px-2 py-1 rounded w-[75%]"
                  value={
                    form.LOCATIONCODE
                      ? JSON.stringify({
                          code: form.LOCATIONCODE,
                          name: form.LOCATION,
                        })
                      : ""
                  }
                  onChange={async (e) => {
                    if (!e.target.value) {
                      const empty = { LOCATION: "", LOCATIONCODE: "" };

                      setForm((prev) => ({ ...prev, ...empty }));
                      await saveSettingsMaster({ ...form, ...empty });
                      loadSettingsIntoStore();
                      return;
                    }

                    const obj = JSON.parse(e.target.value);

                    // update React state
                    setForm((prev) => ({
                      ...prev,
                      LOCATION: obj.name,
                      LOCATIONCODE: obj.code,
                    }));

                    // write to IndexedDB
                    const updated = {
                      ...form,
                      LOCATION: obj.name,
                      LOCATIONCODE: obj.code,
                    };
                    await saveSettingsMaster(updated);

                    // sync APIStore
                    loadSettingsIntoStore();
                    setCurrentLocationID(obj.code);
                  }}
                >
                  {Object.keys(LocationsOnInstance).length === 0 ? (
                    <option value="">Apply API Settings</option>
                  ) : (
                    <option value="">Select Location</option>
                  )}

                  {(LocationsOnInstance?.locations || []).map((loc) => (
                    <option
                      className="text-black"
                      key={loc.id}
                      value={JSON.stringify({
                        code: loc.id,
                        name: loc.tiLocationCode,
                      })}
                    >
                      {loc.tiLocationName} ({loc.tiLocationCode})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <CutomFieldRequiredToggles />
          </div>
        )}
        {/* #endregion */}

        {/* #region CREATE_PASS */}
        {!stored.SETTINGPASS && (
          <div className="m-4 bg-gray-700 rounded-lg shadow-lg">
            <form
              className="p-4 gap-4 flex flex-col text-white"
              onSubmit={(e) => {
                e.preventDefault();
                verifySettingPass();
              }}
            >
              <div className="flex flex-row gap-2 items-center">
                <label className="w-[25%]">Password</label>
                <input
                  className="text-black px-2 py-1 rounded w-[75%]"
                  type="tel"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                />
              </div>

              <div className="flex flex-row gap-2 items-center">
                <label className="w-[25%]">Verify Pass</label>
                <input
                  className="text-black px-2 py-1 rounded w-[75%]"
                  type="tel"
                  value={varifyPass}
                  onChange={(e) => setVerifyPass(e.target.value)}
                />
              </div>

              <div className="flex flex-row justify-around">
                <button type="submit" className="bg-blue-600 text-white rounded px-3 py-2 mt-4">
                  Create Password
                </button>
              </div>
            </form>
          </div>
        )}
        {/* #endregion */}

        {/* #region RESET */}
        {stored.SETTINGPASS && (
          <div className="m-4 bg-gray-700 rounded-lg shadow-lg flex flex-row justify-center">
            <button type="button" className="bg-blue-600 text-white rounded px-3 py-2 m-4" onClick={resetAllData}>
              Reset All Passwords and Settings
            </button>
          </div>
        )}
        {/* #endregion */}
      </div>
    </div>
  );
}
