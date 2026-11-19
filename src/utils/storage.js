const SAVED_IDEAS_KEY = "startupsarthi_saved_ideas_v1";
const LANG_KEY = "startupsarthi_lang_v1";
const DPR_PROFILE_KEY = "startupsarthi_dpr_profile_v1";
const ASSISTANT_HISTORY_KEY = "startupsarthi_assistant_history_v1";

export function loadSavedIdeas() {
  try {
    const raw = localStorage.getItem(SAVED_IDEAS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveIdeaToDevice(entry) {
  const existing = loadSavedIdeas();
  const idx = existing.findIndex((item) => item.id === entry.id);
  const updated =
    idx >= 0
      ? existing.map((item, i) => (i === idx ? { ...item, ...entry, updatedAt: Date.now() } : item))
      : [{ ...entry, createdAt: Date.now(), updatedAt: Date.now() }, ...existing].slice(0, 25);

  try {
    localStorage.setItem(SAVED_IDEAS_KEY, JSON.stringify(updated));
  } catch {
    // Ignore quota errors gracefully
  }
  return updated;
}

export function deleteSavedIdea(id) {
  const updated = loadSavedIdeas().filter((item) => item.id !== id);
  try {
    localStorage.setItem(SAVED_IDEAS_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage errors
  }
  return updated;
}

export function loadLanguage() {
  try {
    return localStorage.getItem(LANG_KEY) || "en";
  } catch {
    return "en";
  }
}

export function saveLanguage(code) {
  try {
    localStorage.setItem(LANG_KEY, code);
  } catch {
    // Ignore
  }
}

export function loadDprProfile() {
  try {
    const raw = localStorage.getItem(DPR_PROFILE_KEY);
    return raw ? JSON.parse(raw) : { founderName: "", businessName: "", address: "", contact: "" };
  } catch {
    return { founderName: "", businessName: "", address: "", contact: "" };
  }
}

export function saveDprProfile(profile) {
  try {
    localStorage.setItem(DPR_PROFILE_KEY, JSON.stringify(profile));
  } catch {
    // Ignore
  }
}

export function loadAssistantHistory() {
  try {
    const raw = localStorage.getItem(ASSISTANT_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveAssistantHistory(messages) {
  try {
    const trimmed = (messages || []).slice(-30);
    localStorage.setItem(ASSISTANT_HISTORY_KEY, JSON.stringify(trimmed));
  } catch {
    // Ignore quota errors
  }
}

export function clearAssistantHistory() {
  try {
    localStorage.removeItem(ASSISTANT_HISTORY_KEY);
  } catch {
    // Ignore
  }
}
