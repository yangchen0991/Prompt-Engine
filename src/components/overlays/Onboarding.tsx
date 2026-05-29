import React, { useEffect } from 'react';
import { useUIStore } from '@/stores/uiStore';
import { useFlowStore } from '@/stores/flowStore';
import { Sparkles, User, Film, Layers, ArrowRight, Zap, Network, Play } from 'lucide-react';
import type { Node, Edge } from 'reactflow';

interface Template {
  id: 'character' | 'storyboard' | 'style-transfer';
  label: string;
  desc: string;
  badge: string;
  icon: React.ElementType;
  nodes: Partial<Node>[];
  edges: Edge[];
}

const TEMPLATES: Template[] = [
  {
    id: 'character',
    label: '角色设计',
    badge: '入门推荐',
    desc: '输入文字描述，生成角色原画',
    icon: User,
    nodes: [
      { id: 'text-1', type: 'textNode', position: { x: 80, y: 200 }, data: { text: '一个赛博朋克风格的女性角色，短发，蓝眼睛，穿着发光的未来感外套' } },
      { id: 'img-1', type: 'genImageNode', position: { x: 420, y: 160 }, data: { prompt: '', model: 'seedream-5.0-lite', status: 'IDLE', progress: 0 } },
    ],
    edges: [{ id: 'e1', source: 'text-1', sourceHandle: 'text-out', target: 'img-1', targetHandle: 'text-in' }],
  },
  {
    id: 'storyboard',
    label: '短片分镜',
    badge: '多节点',
    desc: '一次创建多帧分镜，批量生成',
    icon: Film,
    nodes: [
      { id: 'text-1', type: 'textNode', position: { x: 80, y: 200 }, data: { text: '科幻短片：宇航员在月球表面发现神秘遗迹' } },
      { id: 'img-1', type: 'genImageNode', position: { x: 420, y: 80 }, data: { prompt: '镜头1: 宇航员走向月球地表', model: 'seedream-5.0-lite', status: 'IDLE', progress: 0 } },
      { id: 'img-2', type: 'genImageNode', position: { x: 420, y: 420 }, data: { prompt: '镜头2: 发现神秘发光建筑', model: 'seedream-5.0-lite', status: 'IDLE', progress: 0 } },
    ],
    edges: [
      { id: 'e1', source: 'text-1', sourceHandle: 'text-out', target: 'img-1', targetHandle: 'text-in' },
      { id: 'e2', source: 'text-1', sourceHandle: 'text-out', target: 'img-2', targetHandle: 'text-in' },
    ],
  },
  {
    id: 'style-transfer',
    label: '风格迁移',
    badge: '多模态',
    desc: '上传参考图，生成同风格作品',
    icon: Layers,
    nodes: [
      { id: 'input-1', type: 'inputImageNode', position: { x: 80, y: 160 }, data: {} },
      { id: 'text-1', type: 'textNode', position: { x: 80, y: 420 }, data: { text: '将上方参考图的风格迁移到：一片宁静的竹林' } },
      { id: 'img-1', type: 'genImageNode', position: { x: 440, y: 280 }, data: { prompt: '', model: 'seedream-5.0-lite', status: 'IDLE', progress: 0 } },
    ],
    edges: [
      { id: 'e1', source: 'input-1', sourceHandle: 'image-out', target: 'img-1', targetHandle: 'image-in' },
      { id: 'e2', source: 'text-1', sourceHandle: 'text-out', target: 'img-1', targetHandle: 'text-in' },
    ],
  },
];

const FEATURES = [
  { icon: Network, text: '可视化节点编排，直观连接 AI 模型' },
  { icon: Zap, text: '支持图片、视频、对话三类生成节点' },
  { icon: Play, text: '批量并发生成，摄影机参数精准控制' },
];

export default function Onboarding() {
  const { completeOnboarding, setSelectedNodeId } = useUIStore();
  const { setNodes, setEdges } = useFlowStore();

  const [show, setShow] = React.useState(() => {
    return localStorage.getItem('onboarding_completed') !== 'true';
  });

  // 启动时检测独立 localStorage key
  useEffect(() => {
    if (localStorage.getItem('onboarding_completed') === 'true') {
      completeOnboarding();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!show) return null;

  const handleSelectTemplate = (template: Template) => {
    setNodes(template.nodes as Node[]);
    setEdges(template.edges);
    completeOnboarding();
    setShow(false);
    const firstImg = template.nodes.find(n => n.type === 'genImageNode');
    if (firstImg?.id) setSelectedNodeId(firstImg.id);
  };

  const handleSkip = () => {
    completeOnboarding();
    setShow(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[hsl(var(--canvas-bg))]/95 backdrop-blur-sm px-4">
      <div className="w-full max-w-2xl">
        {/* 品牌区 */}
        <div className="mb-8 text-center">
          <div className="mb-3 flex items-center justify-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-sm border border-primary/30 bg-primary/10">
              <Sparkles size={18} className="text-primary" />
            </div>
            <h1 className="text-2xl font-bold gradient-text tracking-tight">提示词，即是画笔</h1>
          </div>
          <p className="text-sm text-muted-foreground">绘词引擎 V2 · 可视化 AI 工作流创作平台</p>

          {/* 特性列表 */}
          <div className="mt-4 flex flex-col items-center gap-1.5 sm:flex-row sm:justify-center sm:gap-4">
            {FEATURES.map((f, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[11px] text-muted-foreground/70">
                <f.icon size={11} className="shrink-0 text-primary/60" />
                <span>{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 模板选择 */}
        <div className="mb-5">
          <p className="mb-3 text-center text-[12px] font-medium text-muted-foreground uppercase tracking-wider">
            选择模板快速开始
          </p>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            {TEMPLATES.map(t => (
              <button
                key={t.id}
                onClick={() => handleSelectTemplate(t)}
                className="group relative flex flex-col gap-3 rounded-sm border border-border bg-card/80 p-4 text-left transition-all duration-150 hover:border-primary/60 hover:bg-accent active:scale-[0.98]"
              >
                {/* 角标 */}
                <span className="absolute right-3 top-3 rounded-sm bg-primary/10 px-1.5 py-0.5 text-[9px] font-medium text-primary/80 uppercase tracking-wide">
                  {t.badge}
                </span>

                {/* 图标 */}
                <div className="flex h-8 w-8 items-center justify-center rounded-sm border border-border bg-secondary/60 text-muted-foreground transition-colors group-hover:border-primary/40 group-hover:text-primary">
                  <t.icon size={15} />
                </div>

                {/* 文字 */}
                <div>
                  <p className="text-sm font-medium text-foreground text-balance">{t.label}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground leading-relaxed">{t.desc}</p>
                </div>

                {/* 箭头 */}
                <ArrowRight
                  size={13}
                  className="mt-auto self-end text-muted-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:text-primary/60"
                />
              </button>
            ))}
          </div>
        </div>

        {/* 分割线 + 跳过 */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <button
            onClick={handleSkip}
            className="flex items-center gap-1.5 text-[12px] text-muted-foreground/60 transition-colors hover:text-muted-foreground"
          >
            跳过，从空白画布开始
          </button>
          <div className="h-px flex-1 bg-border" />
        </div>
      </div>
    </div>
  );
}
