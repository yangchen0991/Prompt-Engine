import React from 'react';
import { useUIStore } from '@/stores/uiStore';
import { useFlowStore } from '@/stores/flowStore';
import { useCameraStore } from '@/stores/cameraStore';
import { useCameraInjectionStore, buildInjectionText } from '@/stores/cameraInjectionStore';
import { DEFAULT_CAMERA_PARAMS } from '@/lib/cameraPresets';
import {
  X, MessageSquare, Camera, Image, Clock,
  Type, Video, FileImage, User2, ChevronDown, Zap,
} from 'lucide-react';
import CameraPanel from './CameraPanel';
import ResultsPanel from './ResultsPanel';
import HistoryPanel from './HistoryPanel';
import { IMAGE_MODELS, VIDEO_MODELS, CHAT_MODELS } from '@/lib/models';

const TABS = [
  { id: 'prompt' as const, label: '属性', icon: MessageSquare },
  { id: 'camera' as const, label: '摄影机', icon: Camera },
  { id: 'results' as const, label: '结果', icon: Image },
  { id: 'history' as const, label: '历史', icon: Clock },
];

// 节点类型显示配置
const NODE_TYPE_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string; cssVar: string }> = {
  textNode:      { label: '文本节点',   icon: Type,      color: 'text-[hsl(var(--node-text))]',    cssVar: '--node-text' },
  genImageNode:  { label: '图片生成',   icon: Image,     color: 'text-[hsl(var(--node-image))]',   cssVar: '--node-image' },
  genVideoNode:  { label: '视频生成',   icon: Video,     color: 'text-[hsl(var(--node-video))]',   cssVar: '--node-video' },
  inputImageNode:{ label: '图片输入',   icon: FileImage, color: 'text-[hsl(var(--node-input))]',   cssVar: '--node-input' },
  cidBoardNode:  { label: 'CID 人物板', icon: User2,     color: 'text-[hsl(var(--node-cid))]',     cssVar: '--node-cid' },
};

