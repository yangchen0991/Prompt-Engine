import React, { useState } from 'react';
import { useUIStore } from '@/stores/uiStore';
import { X, Film, Lock, Play, Loader2 } from 'lucide-react';

interface StoryboardFrame {
  id: string;
  description: string;
  resultUrl?: string;
}

const INITIAL_FRAMES: StoryboardFrame[] = Array.from({ length: 6 }, (_, i) => ({
  id: `frame-${i + 1}`,
  description: '',
}));

export default function StoryboardPanel() {
  const { storyboardPanelOpen, setStoryboardPanelOpen } = useUIStore();
  const [frames, setFrames] = useState<StoryboardFrame[]>(INITIAL_FRAMES);
  const [globalChar, setGlobalChar] = useState('');
  const [globalScene, setGlobalScene] = useState('');
  const [globalStyle, setGlobalStyle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!storyboardPanelOpen) return null;

  const updateFrame = (id: string, description: string) => {
    setFrames(fs => fs.map(f => f.id === id ? { ...f, description } : f));
  };

  const handleGenerateAll = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 3000);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex flex-col border-t border-border bg-card" style={{ height: '55vh' }}>
      {/* 头部 */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <div className="flex items-center gap-2">
          <Film size={14} className="text-primary" />
          <span className="text-sm font-medium text-foreground">分镜系统</span>
          <span className="rounded-sm bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">6 镜</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleGenerateAll}
            disabled={isGenerating}
            className="flex items-center gap-1.5 rounded-sm bg-primary px-3 py-1.5 text-[12px] text-primary-foreground disabled:opacity-50 hover:bg-primary/90"
          >
            {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} />}
            全部生成
          </button>
          <button onClick={() => setStoryboardPanelOpen(false)} className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground">
            <X size={14} />
          </button>
        </div>
      </div>

      {/* 全局参数 */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-2">
        <Lock size={11} className="text-muted-foreground shrink-0" />
        <span className="text-[11px] text-muted-foreground shrink-0">全局锁定</span>
        {[
          { label: '角色', value: globalChar, onChange: setGlobalChar },
          { label: '场景', value: globalScene, onChange: setGlobalScene },
          { label: '风格', value: globalStyle, onChange: setGlobalStyle },
        ].map(field => (
          <div key={field.label} className="flex items-center gap-1.5">
            <span className="text-[11px] text-muted-foreground">{field.label}</span>
            <input
              value={field.value}
              onChange={e => field.onChange(e.target.value)}
              placeholder="留空不锁定"
              className="w-24 rounded-sm border border-input bg-input/50 px-2 py-0.5 text-[11px] text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
            />
          </div>
        ))}
      </div>

      {/* 分镜网格 */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex h-full gap-2 p-3">
          {frames.map((frame, idx) => (
            <div key={frame.id} className="flex h-full w-48 shrink-0 flex-col gap-1.5 rounded-sm border border-border bg-muted/30 p-2">
              {/* 帧头部 */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-muted-foreground">镜 {idx + 1}</span>
                {isGenerating && (
                  <Loader2 size={10} className="animate-spin text-primary" />
                )}
              </div>

              {/* 预览区 */}
              <div className="flex-1 overflow-hidden rounded-sm bg-muted">
                {frame.resultUrl ? (
                  <img src={frame.resultUrl} alt={`镜头 ${idx + 1}`} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Film size={20} className="text-border" />
                  </div>
                )}
              </div>

              {/* 描述输入 */}
              <textarea
                value={frame.description}
                onChange={e => updateFrame(frame.id, e.target.value)}
                placeholder={`镜头 ${idx + 1} 描述...`}
                className="resize-none rounded-sm border border-input bg-input/50 px-1.5 py-1 text-[11px] text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none"
                rows={2}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
