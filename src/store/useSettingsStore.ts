import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsStore {
  claudeApiKey: string | null;
  setClaudeApiKey: (key: string | null) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      claudeApiKey: null,
      setClaudeApiKey: (key) => set({ claudeApiKey: key }),
    }),
    {
      name: 'settings-storage',
    }
  )
);