export default function RightDock() {
  const { rightDockOpen, rightDockTab, selectedNodeId, setRightDockOpen, setRightDockTab } = useUIStore();
  const nodes = useFlowStore(s => s.nodes);
  const updateNodeData = useFlowStore(s => s.updateNodeData);

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  if (!rightDockOpen) return null;

  const typeConfig = selectedNode ? (NODE_TYPE_CONFIG[selectedNode.type ?? ''] ?? null) : null;

  return (
    <div className="flex h-full w-72 shrink-0 flex-col border-l border-border bg-card">
      {/* 头部：节点类型 + 关闭 */}
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <div className="flex items-center gap-2 min-w-0">
          {typeConfig ? (
            <>
              {/* 节点色块指示 */}
              <span
                className="inline-block h-2.5 w-1 shrink-0 rounded-sm"
                style={{ background: `hsl(var(${typeConfig.cssVar}))` }}
              />
              <typeConfig.icon size={12} className={`shrink-0 ${typeConfig.color}`} />
              <span className="truncate text-[11px] font-medium text-foreground">{typeConfig.label}</span>
              <span className="truncate text-[10px] text-muted-foreground/60 font-mono">#{selectedNode!.id}</span>
            </>
          ) : (
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">属性面板</span>
          )}
        </div>
        <button
          onClick={() => setRightDockOpen(false)}
          className="ml-1 shrink-0 rounded p-0.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <X size={13} />
        </button>
      </div>

      {/* Tab 切换 */}
      <div className="flex border-b border-border">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setRightDockTab(tab.id)}
            className={`flex flex-1 flex-col items-center gap-0.5 px-1 py-2 text-[10px] transition-colors ${
              rightDockTab === tab.id
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <tab.icon size={12} />
            <span className="hidden sm:block">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab 内容区 */}
      <div className="flex-1 overflow-y-auto">
        {rightDockTab === 'prompt' && (
          <PromptTab node={selectedNode} updateNodeData={updateNodeData} />
        )}
        {rightDockTab === 'camera' && <CameraPanel />}
        {rightDockTab === 'results' && <ResultsPanel nodeId={selectedNodeId} />}
        {rightDockTab === 'history' && <HistoryPanel embedded />}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// 属性 Tab — 按节点类型展示不同内容
// ──────────────────────────────────────────────────────────
function PromptTab({ node, updateNodeData }: {
  node: any;
  updateNodeData: (id: string, data: any) => void;
}) {
  if (!node) {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-3 p-4 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-border bg-secondary/50">
          <MessageSquare size={18} className="text-border" />
        </div>
        <div>
          <p className="text-[12px] font-medium text-muted-foreground">未选中节点</p>
          <p className="mt-1 text-[11px] text-muted-foreground/60">点击画布中的节点来编辑属性</p>
        </div>
      </div>
    );
  }

  // 根据节点类型渲染
  switch (node.type) {
    case 'textNode':
      return <TextNodePanel node={node} updateNodeData={updateNodeData} />;
    case 'genImageNode':
      return <GenImagePanel node={node} updateNodeData={updateNodeData} />;
    case 'genVideoNode':
      return <GenVideoPanel node={node} updateNodeData={updateNodeData} />;
    case 'inputImageNode':
      return <InputImagePanel node={node} />;
    case 'cidBoardNode':
      return <CIDBoardPanel node={node} />;
    default:
      return (
        <div className="p-3">
          <p className="text-[11px] text-muted-foreground">此节点类型暂无可编辑属性</p>
        </div>
      );
  }
}

// ── 文本节点面板 ──────────────────────────────────────────
function TextNodePanel({ node, updateNodeData }: { node: any; updateNodeData: (id: string, data: any) => void }) {
  return (
    <div className="p-3 space-y-3">
      <SectionLabel>提示词文本</SectionLabel>
      <textarea
        value={node.data?.text ?? ''}
        onChange={e => updateNodeData(node.id, { text: e.target.value })}
        className="w-full resize-none rounded-sm border border-input bg-input/50 px-2 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        rows={10}
        placeholder="输入提示词文本..."
      />
      <CharCount n={(node.data?.text ?? '').length} />
    </div>
  );
}

// ── 图片生成节点面板 ──────────────────────────────────────
function GenImagePanel({ node, updateNodeData }: { node: any; updateNodeData: (id: string, data: any) => void }) {
  const { currentParams } = useCameraStore();
  const { config: injConfig, setEnabled } = useCameraInjectionStore();
  const safeParams = { ...DEFAULT_CAMERA_PARAMS, ...currentParams };
  const injectionText = buildInjectionText(safeParams, injConfig.fields, injConfig.template);

  return (
    <div className="p-3 space-y-3">
      {/* 状态徽标 */}
      <StatusBadge status={node.data?.status} progress={node.data?.progress} />

      {/* 模型选择 */}
      <div>
        <SectionLabel>生成模型</SectionLabel>
        <ModelSelect
          value={node.data?.model ?? ''}
          models={IMAGE_MODELS}
          onChange={v => updateNodeData(node.id, { model: v })}
        />
      </div>

      {/* 提示词 */}
      <div>
        <SectionLabel>提示词</SectionLabel>
        <textarea
          value={node.data?.prompt ?? ''}
          onChange={e => updateNodeData(node.id, { prompt: e.target.value })}
          className="w-full resize-none rounded-sm border border-input bg-input/50 px-2 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          rows={8}
          placeholder="输入图片生成提示词..."
        />
        <CharCount n={(node.data?.prompt ?? '').length} />
      </div>

      {/* 摄影机注入预览 */}
      <div className={`rounded-sm border transition-colors ${injConfig.enabled ? 'border-primary/30 bg-primary/5' : 'border-border bg-secondary/20'}`}>
        <div className="flex items-center justify-between px-2.5 py-2">
          <div className="flex items-center gap-1.5">
            <Zap size={10} className={injConfig.enabled ? 'text-primary' : 'text-muted-foreground/40'} />
            <span className="text-[10px] font-medium text-muted-foreground">摄影机注入</span>
          </div>
          <button
            onClick={() => setEnabled(!injConfig.enabled)}
            className={`relative inline-flex h-3.5 w-6 shrink-0 cursor-pointer items-center rounded-full border-2 transition-colors ${
              injConfig.enabled ? 'border-primary bg-primary' : 'border-border bg-secondary'
            }`}
            role="switch"
            aria-checked={injConfig.enabled}
          >
            <span className={`inline-block h-2 w-2 rounded-full bg-white shadow-sm transition-transform ${injConfig.enabled ? 'translate-x-2.5' : 'translate-x-0'}`} />
          </button>
        </div>
        {injConfig.enabled && (
          <div className="border-t border-primary/20 px-2.5 pb-2 pt-1.5">
            {injectionText ? (
              <p className="font-mono text-[10px] text-foreground/70 leading-relaxed break-words">
                {injectionText}
              </p>
            ) : (
              <p className="text-[10px] text-muted-foreground/40 italic">
                前往摄影机面板勾选要注入的参数
              </p>
            )}
          </div>
        )}
      </div>

      {/* 结果预览 */}
      {node.data?.resultUrl && (
        <div>
          <SectionLabel>最新结果</SectionLabel>
          <a href={node.data.resultUrl} target="_blank" rel="noreferrer" className="block">
            <img
              src={node.data.resultUrl}
              alt="生成结果"
              className="w-full rounded-sm border border-border object-cover transition-opacity hover:opacity-90"
              style={{ maxHeight: 160 }}
            />
          </a>
        </div>
      )}
    </div>
  );
}

// ── 视频生成节点面板 ──────────────────────────────────────
function GenVideoPanel({ node, updateNodeData }: { node: any; updateNodeData: (id: string, data: any) => void }) {
  return (
    <div className="p-3 space-y-3">
      <StatusBadge status={node.data?.status} progress={node.data?.progress} />

      <div>
        <SectionLabel>生成模型</SectionLabel>
        <ModelSelect
          value={node.data?.model ?? ''}
          models={VIDEO_MODELS}
          onChange={v => updateNodeData(node.id, { model: v })}
        />
      </div>

      <div>
        <SectionLabel>提示词</SectionLabel>
        <textarea
          value={node.data?.prompt ?? ''}
          onChange={e => updateNodeData(node.id, { prompt: e.target.value })}
          className="w-full resize-none rounded-sm border border-input bg-input/50 px-2 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          rows={8}
          placeholder="输入视频生成提示词..."
        />
        <CharCount n={(node.data?.prompt ?? '').length} />
      </div>

      {node.data?.resultUrl && (
        <div>
          <SectionLabel>最新结果</SectionLabel>
          <a href={node.data.resultUrl} target="_blank" rel="noreferrer" className="block">
            <video
              src={node.data.resultUrl}
              controls
              className="w-full rounded-sm border border-border"
              style={{ maxHeight: 160 }}
            />
          </a>
        </div>
      )}
    </div>
  );
}

// ── 图片输入节点面板 ──────────────────────────────────────
function InputImagePanel({ node }: { node: any }) {
  return (
    <div className="p-3 space-y-3">
      <SectionLabel>图片输入节点</SectionLabel>
      {node.data?.imageUrl ? (
        <div>
          <img
            src={node.data.imageUrl}
            alt={node.data.fileName ?? '参考图'}
            className="w-full rounded-sm border border-border object-cover"
            style={{ maxHeight: 180 }}
          />
          <p className="mt-1.5 text-[10px] text-muted-foreground truncate">
            {node.data.fileName ?? '已上传图片'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-24 gap-1.5 rounded-sm border border-dashed border-border bg-secondary/30">
          <FileImage size={16} className="text-muted-foreground/40" />
          <p className="text-[10px] text-muted-foreground/60">在节点上拖放图片以上传</p>
        </div>
      )}
      <InfoRow label="节点 ID" value={node.id} />
    </div>
  );
}

// ── CID 人物板面板 ────────────────────────────────────────
function CIDBoardPanel({ node }: { node: any }) {
  const d = node.data ?? {};
  const fields: [string, string][] = [
    ['性别', d.gender], ['年龄', d.age], ['族裔', d.ethnicity],
    ['体型', d.bodyType], ['发型', d.hairStyle], ['发色', d.hairColor],
    ['眼型', d.eyeType], ['脸型', d.faceShape], ['肤色', d.skinTone],
    ['服装', d.clothingStyle], ['姿势', d.pose], ['表情', d.expression],
    ['视角', d.viewAngle],
  ];
  return (
    <div className="p-3 space-y-3">
      <SectionLabel>CID 人物参数</SectionLabel>
      <div className="space-y-1.5 rounded-sm border border-border bg-secondary/20 px-3 py-2">
        {fields.map(([label, val]) => val ? (
          <div key={label} className="flex items-center justify-between gap-2">
            <span className="text-[10px] text-muted-foreground shrink-0">{label}</span>
            <span className="text-[10px] text-foreground truncate">{val}</span>
          </div>
        ) : null)}
        {d.temperament?.length > 0 && (
          <div className="flex items-start justify-between gap-2">
            <span className="text-[10px] text-muted-foreground shrink-0">气质</span>
            <span className="text-[10px] text-foreground text-right">{(d.temperament as string[]).join(', ')}</span>
          </div>
        )}
      </div>
      <InfoRow label="节点 ID" value={node.id} />
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// 子组件
// ──────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{children}</p>;
}

function CharCount({ n }: { n: number }) {
  return <p className="text-[10px] text-muted-foreground/60 text-right">{n} 字符</p>;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-[10px] text-muted-foreground shrink-0">{label}</span>
      <span className="text-[10px] text-muted-foreground/60 font-mono truncate">{value}</span>
    </div>
  );
}

function StatusBadge({ status, progress }: { status?: string; progress?: number }) {
  if (!status || status === 'IDLE') return null;
  const cfg: Record<string, { label: string; cls: string }> = {
    SUBMITTING: { label: '提交中', cls: 'bg-primary/10 text-primary' },
    POLLING:    { label: `生成中 ${progress ?? 0}%`, cls: 'bg-primary/10 text-primary' },
    DONE:       { label: '已完成', cls: 'bg-[hsl(var(--status-success))]/10 text-[hsl(var(--status-success))]' },
    FAILED:     { label: '生成失败', cls: 'bg-destructive/10 text-destructive' },
    CANCELLED:  { label: '已取消', cls: 'bg-muted text-muted-foreground' },
  };
  const c = cfg[status];
  if (!c) return null;
  return (
    <div className={`flex items-center gap-1.5 rounded-sm px-2 py-1 text-[10px] font-medium ${c.cls}`}>
      {(status === 'SUBMITTING' || status === 'POLLING') && (
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-current node-running" />
      )}
      {c.label}
    </div>
  );
}

function ModelSelect({ value, models, onChange }: {
  value: string;
  models: { id: string; name: string; provider: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full appearance-none rounded-sm border border-input bg-input/50 px-2 py-1.5 pr-7 text-[11px] text-foreground focus:border-primary focus:outline-none"
      >
        {models.map(m => (
          <option key={m.id} value={m.id}>{m.name}</option>
        ))}
      </select>
      <ChevronDown size={11} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}
