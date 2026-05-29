import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CameraPreset, CameraParams } from '@/types/index';
import { BUILT_IN_PRESETS, DEFAULT_CAMERA_PARAMS } from '@/lib/cameraPresets';
import type { SceneType } from '@/lib/cameraPresets';

interface CameraState {
  selectedPresetId: string;
  customPresets: CameraPreset[];
  currentParams: CameraParams;
  sceneType: SceneType;
  selectPreset: (id: string) => void;
  updateParams: (params: Partial<CameraParams>) => void;
  saveCustomPreset: (name: string) => void;
  deleteCustomPreset: (id: string) => void;
  getAllPresets: () => CameraPreset[];
  resetToDefault: () => void;
  setSceneType: (scene: SceneType) => void;
}

export const useCameraStore = create<CameraState>()(
  persist(
    (set, get) => ({
      selectedPresetId: 'portrait-natural',
      customPresets: [],
      currentParams: DEFAULT_CAMERA_PARAMS,
      sceneType: 'portrait' as SceneType,

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
          selectedPresetId: s.selectedPresetId === id ? 'portrait-natural' : s.selectedPresetId,
        }));
      },

      resetToDefault: () => {
        set({ selectedPresetId: 'portrait-natural', currentParams: { ...DEFAULT_CAMERA_PARAMS } });
      },

      setSceneType: (scene: SceneType) => {
        set({ sceneType: scene });
      },
    }),
    {
      name: 'pe-camera-store',
    }
  )
);
