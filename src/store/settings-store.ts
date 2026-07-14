import { create } from "zustand";
import { encryptApiKey, decryptApiKey } from "@/lib/crypto";
import type { AIProvider } from "@/types";
import { DEFAULT_MODELS } from "@/lib/constants";

const STORAGE_KEY = "rc-settings";
const API_KEY_STORAGE_KEY = "rc-api-key";

interface PersistedSettings {
  provider: AIProvider | null;
  model: string | null;
  ollamaUrl: string;
  hasConsented: boolean;
}

function loadPersistedSettings(): PersistedSettings {
  if (typeof window === "undefined") {
    return { provider: null, model: null, ollamaUrl: "http://localhost:11434", hasConsented: false };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { provider: null, model: null, ollamaUrl: "http://localhost:11434", hasConsented: false };
}

function persistSettings(settings: PersistedSettings) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

interface SettingsStore {
  provider: AIProvider | null;
  model: string | null;
  ollamaUrl: string;
  hasConsented: boolean;
  isConfigured: boolean;

  setProvider: (provider: AIProvider) => void;
  setModel: (model: string) => void;
  setOllamaUrl: (url: string) => void;
  setConsented: (consented: boolean) => void;
  saveApiKey: (key: string) => Promise<void>;
  getApiKey: () => Promise<string | null>;
  clearSettings: () => void;
  hydrate: () => void;
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  provider: null,
  model: null,
  ollamaUrl: "http://localhost:11434",
  hasConsented: false,
  isConfigured: false,

  hydrate: () => {
    const persisted = loadPersistedSettings();
    const hasKey = typeof window !== "undefined" && !!localStorage.getItem(API_KEY_STORAGE_KEY);
    const isOllama = persisted.provider === "ollama";
    set({
      ...persisted,
      isConfigured: persisted.provider !== null && (isOllama || hasKey),
    });
  },

  setProvider: (provider) => {
    const model = DEFAULT_MODELS[provider] || null;
    set({ provider, model });
    const state = get();
    persistSettings({
      provider: state.provider,
      model: state.model,
      ollamaUrl: state.ollamaUrl,
      hasConsented: state.hasConsented,
    });
  },

  setModel: (model) => {
    set({ model });
    const state = get();
    persistSettings({
      provider: state.provider,
      model,
      ollamaUrl: state.ollamaUrl,
      hasConsented: state.hasConsented,
    });
  },

  setOllamaUrl: (ollamaUrl) => {
    set({ ollamaUrl });
    const state = get();
    persistSettings({
      provider: state.provider,
      model: state.model,
      ollamaUrl,
      hasConsented: state.hasConsented,
    });
  },

  setConsented: (hasConsented) => {
    set({ hasConsented });
    const state = get();
    persistSettings({
      provider: state.provider,
      model: state.model,
      ollamaUrl: state.ollamaUrl,
      hasConsented,
    });
  },

  saveApiKey: async (key) => {
    const encrypted = await encryptApiKey(key);
    localStorage.setItem(API_KEY_STORAGE_KEY, encrypted);
    const state = get();
    set({ isConfigured: state.provider !== null });
  },

  getApiKey: async () => {
    if (typeof window === "undefined") return null;
    const encrypted = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (!encrypted) return null;
    try {
      return await decryptApiKey(encrypted);
    } catch {
      return null;
    }
  },

  clearSettings: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(API_KEY_STORAGE_KEY);
    }
    set({
      provider: null,
      model: null,
      ollamaUrl: "http://localhost:11434",
      hasConsented: false,
      isConfigured: false,
    });
  },
}));
