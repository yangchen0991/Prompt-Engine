/**
 * 相机设备搜索框
 * - 输入关键词实时过滤品牌 / 型号
 * - 搜索结果展示在下拉列表中（分组高亮匹配片段）
 * - 搜索为空时回退到常规分组 select
 */
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { CAMERA_DEVICES } from '@/lib/cameraPresets';
import type { CameraDeviceGroup } from '@/lib/cameraPresets';

interface CameraDeviceSearchProps {
  /** 当前已选设备名（完整型号字符串） */
  selectedDevice: string;
  onChange: (deviceName: string) => void;
}

interface MatchedGroup {
  brand: string;
  sensorNote: string;
  models: string[];
}

function highlight(text: string, query: string): React.ReactNode {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-primary/25 text-primary font-semibold rounded-[2px] px-0">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export default function CameraDeviceSearch({ selectedDevice, onChange }: CameraDeviceSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 过滤后的设备分组
  const filteredGroups = useMemo((): MatchedGroup[] => {
    const q = query.trim().toLowerCase();
    if (!q) return CAMERA_DEVICES.map(g => ({ ...g }));

    return CAMERA_DEVICES
      .map((group: CameraDeviceGroup) => {
        const brandMatch = group.brand.toLowerCase().includes(q);
        const matchedModels = brandMatch
          ? group.models // 品牌匹配时显示该品牌全部型号
          : group.models.filter(m => m.toLowerCase().includes(q));
        return { brand: group.brand, sensorNote: group.sensorNote, models: matchedModels };
      })
      .filter(g => g.models.length > 0);
  }, [query]);

  const totalMatched = filteredGroups.reduce((s, g) => s + g.models.length, 0);

  // 点击外部关闭
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (model: string) => {
    onChange(model);
    setQuery('');
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery('');
    onChange('');
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative flex flex-col gap-1">
      {/* 搜索框 */}
      <div className="relative flex items-center">
        <Search
          size={10}
          className="absolute left-2 text-muted-foreground/50 pointer-events-none shrink-0"
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="搜索相机品牌或型号…"
          className="w-full rounded-sm border border-input bg-input/50 pl-6 pr-6 py-1 text-[11px] text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
        />
        {(query || selectedDevice) && (
          <button
            onMouseDown={e => { e.preventDefault(); handleClear(); }}
            className="absolute right-1.5 text-muted-foreground/50 hover:text-muted-foreground p-0.5 rounded"
            tabIndex={-1}
          >
            <X size={9} />
          </button>
        )}
      </div>

      {/* 已选设备展示（非搜索状态） */}
      {selectedDevice && !isOpen && (
        <div className="flex items-center gap-1.5 rounded-sm border border-primary/40 bg-primary/8 px-2 py-1">
          <span className="text-[10px] text-primary/80 font-medium truncate flex-1">
            {selectedDevice}
          </span>
          <button
            onClick={handleClear}
            className="text-muted-foreground/50 hover:text-muted-foreground shrink-0"
          >
            <X size={9} />
          </button>
        </div>
      )}

      {/* 下拉搜索结果面板 */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-0.5 max-h-56 overflow-y-auto rounded-sm border border-border bg-popover shadow-md">
          {/* 搜索统计 */}
          {query && (
            <div className="sticky top-0 flex items-center justify-between border-b border-border/50 bg-popover px-2 py-1">
              <span className="text-[9px] text-muted-foreground">
                找到 {totalMatched} 款
              </span>
              <span className="text-[9px] text-muted-foreground/60">
                "{query}"
              </span>
            </div>
          )}

          {/* 无结果 */}
          {filteredGroups.length === 0 && (
            <div className="px-3 py-4 text-center text-[10px] text-muted-foreground">
              未找到匹配设备
            </div>
          )}

          {/* 不指定选项 */}
          {!query && (
            <button
              onMouseDown={e => e.preventDefault()}
              onClick={() => handleSelect('')}
              className={[
                'w-full text-left px-2 py-1.5 text-[10px] border-b border-border/30',
                'text-muted-foreground/70 hover:bg-accent/50 transition-colors',
                selectedDevice === '' ? 'bg-accent/30' : '',
              ].join(' ')}
            >
              — 不指定设备 —
            </button>
          )}

          {/* 分组列表 */}
          {filteredGroups.map(group => (
            <div key={group.brand}>
              {/* 分组标题 */}
              <div className="flex items-center gap-1 px-2 py-1 bg-secondary/20 border-b border-border/30">
                <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">
                  {highlight(group.brand, query)}
                </span>
                <span className="text-[8px] text-muted-foreground/50 truncate">
                  {group.sensorNote}
                </span>
              </div>
              {/* 型号列表 */}
              {group.models.map(model => (
                <button
                  key={model}
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => handleSelect(model)}
                  className={[
                    'w-full text-left px-3 py-1 text-[11px] transition-colors',
                    'hover:bg-accent/60 hover:text-accent-foreground',
                    selectedDevice === model
                      ? 'bg-primary/15 text-primary font-medium border-l-2 border-primary'
                      : 'text-foreground/80',
                  ].join(' ')}
                >
                  {highlight(model, query)}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
