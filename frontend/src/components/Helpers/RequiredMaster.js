const STORAGE_KEY = "required_master_override";

export function loadRequiredMaster(defaults) {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return { ...defaults };
  try {
    const parsed = JSON.parse(raw);
    return { ...defaults, ...parsed };
  } catch {
    return { ...defaults };
  }
}

export function saveRequiredMaster(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function updateRequiredField(data, objectType, label, value) {
  const group = data[objectType] || {};

  const updatedGroup = {
    ...group,
    [label]: value,
  };

  const out = {
    ...data,
    [objectType]: updatedGroup,
  };

  saveRequiredMaster(out);
  return out;
}
