import React from "react";
import { loadSettingsMaster, saveSettingsMaster, updateSettingsField } from "../Helpers/SettingsMaster";
import { APIStore, ReuseDataStateStore } from "../../../store/Store";
import CustomFieldInput_BASE from "../ActionBar/CustomFields/Inputs/CustomFieldInput_BASE";
import CutomFieldRequiredToggles from "../ActionBar/CustomFields/CutomFieldRequiredToggles";
import SOPButton from "../Interactions/Buttons/SOPButton";
import { Modes_Styles, AuditLayoutStyles } from "../../../Styles";

export default function Settings() {
  const darkMode = ReuseDataStateStore((s) => s.data.DarkMode);
  const theme = darkMode ? Modes_Styles.DarkMode : Modes_Styles.LightMode;

  const ui = {
    ...AuditLayoutStyles,
    ...theme,
  };

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

  function buildBasicAuth(user, pass) {
    const raw = `${user}:${pass}`;
    const encoded = btoa(raw);
    return `Basic ${encoded}`;
  }

  const [form, setForm] = React.useState(defaults);
  const [stored, setStored] = React.useState(defaults);
  const [showPass, setShowPass] = React.useState(false);
  const [pass, setPass] = React.useState("");
  const [varifyPass, setVerifyPass] = React.useState("");
  const [SettingPassword, setSettingPassword] = React.useState("");

  React.useEffect(() => {
    async function load() {
      const loaded = await loadSettingsMaster(defaults);
      setForm(loaded);
      setStored(loaded);
    }
    load();
  }, []);

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

  async function submitSettings() {
    let current = stored;
    for (const key of Object.keys(form)) {
      if (form[key] !== stored[key]) {
        current = await updateSettingsField(current, key, form[key]);
      }
    }
    setStored(current);
    loadSettingsIntoStore();
    pullLocationData();
  }

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

  function verifySettingPass() {
    if (pass !== varifyPass) return;
    updateField("SETTINGPASS", pass);
    setStored((prev) => ({ ...prev, SETTINGPASS: pass }));
    setSettingPassVarified(true);
  }

  function handleLogin() {
    if (SettingPassword === stored.SETTINGPASS) {
      setSettingPassVarified(true);
      setSettingPassword("");
    }
  }

  const hasAnyValues =
    stored.IP_ADDRESS || stored.USERNAME || stored.PASSWORD || stored.LOCATION || stored.BASE64USERPASS || stored.SETTINGPASS;

  return (
    <div className={ui.settingsWrapper}>
      <div className="m-4 mt-4 flex flex-row wi-full justify-between">
        <span className={`${ui.cardHeader} text-xl font-bold`}>SETTINGS</span>
        <SOPButton />
      </div>

      <div className="w-full h-full flex flex-col justify-center gap-3">
        {!settingPassVarified && stored.SETTINGPASS && (
          <div className={`${ui.settingsMessageBox} mx-4 flex flex-col gap-4`}>
            <span className={ui.cardHeader + " px-4"}>Enter Password to View Settings</span>
            <form
              className={`${ui.cardBody} flex flex-col px-4`}
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
            >
              <div className="flex flex-row gap-2 items-center w-full">
                <label className={ui.label + " w-[30%]"}>Password</label>
                <input
                  className={ui.input + " w-[70%]"}
                  type="tel"
                  value={SettingPassword}
                  onChange={(e) => setSettingPassword(e.target.value)}
                />
              </div>

              <button type="submit" className={ui.mainButton + " mt-4 w-full"}>
                Login
              </button>
            </form>
          </div>
        )}

        {!settingPassVarified && (
          <div className={`${ui.settingsMessageBox} mx-4 h-[8rem]`}>
            <div className="flex flex-row justify-center items-center h-full w-full">
              <span className={ui.cardHeader}>Input Pass to view settings</span>
            </div>
          </div>
        )}

        {settingPassVarified && (
          <div>
            <div className={`${ui.cardOuter} m-4 p-4 flex flex-col gap-2`}>
              <span className={`${ui.cardHeader}`}>
                LogonBox Install <span className="font-normal text-sm">(Required VPN)</span>
              </span>

              <div className={`${ui.cardBody} justify-between`}>
                <span className={ui.label}>Install Link</span>

                <div className="flex flex-row gap-2">
                  <a href="https://apps.apple.com/us/app/logonbox-vpn-client/id1570800936" className={ui.settingsLinkButton}>
                    iOS
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.logonbox.vpn&hl=en_US"
                    className={ui.settingsLinkButton}
                  >
                    Android
                  </a>
                </div>
              </div>
            </div>

            <div className={`${ui.cardOuter} m-4 p-4 flex flex-col gap-2`}>
              <span className={ui.cardHeader}>
                Backend Connection <span className="font-normal text-sm">(When Instance changes)</span>
              </span>

              <div className={`${ui.cardBody} justify-between`}>
                <span className={ui.label}>Authorize Backend</span>

                <a href="https://10.34.5.85:10000" className={ui.settingsLinkButton}>
                  Authorize
                </a>
              </div>
            </div>

            <div className={`${ui.cardOuter} m-4 p-4 flex flex-col gap-2`}>
              <span className={ui.cardHeader}>Set Up Target Instance</span>

              <form
                className={`${ui.cardBody} flex flex-col gap-4`}
                onSubmit={(e) => {
                  e.preventDefault();
                  submitSettings();
                }}
              >
                <div className="flex flex-row gap-2 items-center w-full">
                  <label className={ui.label + " w-[30%]"}>IP Address</label>
                  <input
                    className={ui.input + " w-[70%]"}
                    type="text"
                    value={form.IP_ADDRESS}
                    onChange={(e) => updateField("IP_ADDRESS", e.target.value)}
                  />
                </div>

                <div className="flex flex-row gap-2 items-center w-full">
                  <label className={ui.label + " w-[30%]"}>User Name</label>
                  <input
                    className={ui.input + " w-[70%]"}
                    type="text"
                    value={form.USERNAME}
                    onChange={(e) => updateField("USERNAME", e.target.value)}
                  />
                </div>

                <div className="flex flex-row gap-2 items-center w-full">
                  <label className={ui.label + " w-[30%]"}>Password</label>

                  <div className="w-[70%] flex flex-row gap-2 items-center">
                    <input
                      className={ui.input + " w-[80%]"}
                      type={showPass ? "text" : "password"}
                      value={form.PASSWORD}
                      onChange={(e) => updateField("PASSWORD", e.target.value)}
                    />
                    <button type="button" className={ui.infoButton + " w-[20%]"} onClick={() => setShowPass((prev) => !prev)}>
                      {showPass ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="flex flex-row gap-2 items-center w-full">
                  <label className={ui.label + " w-[30%]"}>Encode</label>
                  <input className={ui.input + " w-[70%]"} type="text" readOnly value={form.BASE64USERPASS || ""} />
                </div>

                <button type="submit" className={ui.mainButton}>
                  Apply Changes
                </button>
              </form>
            </div>

            <div className={`${ui.cardOuter} m-4 p-4 flex flex-col gap-2`}>
              <div className="flex flex-row gap-2 items-center">
                <label className={ui.label}>Location</label>

                <select
                  className={ui.select}
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

                    setForm((prev) => ({
                      ...prev,
                      LOCATION: obj.name,
                      LOCATIONCODE: obj.code,
                    }));

                    const updated = {
                      ...form,
                      LOCATION: obj.name,
                      LOCATIONCODE: obj.code,
                    };

                    await saveSettingsMaster(updated);
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

        {!stored.SETTINGPASS && (
          <div className={`${ui.cardOuter} m-4 p-2 flex flex-col gap-2`}>
            <form
              className={`${ui.cardBody} flex flex-col gap-4`}
              onSubmit={(e) => {
                e.preventDefault();
                verifySettingPass();
              }}
            >
              <div className="flex flex-row gap-2 items-center">
                <label className={ui.label}>Password</label>
                <input className={ui.input} type="tel" value={pass} onChange={(e) => setPass(e.target.value)} />
              </div>

              <div className="flex flex-row gap-2 items-center">
                <label className={ui.label}>Verify Pass</label>
                <input className={ui.input} type="tel" value={varifyPass} onChange={(e) => setVerifyPass(e.target.value)} />
              </div>

              <div className="flex flex-row justify-around">
                <button type="submit" className={ui.mainButton}>
                  Create Password
                </button>
              </div>
            </form>
          </div>
        )}

        {stored.SETTINGPASS && (
          <div className={`${ui.cardOuter} mx-4 flex flex-row justify-center py-4`}>
            <button type="button" className={ui.settingsDangerButton} onClick={resetAllData}>
              Reset All Passwords and Settings
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
