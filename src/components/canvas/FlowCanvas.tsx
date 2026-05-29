import React, { useCallback, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  Panel,
} from 'reactflow';
import type { NodeMouseHandler } from 'reactflow';
import 'reactflow/dist/style.css';
import { useFlowStore } from '@/stores/flowStore';
import { useUIStore } from '@/stores/uiStore';
import { nodeTypes } from '@/nodes';
import CanvasContextMenu from './CanvasContextMenu';

interface CanvasContextMenuState {
  x: number;
  y: number;
  flowX: number;
  flowY: number;
}

export default function FlowCanvas() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useFlowStore();
  const setSelectedNodeId = useUIStore(s => s.setSelectedNodeId);
  const [contextMenu, setContextMenu] = React.useState<CanvasContextMenuState | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = React.useState<any>(null);

  const onPaneClick = useCallback(() => {
    setContextMenu(null);
    setSelectedNodeId(null);
  }, [setSelectedNodeId]);

  // 点击节点时同步 UIStore 选中状态，触发 RightDock 展开
  const onNodeClick: NodeMouseHandler = useCallback((_event, node) => {
    setSelectedNodeId(node.id);
  }, [setSelectedNodeId]);

  const onContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (!reactFlowInstance) return;
    const bounds = reactFlowWrapper.current?.getBoundingClientRect();
    if (!bounds) return;
    const pos = reactFlowInstance.screenToFlowPosition({ x: e.clientX, y: e.clientY });
    setContextMenu({ x: e.clientX, y: e.clientY, flowX: pos.x, flowY: pos.y });
  }, [reactFlowInstance]);

  return (
    <div ref={reactFlowWrapper} className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onPaneClick={onPaneClick}
        onNodeClick={onNodeClick}
        onContextMenu={onContextMenu}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        deleteKeyCode="Delete"
        multiSelectionKeyCode="Shift"
        className="bg-[hsl(var(--canvas-bg))]"
        defaultEdgeOptions={{ animated: false, style: { strokeWidth: 1.5 } }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1.5}
          color="hsl(var(--canvas-dot))"
        />
        <Controls className="!bottom-6 !left-6" showInteractive={false} />
        <MiniMap
          className="!bottom-6 !right-6"
          nodeColor={(node) => {
            switch (node.type) {
              case 'textNode': return 'hsl(var(--node-text))';
              case 'genImageNode': return 'hsl(var(--node-image))';
              case 'genVideoNode': return 'hsl(var(--node-video))';
              case 'inputImageNode': return 'hsl(var(--node-input))';
              case 'cidBoardNode': return 'hsl(var(--node-cid))';
              default: return 'hsl(var(--muted))';
            }
          }}
          maskColor="rgba(0,0,0,0.6)"
        />

        {/* 空画布提示 */}
        {nodes.length === 0 && (
          <Panel position="top-center">
            <div className="mt-20 rounded-sm border border-border bg-card/80 px-6 py-4 text-center backdrop-blur-sm">
              <p className="text-sm text-muted-foreground">画布为空</p>
              <p className="mt-1 text-xs text-muted-foreground/60">按 <kbd className="rounded bg-secondary px-1 py-0.5 text-[10px] font-mono">Ctrl+K</kbd> 添加节点</p>
            </div>
          </Panel>
        )}
      </ReactFlow>

      {/* 右键菜单 */}
      {contextMenu && (
        <CanvasContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          flowX={contextMenu.flowX}
          flowY={contextMenu.flowY}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}
