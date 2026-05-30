import React, { memo, useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import type { GenVideoNodeData } from '@/types/index';
import { useFlowStore } from '@/stores/flowStore';
import { useGenerationStore } from '@/stores/generationStore';
import { useUIStore } from '@/stores/uiStore';
import { VIDEO_MODELS } from '@/lib/models';
import {
  Video,
  Play,
  Loader2,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Download,
} from 'lucide-react';

const GenVideoNode = memo(({ id, data, selected }: NodeProps<GenVideoNodeData>) => {
  const updateNodeData = useFlowStore(s => s.updateNodeData);
  const submitTask = useGenerationStore(s => s.submitTask);
  const setSelectedNodeId = useUIStore(s => s.setSelectedNodeId);

  const handleGenerate = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    await submitTask({ nodeId: id, prompt: data.prompt || '高质量视频', model: data.model, type: 'video' });
  }, [id, data.prompt, data.model, submitTask]);

  const isRunning = data.status === 'SUBMITTING' || data.status === 'POLLING';
  const isDone = data.status === 'DONE';
  const isFailed = data.status === 'FAILED';

  const getBorderClass = () => {
    if (isRunning) return 'border-primary node-running shadow-[0_0_0_1px_hsl(var(--primary))]';
    if (isDone) return 'border-[hsl(var(--status-success))] shadow-[0_0_0_1px_hsl(var(--status-success))]';
    if (isFailed) return 'border-destructive';
    if (selected) return 'border-primary shadow-[0_0_0_1px_hsl(var(--primary))]';
    return 'border-border';
  };

  return (
    <div
      className={`w-[280px] rounded-sm border bg-card transition-colors ${getBorderClass()}`}
      onClick={() => setSelectedNodeId(id)}
    >
      <div className="h-[2px] w-full rounded-t-sm bg-[hsl(var(--node-video))]" />

      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-1.5">
          <Video size={12} className="text-[hsl(var(--node-video))] shrink-0" />
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">视频生成</span>
        </div>
        <div className="flex items-center gap-1">
          {isRunning && <Loader2 size={12} className="text-primary animate-spin" />}
          {isDone && <CheckCircle2 size={12} className="text-[hsl(var(--status-success))]" />}
          {isFailed && <XCircle size={12} className="text-destructive" />}
        </div>
      </div>

      {/* 视频预览区 */}
      <div className="mx-3 mb-2 aspect-video overflow-hidden rounded-sm border border-border bg-muted relative">
        {isDone && data.resultUrl ? (
          <video src={data.resultUrl} controls className="w-full h-full object-cover" />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2">
            {isRunning ? (
              <>
                <Loader2 size={24} className="text-primary animate-spin" />
                <div className="text-center">
                  <p className="text-[11px] text-muted-foreground">视频生成中...</p>
                  <p className="text-[11px] font-medium text-primary">{data.progress}%</p>
                </div>
                <div className="absolute bottom-0 left-0 h-1 bg-primary transition-all duration-300" style={{ width: `${data.progress}%` }} />
              </>
            ) : isFailed ? (
              <>
                <XCircle size={24} className="text-destructive" />
                <p className="text-[11px] text-destructive text-center px-2">{data.errorMessage || '生成失败'}</p>
              </>
            ) : (
              <>
                <Video size={32} className="text-border" />
                <p className="text-[11px] text-muted-foreground">视频预览</p>
              </>
            )}
          </div>
        )}
      </div>

      <div className="px-3 pb-2">
        <textarea
          value={data.prompt}
          onChange={e => updateNodeData(id, { prompt: e.target.value })}
          placeholder="输入视频描述..."
          className="nodrag w-full resize-none rounded-sm border border-input bg-input/50 px-2 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          rows={2}
          onClick={e => e.stopPropagation()}
        />
      </div>

      <div className="px-3 pb-2">
        <select
          value={data.model}
          onChange={e => updateNodeData(id, { model: e.target.value })}
          className="nodrag w-full rounded-sm border border-input bg-input/50 px-2 py-1 text-[11px] text-foreground focus:border-primary focus:outline-none"
          onClick={e => e.stopPropagation()}
        >
          {VIDEO_MODELS.map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-1 px-3 pb-3">
        <button
          onClick={handleGenerate}
          disabled={isRunning}
          className="nodrag flex flex-1 items-center justify-center gap-1.5 rounded-sm bg-primary px-3 py-1.5 text-[11px] font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {isRunning ? <Loader2 size={11} className="animate-spin" /> : <Play size={11} />}
          {isRunning ? `生成中 ${data.progress}%` : '生成视频'}
        </button>
        {isFailed && (
          <button onClick={e => { e.stopPropagation(); handleGenerate(e); }} className="nodrag flex items-center justify-center rounded-sm border border-border bg-muted p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground">
            <RotateCcw size={11} />
          </button>
        )}
        {isDone && data.resultUrl && (
          <button onClick={e => { e.stopPropagation(); window.open(data.resultUrl, '_blank'); }} className="nodrag flex items-center justify-center rounded-sm border border-border bg-muted p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground">
            <Download size={11} />
          </button>
        )}
      </div>

      <Handle type="target" position={Position.Left} id="text-in" style={{ top: '30%' }} />
      <Handle type="target" position={Position.Left} id="image-in" style={{ top: '60%' }} />
      <Handle type="source" position={Position.Right} id="video-out" />
    </div>
  );
});

GenVideoNode.displayName = 'GenVideoNode';
export default GenVideoNode;
