import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  apiKey: string;
  defaultImageModel: string;
  defaultVideoModel: string;
  defaultChatModel: string;
  theme: 'dark' | 'light';
  setApiKey: (key: string) => void;
  setDefaultImageModel: (model: string) => void;
  setDefaultVideoModel: (model: string) => void;
  setDefaultChatModel: (model: string) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  isApiKeyConfigured: () => boolean;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      apiKey: '',
      defaultImageModel: 'seedream-5.0-lite',
      defaultVideoModel: 'seedance-2.0',
      defaultChatModel: 'deepseek-v3.2',
      theme: 'dark',

      setApiKey: (key: string) => set({ apiKey: key }),
      setDefaultImageModel: (model: string) => set({ defaultImageModel: model }),
      setDefaultVideoModel: (model: string) => set({ defaultVideoModel: model }),
      setDefaultChatModel: (model: string) => set({ defaultChatModel: model }),
      setTheme: (theme: 'dark' | 'light') => set({ theme }),
      isApiKeyConfigured: () => Boolean(get().apiKey),
    }),
    {
      name: 'pe-settings-store',
    }
  )
);
