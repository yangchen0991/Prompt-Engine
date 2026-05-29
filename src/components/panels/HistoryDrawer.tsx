import React from 'react';
import { useUIStore } from '@/stores/uiStore';
import { useHistoryStore } from '@/stores/historyStore';
import { X, Clock, Trash2, Download, Image as ImageIcon, Video } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export default function HistoryDrawer() {
  const { historyPanelOpen, setHistoryPanelOpen } = useUIStore();
  const { records, deleteRecord, clearAll } = useHistoryStore();
  const [filter, setFilter] = React.useState<'all' | 'image' | 'video'>('all');

  if (!historyPanelOpen) return null;

  const filtered = filter === 'all' ? records : records.filter(r => r.type === filter);

  return (
    <div className="fixed inset-0 z-40 flex">
      <div className="flex-1" onClick={() => setHistoryPanelOpen(false)} />
      <div className="flex h-full w-80 flex-col border-l border-border bg-card">
        {/* 头部 */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-primary" />
            <span className="text-sm font-medium text-foreground">历史记录</span>
            {records.length > 0 && (
              <span className="rounded-full bg-primary/20 px-1.5 py-0.5 text-[10px] text-primary">{records.length}</span>
            )}
          </div>
          <div className="flex gap-1">
            {records.length > 0 && (
              <button
                onClick={() => { if (window.confirm('确认清空所有历史？')) clearAll(); }}
                className="rounded p-1 text-muted-foreground hover:text-destructive"
                title="清空全部"
              >
                <Trash2 size={13} />
              </button>
            )}
            <button onClick={() => setHistoryPanelOpen(false)} className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground">
              <X size={14} />
            </button>
          </div>
        </div>

        {/* 筛选 */}
        <div className="flex gap-1 border-b border-border px-3 py-2">
          {(['all', 'image', 'video'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex items-center gap-1 rounded-sm px-2 py-0.5 text-[11px] transition-colors ${
                filter === f ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-accent'
              }`}
            >
              {f === 'image' && <ImageIcon size={10} />}
              {f === 'video' && <Video size={10} />}
              {f === 'all' ? '全部' : f === 'image' ? '图片' : '视频'}
            </button>
          ))}
        </div>

        {/* 记录列表 */}
        <div className="flex-1 overflow-y-auto px-3 py-3">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 gap-2">
              <Clock size={24} className="text-border" />
              <p className="text-[12px] text-muted-foreground text-center">暂无历史记录</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map(record => (
                <div key={record.id} className="group overflow-hidden rounded-sm border border-border bg-muted/30">
                  {/* 缩略图 */}
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    {record.type === 'image' ? (
                      <img src={record.resultUrl} alt={record.prompt} className="h-full w-full object-cover" />
                    ) : (
                      <video src={record.resultUrl} className="h-full w-full object-cover" />
                    )}
                    {/* 悬浮操作 */}
                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={() => window.open(record.resultUrl, '_blank')}
                        className="rounded-sm bg-white/10 p-2 text-white hover:bg-white/20"
                      >
                        <Download size={14} />
                      </button>
                      <button
                        onClick={() => deleteRecord(record.id)}
                        className="rounded-sm bg-white/10 p-2 text-white hover:bg-red-500/50"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    {/* 类型标签 */}
                    <div className="absolute left-1.5 top-1.5">
                      <span className={`rounded-sm px-1.5 py-0.5 text-[9px] font-medium ${
                        record.type === 'image' ? 'bg-primary/80 text-white' : 'bg-[hsl(var(--node-video))]/80 text-white'
                      }`}>
                        {record.type === 'image' ? '图片' : '视频'}
                      </span>
                    </div>
                  </div>

                  <div className="px-2.5 py-2">
                    <p className="line-clamp-2 text-[11px] text-foreground leading-tight">{record.prompt}</p>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground">{record.model}</span>
                      <span className="text-[10px] text-muted-foreground/60">
                        {formatDistanceToNow(record.createdAt, { addSuffix: true, locale: zhCN })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
