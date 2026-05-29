import React from 'react';
import { ReactFlowProvider } from 'reactflow';
import FlowCanvas from '@/components/canvas/FlowCanvas';
import UnifiedGenBar from '@/components/panels/UnifiedGenBar';
import StatusBar from '@/components/panels/StatusBar';
import RightDock from '@/components/panels/RightDock';
import ChatDrawer from '@/components/panels/ChatDrawer';
import StoryboardPanel from '@/components/panels/StoryboardPanel';
import Onboarding from '@/components/overlays/Onboarding';
import CmdKPalette from '@/components/overlays/CmdKPalette';
import SettingsModal from '@/components/overlays/SettingsModal';
import HistoryDrawer from '@/components/panels/HistoryDrawer';
import AssetLibraryDrawer from '@/components/panels/AssetLibraryDrawer';

export default function CanvasPage() {
  return (
    <ReactFlowProvider>
      {/* 主布局 */}
      <div className="flex h-screen w-full flex-col overflow-hidden bg-[hsl(var(--canvas-bg))]">
        {/* 顶部生成栏 */}
        <UnifiedGenBar />

        {/* 中间：画布 + 右侧属性面板 */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          <FlowCanvas />
          <RightDock />
        </div>

        {/* 底部状态栏 */}
        <StatusBar />
      </div>

      {/* 浮动面板 / 覆盖层 */}
      <StoryboardPanel />
      <ChatDrawer />
      <HistoryDrawer />
      <AssetLibraryDrawer />

      {/* 全局覆盖层 */}
      <Onboarding />
      <CmdKPalette />
      <SettingsModal />
    </ReactFlowProvider>
  );
}
