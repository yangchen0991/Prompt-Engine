import React from 'react';
import { useGenerationStore } from '@/stores/generationStore';
import { useFlowStore } from '@/stores/flowStore';
import { Download, RotateCcw, Layers, Image as ImageIcon } from 'lucide-react';

interface Props {
  nodeId: string | null;
}

export default function ResultsPanel({ nodeId }: Props) {
  const tasks = useGenerationStore(s => s.tasks);
  const retryTask = useGenerationStore(s => s.retryTask);

  const nodeTasks = nodeId
    ? tasks.filter(t => t.nodeId === nodeId && t.status === 'DONE' && t.resultUrl).slice(0, 5)
    : tasks.filter(t => t.status === 'DONE' && t.resultUrl).slice(0, 10);

  if (nodeTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 gap-2 p-4">
        <ImageIcon size={24} className="text-border" />
        <p className="text-[11px] text-muted-foreground text-center">暂无生成结果</p>
      </div>
    );
  }

  return (
    <div className="p-3 space-y-3">
      <p className="text-[11px] text-muted-foreground">{nodeId ? '该节点的最近结果' : '最近生成结果'}</p>
      <div className="space-y-2">
        {nodeTasks.map(task => (
          <div key={task.id} className="group overflow-hidden rounded-sm border border-border bg-muted/30">
            <div className="relative aspect-square overflow-hidden">
              {task.type === 'image' && task.resultUrl ? (
                <img src={task.resultUrl} alt="生成结果" className="h-full w-full object-cover" />
              ) : task.resultUrl ? (
                <video src={task.resultUrl} className="h-full w-full object-cover" />
              ) : null}
              {/* 悬浮操作 */}
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => window.open(task.resultUrl, '_blank')}
                  className="rounded-sm bg-white/10 p-2 text-white hover:bg-white/20"
                  title="查看原图"
                >
                  <Download size={14} />
                </button>
                <button
                  onClick={() => retryTask(task.id)}
                  className="rounded-sm bg-white/10 p-2 text-white hover:bg-white/20"
                  title="重新生成"
                >
                  <RotateCcw size={14} />
                </button>
                <button
                  onClick={() => retryTask(task.id)}
                  className="rounded-sm bg-white/10 p-2 text-white hover:bg-white/20"
                  title="变体"
                >
                  <Layers size={14} />
                </button>
              </div>
            </div>
            <div className="px-2 py-1.5">
              <p className="truncate text-[10px] text-muted-foreground">{task.prompt}</p>
              <p className="text-[10px] text-muted-foreground/60">{task.model}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
