const DB_NAME = "settings_db";
const STORE_NAME = "settings_store";
const STORAGE_KEY = "settings_master_override";

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);

    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function loadSettingsMaster(defaults) {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(STORAGE_KEY);

      req.onsuccess = () => {
        const out = req.result;
        resolve(out ? out : { ...defaults });
      };

      req.onerror = () => resolve({ ...defaults });
    });
  } catch {
    return { ...defaults };
  }
}

export async function saveSettingsMaster(data) {
  const db = await openDB();
  return new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.put(data, STORAGE_KEY);

    tx.oncomplete = () => resolve(true);
    tx.onerror = () => resolve(false);
  });
}

export async function updateSettingsField(data, label, value) {
  const out = { ...data, [label]: value };
  await saveSettingsMaster(out);
  return out;
}
