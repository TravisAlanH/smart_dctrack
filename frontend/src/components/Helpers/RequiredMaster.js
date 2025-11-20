const STORAGE_KEY = "required_master_override";

export function loadRequiredMaster(defaults) {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return { ...defaults };
  try {
    return JSON.parse(stored);
  } catch {
    return { ...defaults };
  }
}

export function saveRequiredMaster(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function updateRequiredField(data, label, value) {
  const out = { ...data, [label]: value };
  saveRequiredMaster(out);
  return out;
}
