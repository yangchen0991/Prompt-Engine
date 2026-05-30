import React, { useState, useCallback } from 'react';
import { useGenerationStore } from '@/stores/generationStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useUIStore } from '@/stores/uiStore';
import { useFlowStore } from '@/stores/flowStore';
import { IMAGE_MODELS, VIDEO_MODELS } from '@/lib/models';
import {
  Sparkles,
  Play,
  Settings,
  ChevronDown,
  Loader2,
  MessageSquare,
  Clock,
  Film,
  Command,
  Image as ImageIcon,
  Video,
  Wand2,
} from 'lucide-react';

// 合并图片+视频供选择
const ALL_GEN_MODELS = [...IMAGE_MODELS, ...VIDEO_MODELS];

import { getSilentSculptPrompt } from '@/lib/sculpt-prompt';
import { getAdapter } from '@/lib/tokendance';

export default function UnifiedGenBar() {
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState('seedream-5.0-lite');
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [isAutoOptimize, setIsAutoOptimize] = useState(false);

  const submitTask = useGenerationStore(s => s.submitTask);
  const getActiveCount = useGenerationStore(s => s.getActiveCount);
  const { apiKey } = useSettingsStore();
  const {
    setSettingsOpen,
    setChatDrawerOpen,
    setHistoryPanelOpen,
    setStoryboardPanelOpen,
    setCmdKOpen,
  } = useUIStore();
  const { addNode } = useFlowStore();

  const activeCount = getActiveCount();
  const isRunning = activeCount > 0;

  const currentModel = ALL_GEN_MODELS.find(m => m.id === selectedModel);
  const genType = currentModel?.type === 'video' ? 'video' : 'image';

  const handleGenerate = useCallback(async () => {
    if (!apiKey) {
      setSettingsOpen(true);
      return;
    }
    
    let finalPrompt = prompt.trim() || '高质量创意图片';
    
    // 图片生成 且 开启了自动优化
    if (genType === 'image' && isAutoOptimize) {
      try {
        const adapter = getAdapter(apiKey);
        const { defaultChatModel } = useSettingsStore.getState();
        const optimized = await adapter.chat({
          model: defaultChatModel || 'ernie-4.5-turbo-32k',
          messages: [
            { role: 'system', content: getSilentSculptPrompt() },
            { role: 'user', content: finalPrompt }
          ]
        });
        
        // 尝试从返回的 markdown 代码块中提取
        const codeBlockMatch = optimized.match(/```(?:text|json|[\w]+)?\s*([\s\S]*?)\s*```/);
        if (codeBlockMatch && codeBlockMatch[1]) {
          finalPrompt = codeBlockMatch[1].trim();
        } else {
          finalPrompt = optimized.trim();
        }
      } catch (err) {
        console.error("优化提示词失败:", err);
        // 失败则回退到原词
      }
    }

    const nodeType = genType === 'video' ? 'genVideoNode' : 'genImageNode';
    const node = addNode(nodeType);
    await submitTask({
      nodeId: node.id,
      prompt: finalPrompt,
      model: selectedModel,
      type: genType,
    });
  }, [prompt, selectedModel, genType, submitTask, addNode, apiKey, setSettingsOpen, isAutoOptimize]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <header className="relative z-20 flex h-12 shrink-0 items-center gap-2 border-b border-border bg-card/90 backdrop-blur-sm px-3">
      {/* Logo */}
      <div className="flex items-center gap-2 mr-2 shrink-0">
        <Sparkles size={14} className="text-primary" />
        <span className="gradient-text text-sm font-semibold tracking-tight hidden md:block">绘词引擎</span>
      </div>

      {/* 模型选择 */}
      <div className="relative shrink-0">
        <button
          onClick={() => setIsModelOpen(!isModelOpen)}
          className="flex items-center gap-1.5 rounded-sm border border-border bg-secondary/50 px-2.5 py-1.5 text-[11px] text-foreground transition-colors hover:bg-accent"
        >
          {genType === 'image'
            ? <ImageIcon size={10} className="text-[hsl(var(--node-image))]" />
            : <Video size={10} className="text-[hsl(var(--node-video))]" />
          }
          <span className="max-w-[100px] truncate">{currentModel?.name ?? selectedModel}</span>
          <ChevronDown size={10} className="text-muted-foreground" />
        </button>
        {isModelOpen && (
          <div className="absolute top-full left-0 mt-1 w-52 overflow-y-auto rounded-sm border border-border bg-card shadow-lg z-50 max-h-72">
            {/* 图片模型组 */}
            <div className="sticky top-0 border-b border-border bg-card px-3 py-1.5">
              <span className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                <ImageIcon size={9} /> 图片生成
              </span>
            </div>
            {IMAGE_MODELS.map(m => (
              <button
                key={m.id}
                onClick={() => { setSelectedModel(m.id); setIsModelOpen(false); }}
                className={`flex w-full items-center justify-between px-3 py-1.5 text-left text-[11px] transition-colors hover:bg-accent ${
                  m.id === selectedModel ? 'text-[hsl(var(--node-image))]' : 'text-foreground'
                }`}
              >
                <div className="min-w-0">
                  <div className="truncate">{m.name}</div>
                  <div className="truncate text-[9px] text-muted-foreground/70">{m.provider}</div>
                </div>
                {m.id === selectedModel && <span className="ml-1 shrink-0">✓</span>}
              </button>
            ))}
            {/* 视频模型组 */}
            <div className="sticky top-0 border-b border-t border-border bg-card px-3 py-1.5">
              <span className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                <Video size={9} /> 视频生成
              </span>
            </div>
            {VIDEO_MODELS.map(m => (
              <button
                key={m.id}
                onClick={() => { setSelectedModel(m.id); setIsModelOpen(false); }}
                className={`flex w-full items-center justify-between px-3 py-1.5 text-left text-[11px] transition-colors hover:bg-accent ${
                  m.id === selectedModel ? 'text-[hsl(var(--node-video))]' : 'text-foreground'
                }`}
              >
                <div className="min-w-0">
                  <div className="truncate">{m.name}</div>
                  <div className="truncate text-[9px] text-muted-foreground/70">{m.provider}</div>
                </div>
                {m.id === selectedModel && <span className="ml-1 shrink-0">✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 提示词输入 */}
      <div className="flex flex-1 items-center gap-2 min-w-0">
        <input
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入提示词，Ctrl+Enter 生成..."
          className="flex-1 min-w-0 rounded-sm border border-input bg-input/50 px-3 py-1.5 text-[12px] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />

        {/* 自动优化开关 */}
        {genType === 'image' && (
          <button
            onClick={() => setIsAutoOptimize(!isAutoOptimize)}
            className={`flex shrink-0 items-center gap-1 rounded-sm px-2 py-1.5 text-[11px] transition-colors border ${
              isAutoOptimize 
                ? 'border-primary bg-primary/10 text-primary' 
                : 'border-transparent text-muted-foreground hover:bg-accent'
            }`}
            title="使用 SCULPT 专家框架进行自动静默提示词扩写"
          >
            <Wand2 size={12} />
            自动优化
          </button>
        )}

        {/* 生成按钮 */}
        <button
          onClick={handleGenerate}
          disabled={isRunning}
          className="flex shrink-0 items-center gap-1.5 rounded-sm bg-primary px-3 py-1.5 text-[12px] font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-70"
        >
          {isRunning ? (
            <>
              <Loader2 size={12} className="animate-spin" />
              <span className="hidden md:block">{activeCount} 进行中</span>
            </>
          ) : (
            <>
              <Play size={12} />
              <span className="hidden md:block">生成</span>
            </>
          )}
        </button>
      </div>

      {/* 右侧工具按钮 */}
      <div className="flex items-center gap-1 ml-1 shrink-0">
        <button
          onClick={() => setCmdKOpen(true)}
          className="flex items-center gap-1 rounded-sm px-2 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          title="命令面板 (Ctrl+K)"
        >
          <Command size={13} />
        </button>
        <button
          onClick={() => setHistoryPanelOpen(true)}
          className="flex items-center gap-1 rounded-sm px-2 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          title="历史记录 (Ctrl+H)"
        >
          <Clock size={13} />
        </button>
        <button
          onClick={() => setStoryboardPanelOpen(true)}
          className="flex items-center gap-1 rounded-sm px-2 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          title="分镜系统"
        >
          <Film size={13} />
        </button>
        <button
          onClick={() => setChatDrawerOpen(true)}
          className="flex items-center gap-1 rounded-sm px-2 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          title="AI 对话"
        >
          <MessageSquare size={13} />
        </button>
        <div className="h-4 w-px bg-border mx-1" />
        <button
          onClick={() => setSettingsOpen(true)}
          className="flex items-center gap-1 rounded-sm px-2 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          title="设置"
        >
          <Settings size={13} />
          {!apiKey && (
            <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--status-warning))]" />
          )}
        </button>
      </div>
    </header>
  );
}
