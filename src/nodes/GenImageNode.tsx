import React, { memo, useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import type { GenImageNodeData } from '@/types/index';
import { useFlowStore } from '@/stores/flowStore';
import { useGenerationStore } from '@/stores/generationStore';
import { useUIStore } from '@/stores/uiStore';
import { useCameraStore } from '@/stores/cameraStore';
import { useCameraInjectionStore, buildInjectionText } from '@/stores/cameraInjectionStore';
import { IMAGE_MODELS } from '@/lib/models';
import {
  Image,
  Play,
  Loader2,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Download,
  Layers,
  Camera,
  Zap,
} from 'lucide-react';

const GenImageNode = memo(({ id, data, selected }: NodeProps<GenImageNodeData>) => {
  const updateNodeData = useFlowStore(s => s.updateNodeData);
  const submitTask = useGenerationStore(s => s.submitTask);
  const setSelectedNodeId = useUIStore(s => s.setSelectedNodeId);
  const setRightDockTab = useUIStore(s => s.setRightDockTab);
  const { currentParams, selectedPresetId } = useCameraStore();
  const { config: injConfig } = useCameraInjectionStore();

  // 是否启用注入（全局开关 + 作用域匹配）
  const injectionActive = injConfig.enabled && (
    injConfig.scope === 'all' || injConfig.scope === 'selected'
  );

  const handleGenerate = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    let fullPrompt = data.prompt ?? '';
    if (injectionActive) {
      const cameraText = buildInjectionText(currentParams, injConfig.fields, injConfig.template);
      if (cameraText) {
        fullPrompt = fullPrompt ? `${fullPrompt.trim()}, ${cameraText}` : cameraText;
      }
    }
    await submitTask({
      nodeId: id,
      prompt: fullPrompt || '高质量图片',
      model: data.model,
      type: 'image',
    });
  }, [id, data.prompt, data.model, currentParams, injConfig, injectionActive, submitTask]);

  const handleOpenCamera = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedNodeId(id);
    setRightDockTab('camera');
  }, [id, setSelectedNodeId, setRightDockTab]);

  const isRunning = data.status === 'SUBMITTING' || data.status === 'POLLING';
  const isDone = data.status === 'DONE';
  const isFailed = data.status === 'FAILED';

  const getStatusColor = () => {
    if (isRunning) return 'border-primary node-running shadow-[0_0_0_1px_hsl(var(--primary))]';
    if (isDone) return 'border-[hsl(var(--status-success))] shadow-[0_0_0_1px_hsl(var(--status-success))]';
    if (isFailed) return 'border-destructive shadow-[0_0_0_1px_hsl(var(--status-error))]';
    if (selected) return 'border-primary shadow-[0_0_0_1px_hsl(var(--primary))]';
    return 'border-border';
  };

  return (
    <div
      className={`w-[280px] rounded-sm border bg-card transition-colors ${getStatusColor()}`}
      onClick={() => setSelectedNodeId(id)}
    >
      {/* 顶部指示条 */}
      <div className="h-[2px] w-full rounded-t-sm bg-[hsl(var(--node-image))]" />

      {/* 节点头部 */}
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-1.5">
          <Image size={12} className="text-[hsl(var(--node-image))] shrink-0" />
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">图片生成</span>
        </div>
        <div className="flex items-center gap-1">
          {/* 摄影机注入状态徽标 */}
          {injectionActive && (
            <div
              className="flex items-center gap-0.5 rounded-sm bg-primary/15 border border-primary/30 px-1.5 py-0.5"
              title="摄影机参数注入已启用"
            >
              <Zap size={8} className="text-primary shrink-0" />
              <span className="text-[9px] font-medium text-primary">摄影机已注入</span>
            </div>
          )}
          {/* 摄影机按钮 */}
          <button
            onClick={handleOpenCamera}
            className="nodrag flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            title={`摄影机: ${selectedPresetId}`}
          >
            <Camera size={10} />
            <span className="max-w-[60px] truncate">{selectedPresetId}</span>
          </button>
          {/* 状态图标 */}
          {isRunning && <Loader2 size={12} className="text-primary animate-spin" />}
          {isDone && <CheckCircle2 size={12} className="text-[hsl(var(--status-success))]" />}
          {isFailed && <XCircle size={12} className="text-destructive" />}
        </div>
      </div>

      {/* 图片预览区 */}
      <div className="mx-3 mb-2 aspect-square overflow-hidden rounded-sm border border-border bg-muted relative">
        {isDone && data.resultUrl ? (
          <img src={data.resultUrl} alt="生成结果" className="w-full h-full object-cover" />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2">
            {isRunning ? (
              <>
                <Loader2 size={24} className="text-primary animate-spin" />
                <div className="text-center">
                  <p className="text-[11px] text-muted-foreground">生成中...</p>
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
                <Image size={32} className="text-border" />
                <p className="text-[11px] text-muted-foreground">点击生成</p>
              </>
            )}
          </div>
        )}
      </div>

      {/* 提示词输入 */}
      <div className="px-3 pb-2">
        <textarea
          value={data.prompt}
          onChange={e => updateNodeData(id, { prompt: e.target.value })}
          placeholder="输入提示词..."
          className="nodrag w-full resize-none rounded-sm border border-input bg-input/50 px-2 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          rows={2}
          onClick={e => e.stopPropagation()}
        />
      </div>

      {/* 模型选择 */}
      <div className="px-3 pb-2">
        <select
          value={data.model}
          onChange={e => updateNodeData(id, { model: e.target.value })}
          className="nodrag w-full rounded-sm border border-input bg-input/50 px-2 py-1 text-[11px] text-foreground focus:border-primary focus:outline-none"
          onClick={e => e.stopPropagation()}
        >
          {IMAGE_MODELS.map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </div>

      {/* 操作按钮 */}
      <div className="flex items-center gap-1 px-3 pb-3">
        <button
          onClick={handleGenerate}
          disabled={isRunning}
          className="nodrag flex flex-1 items-center justify-center gap-1.5 rounded-sm bg-primary px-3 py-1.5 text-[11px] font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRunning ? <Loader2 size={11} className="animate-spin" /> : <Play size={11} />}
          {isRunning ? `${data.progress}%` : '生成'}
        </button>
        {isFailed && (
          <button
            onClick={e => { e.stopPropagation(); handleGenerate(e); }}
            className="nodrag flex items-center justify-center rounded-sm border border-border bg-muted p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <RotateCcw size={11} />
          </button>
        )}
        {isDone && data.resultUrl && (
          <>
            <button
              onClick={e => { e.stopPropagation(); window.open(data.resultUrl, '_blank'); }}
              className="nodrag flex items-center justify-center rounded-sm border border-border bg-muted p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              title="下载"
            >
              <Download size={11} />
            </button>
            <button
              onClick={e => { e.stopPropagation(); handleGenerate(e); }}
              className="nodrag flex items-center justify-center rounded-sm border border-border bg-muted p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              title="变体"
            >
              <Layers size={11} />
            </button>
          </>
        )}
      </div>

      {/* 端口 */}
      <Handle type="target" position={Position.Left} id="text-in" style={{ top: '30%' }} />
      <Handle type="target" position={Position.Left} id="image-in" style={{ top: '60%' }} />
      <Handle type="source" position={Position.Right} id="image-out" />
    </div>
  );
});

GenImageNode.displayName = 'GenImageNode';
export default GenImageNode;
