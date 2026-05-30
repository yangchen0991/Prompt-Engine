import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import type { TextNodeData } from '@/types/index';
import { useFlowStore } from '@/stores/flowStore';
import { useUIStore } from '@/stores/uiStore';
import { Type } from 'lucide-react';

const TextNode = memo(({ id, data, selected }: NodeProps<TextNodeData>) => {
  const updateNodeData = useFlowStore(s => s.updateNodeData);
  const setSelectedNodeId = useUIStore(s => s.setSelectedNodeId);

  return (
    <div
      onClick={() => setSelectedNodeId(id)}
      className={`w-[260px] cursor-pointer rounded-sm border bg-card transition-colors ${
        selected ? 'border-primary shadow-[0_0_0_1px_hsl(var(--primary))]' : 'border-border'
      }`}
    >
      {/* 节点顶部指示条 */}
      <div className="h-[2px] w-full rounded-t-sm bg-[hsl(var(--node-text))]" />

      {/* 节点头部 */}
      <div className="flex items-center gap-1.5 px-3 py-2">
        <Type size={12} className="text-[hsl(var(--node-text))] shrink-0" />
        <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">文本节点</span>
      </div>

      <div className="px-3 pb-3">
        <textarea
          value={data.text}
          onChange={e => updateNodeData(id, { text: e.target.value })}
          placeholder="输入提示词文本..."
          className="nodrag w-full resize-none rounded-sm border border-input bg-input/50 px-2 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          rows={3}
        />
      </div>

      {/* 输出端口 */}
      <Handle
        type="source"
        position={Position.Right}
        id="text-out"
        className="!right-[-4px]"
      />
    </div>
  );
});

TextNode.displayName = 'TextNode';
export default TextNode;
