import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CameraPreset, CameraParams } from '@/types/index';
import { BUILT_IN_PRESETS, DEFAULT_CAMERA_PARAMS } from '@/lib/cameraPresets';

interface CameraState {
  selectedPresetId: string;
  customPresets: CameraPreset[];
  currentParams: CameraParams;
  selectPreset: (id: string) => void;
  updateParams: (params: Partial<CameraParams>) => void;
  saveCustomPreset: (name: string) => void;
  deleteCustomPreset: (id: string) => void;
  getAllPresets: () => CameraPreset[];
  resetToDefault: () => void;
}

export const useCameraStore = create<CameraState>()(
  persist(
    (set, get) => ({
      selectedPresetId: 'preset-cinematic',
      customPresets: [],
      currentParams: DEFAULT_CAMERA_PARAMS,

      getAllPresets: () => [...BUILT_IN_PRESETS, ...get().customPresets],

      selectPreset: (id: string) => {
        const allPresets = get().getAllPresets();
        const preset = allPresets.find(p => p.id === id);
        if (preset) {
          set({ selectedPresetId: id, currentParams: { ...DEFAULT_CAMERA_PARAMS, ...preset.params } });
        }
      },

      updateParams: (params: Partial<CameraParams>) => {
        set(s => ({ currentParams: { ...s.currentParams, ...params }, selectedPresetId: 'custom' }));
      },

      saveCustomPreset: (name: string) => {
        const { customPresets, currentParams } = get();
        if (customPresets.length >= 20) return;
        const id = `custom-${Date.now()}`;
        const newPreset: CameraPreset = { id, name, params: { ...currentParams }, isCustom: true };
        set(s => ({ customPresets: [...s.customPresets, newPreset], selectedPresetId: id }));
      },

      deleteCustomPreset: (id: string) => {
        set(s => ({
          customPresets: s.customPresets.filter(p => p.id !== id),
          selectedPresetId: s.selectedPresetId === id ? 'preset-cinematic' : s.selectedPresetId,
        }));
      },

      resetToDefault: () => {
        set({ selectedPresetId: 'preset-cinematic', currentParams: { ...DEFAULT_CAMERA_PARAMS } });
      },
    }),
    {
      name: 'pe-camera-store',
    }
  )
);
