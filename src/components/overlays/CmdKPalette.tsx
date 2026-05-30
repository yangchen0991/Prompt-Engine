import React, { useEffect, useCallback } from 'react';
import { useUIStore } from '@/stores/uiStore';
import { useFlowStore } from '@/stores/flowStore';
import type { NodeType } from '@/types/index';
import { Command, Type, Image, Video, FileImage, User, Undo2, Redo2, Trash2 } from 'lucide-react';

const COMMANDS = [
  { group: '添加节点', icon: Type, label: '文本节点', action: 'addNode:textNode' },
  { group: '添加节点', icon: Image, label: '图片生成节点', action: 'addNode:genImageNode' },
  { group: '添加节点', icon: Video, label: '视频生成节点', action: 'addNode:genVideoNode' },
  { group: '添加节点', icon: FileImage, label: '图片输入节点', action: 'addNode:inputImageNode' },
  { group: '添加节点', icon: User, label: '角色控制板', action: 'addNode:cidBoardNode' },
  { group: '操作', icon: Undo2, label: '撤销', action: 'undo' },
  { group: '操作', icon: Redo2, label: '重做', action: 'redo' },
  { group: '操作', icon: Trash2, label: '清空画布', action: 'clear' },
];

export default function CmdKPalette() {
  const { cmdKOpen, setCmdKOpen } = useUIStore();
  const { addNode, clearCanvas } = useFlowStore();
  const temporal = useFlowStore.temporal;
  const [query, setQuery] = React.useState('');

  const handleClose = useCallback(() => {
    setCmdKOpen(false);
    setQuery('');
  }, [setCmdKOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCmdKOpen(true);
      }
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [setCmdKOpen, handleClose]);

  const execute = (action: string) => {
    if (action.startsWith('addNode:')) {
      const type = action.split(':')[1] as NodeType;
      addNode(type);
    } else if (action === 'undo') {
      temporal.getState().undo();
    } else if (action === 'redo') {
      temporal.getState().redo();
    } else if (action === 'clear') {
      if (window.confirm('确认清空画布？')) clearCanvas();
    }
    handleClose();
  };

  const filtered = COMMANDS.filter(c =>
    !query || c.label.includes(query) || c.group.includes(query)
  );

  if (!cmdKOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/60" onClick={handleClose}>
      <div
        className="w-full max-w-md overflow-hidden rounded-sm border border-border bg-card shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* 搜索框 */}
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <Command size={14} className="text-muted-foreground shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="搜索命令..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <kbd className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">ESC</kbd>
        </div>

        {/* 命令列表 */}
        <div className="max-h-72 overflow-y-auto py-1">
          {filtered.length === 0 ? (
            <div className="px-4 py-6 text-center text-[12px] text-muted-foreground">没有匹配的命令</div>
          ) : (
            (() => {
              const groups = [...new Set(filtered.map(c => c.group))];
              return groups.map(group => (
                <div key={group}>
                  <div className="px-3 py-1.5">
                    <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground/60">{group}</span>
                  </div>
                  {filtered.filter(c => c.group === group).map(cmd => (
                    <button
                      key={cmd.action}
                      onClick={() => execute(cmd.action)}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-[13px] text-foreground transition-colors hover:bg-accent"
                    >
                      <cmd.icon size={14} className="text-muted-foreground shrink-0" />
                      <span>{cmd.label}</span>
                    </button>
                  ))}
                </div>
              ));
            })()
          )}
        </div>
      </div>
    </div>
  );
}
