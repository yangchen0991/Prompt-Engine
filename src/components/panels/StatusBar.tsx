import React from 'react';
import { useGenerationStore } from '@/stores/generationStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useUIStore } from '@/stores/uiStore';
import { Loader2, CheckCircle2, Wifi, WifiOff, AlertCircle, Library } from 'lucide-react';

export default function StatusBar() {
  const tasks = useGenerationStore(s => s.tasks);
  const todayCount = useGenerationStore(s => s.todayCount);
  const { apiKey } = useSettingsStore();
  const { setAssetLibraryOpen } = useUIStore();

  const activeTasks = tasks.filter(t => t.status === 'SUBMITTING' || t.status === 'POLLING');
  const failedTasks = tasks.filter(t => t.status === 'FAILED');
  const currentTask = activeTasks[0];

  const isConnected = Boolean(apiKey);

  return (
    <footer className="flex h-8 shrink-0 items-center justify-between border-t border-border bg-card/80 px-3 text-[11px] text-muted-foreground">
      {/* 左侧：API 连接状态 */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          {isConnected ? (
            <>
              <Wifi size={11} className="text-[hsl(var(--status-success))]" />
              <span className="text-[hsl(var(--status-success))]">已连接 TokenDance</span>
            </>
          ) : (
            <>
              <WifiOff size={11} className="text-[hsl(var(--status-warning))]" />
              <span className="text-[hsl(var(--status-warning))]">未配置 API Key</span>
            </>
          )}
        </div>

        {todayCount > 0 && (
          <>
            <span className="text-border">|</span>
            <span>今日已生成 {todayCount} 张</span>
          </>
        )}
        
        <span className="text-border">|</span>
        <button
          onClick={() => setAssetLibraryOpen(true)}
          className="flex items-center gap-1.5 transition-colors hover:text-foreground"
        >
          <Library size={12} />
          <span>资产库</span>
        </button>
      </div>

      {/* 中间：当前生成进度 */}
      <div className="flex items-center gap-2">
        {currentTask && (
          <div className="flex items-center gap-2">
            <Loader2 size={11} className="text-primary animate-spin" />
            <span className="text-foreground">
              生成中 {currentTask.progress}%
            </span>
            {activeTasks.length > 1 && (
              <span className="text-muted-foreground">(+{activeTasks.length - 1})</span>
            )}
            {/* 进度条 */}
            <div className="w-20 h-1 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${currentTask.progress}%` }}
              />
            </div>
          </div>
        )}
        {!currentTask && tasks.filter(t => t.status === 'DONE').length > 0 && (
          <div className="flex items-center gap-1">
            <CheckCircle2 size={11} className="text-[hsl(var(--status-success))]" />
            <span>上次生成成功</span>
          </div>
        )}
        {failedTasks.length > 0 && !currentTask && (
          <div className="flex items-center gap-1 text-destructive">
            <AlertCircle size={11} />
            <span>{failedTasks.length} 个任务失败</span>
          </div>
        )}
      </div>

      {/* 右侧：快捷键提示 */}
      <div className="hidden md:flex items-center gap-2 text-muted-foreground/50">
        <span><kbd className="font-mono">Ctrl+K</kbd> 添加节点</span>
        <span>·</span>
        <span><kbd className="font-mono">Del</kbd> 删除</span>
        <span>·</span>
        <span><kbd className="font-mono">Ctrl+Z</kbd> 撤销</span>
      </div>
    </footer>
  );
}
