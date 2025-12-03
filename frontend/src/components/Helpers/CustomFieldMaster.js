const CF_STORAGE_KEY = "custom_fields_state";

export function loadCustomFieldsLocal(defaults) {
  const raw = localStorage.getItem(CF_STORAGE_KEY);
  if (!raw) return { ...defaults };

  try {
    const parsed = JSON.parse(raw);
    return { ...defaults, ...parsed };
  } catch {
    return { ...defaults };
  }
}

export function saveCustomFieldsLocal(data) {
  localStorage.setItem(CF_STORAGE_KEY, JSON.stringify(data));
}

export function updateCustomFieldRequired(data, fieldLabel, value) {
  const field = data[fieldLabel] || {};

  const updatedField = {
    ...field,
    Required: value,
  };

  const out = {
    ...data,
    [fieldLabel]: updatedField,
  };

  saveCustomFieldsLocal(out);
  return out;
}

export function updateSelectedClass(data, value) {
  const out = {
    ...data,
    SelectedClass: value || "",
  };

  saveCustomFieldsLocal(out);
  return out;
}

export function updateSelectedSubclass(data, value) {
  const out = {
    ...data,
    SelectedSubclass: value || "",
  };

  saveCustomFieldsLocal(out);
  return out;
}
