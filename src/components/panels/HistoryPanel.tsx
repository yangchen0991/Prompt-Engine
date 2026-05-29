import React, { useState } from 'react';
import { useHistoryStore } from '@/stores/historyStore';
import { Trash2, Download, Clock, Image, Video } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface Props {
  embedded?: boolean;
}

export default function HistoryPanel({ embedded = false }: Props) {
  const { records, deleteRecord, clearAll } = useHistoryStore();
  const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all');

  const filtered = filter === 'all' ? records : records.filter(r => r.type === filter);

  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 gap-2 p-4">
        <Clock size={24} className="text-border" />
        <p className="text-[11px] text-muted-foreground text-center">暂无历史记录</p>
      </div>
    );
  }

  return (
    <div className={embedded ? 'p-3' : 'flex flex-col h-full'}>
      {/* 筛选和操作 */}
      <div className={`flex items-center justify-between gap-2 ${embedded ? 'mb-3' : 'px-3 py-2 border-b border-border'}`}>
        <div className="flex gap-1">
          {(['all', 'image', 'video'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-sm px-2 py-0.5 text-[11px] transition-colors ${
                filter === f ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-accent'
              }`}
            >
              {f === 'all' ? '全部' : f === 'image' ? '图片' : '视频'}
            </button>
          ))}
        </div>
        <button
          onClick={() => { if (window.confirm('确认清空所有历史？')) clearAll(); }}
          className="rounded p-1 text-muted-foreground transition-colors hover:text-destructive"
          title="清空"
        >
          <Trash2 size={12} />
        </button>
      </div>

      <div className={`${embedded ? '' : 'flex-1 overflow-y-auto px-3 pb-3'} space-y-2`}>
        {filtered.map(record => (
          <div key={record.id} className="group flex gap-2 rounded-sm border border-border bg-muted/30 p-2">
            {/* 缩略图 */}
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-sm bg-muted">
              {record.type === 'image' ? (
                <img src={record.resultUrl} alt={record.prompt} className="h-full w-full object-cover" />
              ) : (
                <video src={record.resultUrl} className="h-full w-full object-cover" />
              )}
            </div>

            {/* 信息 */}
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-1">
                <p className="line-clamp-2 text-[11px] text-foreground leading-tight">{record.prompt}</p>
                <div className="flex shrink-0 gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => window.open(record.resultUrl, '_blank')}
                    className="rounded p-0.5 text-muted-foreground hover:text-foreground"
                  >
                    <Download size={11} />
                  </button>
                  <button
                    onClick={() => deleteRecord(record.id)}
                    className="rounded p-0.5 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground/70">{record.model}</span>
                <span className="text-muted-foreground/50">·</span>
                <span className="text-[10px] text-muted-foreground/70">
                  {formatDistanceToNow(record.createdAt, { addSuffix: true, locale: zhCN })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
