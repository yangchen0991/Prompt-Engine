import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  // 面板开关
  rightDockOpen: boolean;
  rightDockTab: 'prompt' | 'camera' | 'results' | 'history';
  chatDrawerOpen: boolean;
  historyPanelOpen: boolean;
  storyboardPanelOpen: boolean;
  assetLibraryOpen: boolean;
  settingsOpen: boolean;
  cmdKOpen: boolean;
  onboardingCompleted: boolean;

  // 当前选中节点
  selectedNodeId: string | null;

  // 操作函数
  setRightDockOpen: (open: boolean) => void;
  setRightDockTab: (tab: UIState['rightDockTab']) => void;
  setChatDrawerOpen: (open: boolean) => void;
  setHistoryPanelOpen: (open: boolean) => void;
  setStoryboardPanelOpen: (open: boolean) => void;
  setAssetLibraryOpen: (open: boolean) => void;
  setSettingsOpen: (open: boolean) => void;
  setCmdKOpen: (open: boolean) => void;
  completeOnboarding: () => void;
  setSelectedNodeId: (id: string | null) => void;
  closeAllPanels: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      rightDockOpen: false,
      rightDockTab: 'prompt',
      chatDrawerOpen: false,
      historyPanelOpen: false,
      storyboardPanelOpen: false,
      assetLibraryOpen: false,
      settingsOpen: false,
      cmdKOpen: false,
      onboardingCompleted: false,
      selectedNodeId: null,

      setRightDockOpen: (open) => set({ rightDockOpen: open }),
      setRightDockTab: (tab) => set({ rightDockTab: tab }),
      setChatDrawerOpen: (open) => set({ chatDrawerOpen: open }),
      setHistoryPanelOpen: (open) => set({ historyPanelOpen: open }),
      setStoryboardPanelOpen: (open) => set({ storyboardPanelOpen: open }),
      setAssetLibraryOpen: (open) => set({ assetLibraryOpen: open }),
      setSettingsOpen: (open) => set({ settingsOpen: open }),
      setCmdKOpen: (open) => set({ cmdKOpen: open }),
      completeOnboarding: () => {
        // 同时写入独立 key，供外部直接检测
        localStorage.setItem('onboarding_completed', 'true');
        set({ onboardingCompleted: true });
      },
      setSelectedNodeId: (id) => set({ selectedNodeId: id, rightDockOpen: Boolean(id) }),

      closeAllPanels: () => set({
        chatDrawerOpen: false,
        historyPanelOpen: false,
        storyboardPanelOpen: false,
        assetLibraryOpen: false,
        settingsOpen: false,
        cmdKOpen: false,
      }),
    }),
    {
      name: 'pe-ui-store',
      partialize: (state) => ({ onboardingCompleted: state.onboardingCompleted }),
    }
  )
);
