import React, { useEffect, useRef } from 'react';
import { useFlowStore } from '@/stores/flowStore';
import type { NodeType } from '@/types/index';
import { Type, Image, Video, FileImage, User, Trash2, AlignJustify } from 'lucide-react';

interface Props {
  x: number;
  y: number;
  flowX: number;
  flowY: number;
  onClose: () => void;
}

const MENU_ITEMS = [
  { label: '文本节点', icon: Type, type: 'textNode' as NodeType },
  { label: '图片生成', icon: Image, type: 'genImageNode' as NodeType },
  { label: '视频生成', icon: Video, type: 'genVideoNode' as NodeType },
  { label: '图片输入', icon: FileImage, type: 'inputImageNode' as NodeType },
  { label: '角色控制板', icon: User, type: 'cidBoardNode' as NodeType },
];

export default function CanvasContextMenu({ x, y, flowX, flowY, onClose }: Props) {
  const addNode = useFlowStore(s => s.addNode);
  const clearCanvas = useFlowStore(s => s.clearCanvas);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const handleAdd = (type: NodeType) => {
    addNode(type, { x: flowX, y: flowY });
    onClose();
  };

  const handleClear = () => {
    if (window.confirm('确认清空画布？')) {
      clearCanvas();
    }
    onClose();
  };

  // 防止菜单超出视窗右侧
  const style: React.CSSProperties = {
    left: Math.min(x, window.innerWidth - 180),
    top: Math.min(y, window.innerHeight - 300),
  };

  return (
    <div
      ref={ref}
      style={style}
      className="fixed z-50 w-44 overflow-hidden rounded-sm border border-border bg-card shadow-lg"
    >
      <div className="px-3 py-1.5">
        <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">添加节点</p>
      </div>
      <div className="border-t border-border">
        {MENU_ITEMS.map(item => (
          <button
            key={item.type}
            onClick={() => handleAdd(item.type)}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[12px] text-foreground transition-colors hover:bg-accent"
          >
            <item.icon size={13} className="text-muted-foreground shrink-0" />
            {item.label}
          </button>
        ))}
      </div>
      <div className="border-t border-border">
        <button
          onClick={handleClear}
          className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[12px] text-destructive transition-colors hover:bg-destructive/10"
        >
          <Trash2 size={13} className="shrink-0" />
          清空画布
        </button>
      </div>
    </div>
  );
}
