/**
 * CameraInjectionPanel
 * 嵌入在 CameraPanel（摄影机 Tab）底部的注入控制子面板。
 * 提供：启用开关、注入范围、参数勾选、自定义模板、同步按钮。
 */
import React, { useState } from 'react';
import {
  useCameraInjectionStore,
  buildInjectionText,
  FIELD_LABELS,
} from '@/stores/cameraInjectionStore';
import { useCameraStore } from '@/stores/cameraStore';
import { DEFAULT_CAMERA_PARAMS } from '@/lib/cameraPresets';
import type { CameraInjectionFields } from '@/types/index';
import {
  Zap,
  RefreshCw,
  ChevronDown,
  RotateCcw,
  Check,
  Copy,
} from 'lucide-react';

export default function CameraInjectionPanel() {
  const {
    config,
    lastInjectedText,
    setEnabled,
    setAutoSync,
    setScope,
    toggleField,
    setTemplate,
    resetFields,
    syncText,
  } = useCameraInjectionStore();

  const { currentParams } = useCameraStore();
  const safeParams = { ...DEFAULT_CAMERA_PARAMS, ...currentParams };

  const [showTemplate, setShowTemplate] = useState(false);
  const [copied, setCopied] = useState(false);

  // 点击"同步"按钮时更新 lastInjectedText
  const handleSync = () => {
    syncText(safeParams);
  };

  // 复制预览文本
  const handleCopy = () => {
    if (!lastInjectedText) return;
    navigator.clipboard.writeText(lastInjectedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // 实时预览文本（不依赖 lastInjectedText，即时计算）
  const previewText = buildInjectionText(safeParams, config.fields, config.template);

  const enabledFieldCount = Object.values(config.fields).filter(Boolean).length;

  return (
    <div className="border-t border-border">
      {/* ── 标题行 + 总开关 ────────────────────────── */}
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-1.5">
          <Zap size={11} className={config.enabled ? 'text-primary' : 'text-muted-foreground/50'} />
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            参数注入
          </span>
          {config.enabled && (
            <span className="rounded-sm bg-primary/15 px-1.5 py-0.5 text-[9px] font-medium text-primary">
              已启用
            </span>
          )}
        </div>
        {/* 开关 */}
        <button
          onClick={() => setEnabled(!config.enabled)}
          className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer items-center rounded-full border-2 transition-colors ${
            config.enabled
              ? 'border-primary bg-primary'
              : 'border-border bg-secondary'
          }`}
          role="switch"
          aria-checked={config.enabled}
          title={config.enabled ? '关闭参数注入' : '启用参数注入'}
        >
          <span
            className={`inline-block h-2.5 w-2.5 rounded-full bg-white shadow-sm transition-transform ${
              config.enabled ? 'translate-x-3' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* ── 展开区（仅开关开启时显示） ─────────────── */}
      {config.enabled && (
        <div className="space-y-0 divide-y divide-border/60">

          {/* 注入范围 */}
          <div className="px-3 py-2.5">
            <p className="mb-1.5 text-[9px] font-medium uppercase tracking-wider text-muted-foreground/70">
              注入范围
            </p>
            <div className="grid grid-cols-2 gap-1">
              {([
                ['selected', '仅选中节点'],
                ['all', '所有图片节点'],
              ] as const).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setScope(val)}
                  className={`rounded-sm border px-2 py-1.5 text-[10px] text-left transition-colors ${
                    config.scope === val
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border text-muted-foreground hover:bg-accent hover:text-foreground'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 参数勾选 */}
          <div className="px-3 py-2.5">
            <div className="mb-1.5 flex items-center justify-between">
              <p className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground/70">
                注入参数 <span className="text-muted-foreground/50">({enabledFieldCount}/{Object.keys(config.fields).length})</span>
              </p>
              <button
                onClick={resetFields}
                title="恢复默认"
                className="rounded p-0.5 text-muted-foreground/40 hover:text-muted-foreground transition-colors"
              >
                <RotateCcw size={9} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-x-2 gap-y-1">
              {(Object.keys(config.fields) as Array<keyof CameraInjectionFields>).map(field => (
                <label
                  key={field}
                  className="flex cursor-pointer items-center gap-1 select-none"
                >
                  <span
                    onClick={() => toggleField(field)}
                    className={`inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-sm border transition-colors ${
                      config.fields[field]
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-input/50'
                    }`}
                  >
                    {config.fields[field] && <Check size={8} strokeWidth={3} />}
                  </span>
                  <span
                    onClick={() => toggleField(field)}
                    className={`text-[10px] transition-colors ${
                      config.fields[field] ? 'text-foreground' : 'text-muted-foreground/60'
                    }`}
                  >
                    {FIELD_LABELS[field]}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* 实时注入同步控制 */}
          <div className="px-3 py-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-muted-foreground">实时同步</span>
                <span className="text-[9px] text-muted-foreground/40">参数变动自动更新</span>
              </div>
              <button
                onClick={() => setAutoSync(!config.autoSync)}
                className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer items-center rounded-full border-2 transition-colors ${
                  config.autoSync ? 'border-primary bg-primary' : 'border-border bg-secondary'
                }`}
                role="switch"
                aria-checked={config.autoSync}
              >
                <span
                  className={`inline-block h-2.5 w-2.5 rounded-full bg-white shadow-sm transition-transform ${
                    config.autoSync ? 'translate-x-3' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* 自定义模板（可折叠） */}
          <div>
            <button
              onClick={() => setShowTemplate(v => !v)}
              className="flex w-full items-center justify-between px-3 py-2.5 hover:bg-accent/40 transition-colors"
            >
              <p className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground/70">
                自定义模板
                {config.template.trim() && (
                  <span className="ml-1.5 text-primary">（已自定义）</span>
                )}
              </p>
              <ChevronDown
                size={10}
                className={`shrink-0 text-muted-foreground/40 transition-transform duration-150 ${showTemplate ? 'rotate-180' : ''}`}
              />
            </button>
            {showTemplate && (
              <div className="px-3 pb-3 space-y-1.5">
                <p className="text-[9px] text-muted-foreground/50 leading-relaxed">
                  使用占位符自定义格式，例如：<br />
                  <code className="font-mono text-[9px] text-muted-foreground">Camera: {'{focalLength}'}, {'{aperture}'}, {'{lighting}'}</code>
                </p>
                <textarea
                  value={config.template}
                  onChange={e => setTemplate(e.target.value)}
                  placeholder="留空则使用默认格式…"
                  rows={3}
                  className="w-full resize-none rounded-sm border border-input bg-input/50 px-2 py-1.5 font-mono text-[10px] text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
                />
                {config.template.trim() && (
                  <button
                    onClick={() => setTemplate('')}
                    className="text-[9px] text-muted-foreground/60 hover:text-muted-foreground transition-colors"
                  >
                    清除自定义模板
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 预览 + 同步按钮 */}
          <div className="px-3 py-3 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground/70">
                注入预览
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleCopy}
                  disabled={!previewText}
                  title="复制"
                  className="rounded p-0.5 text-muted-foreground/50 hover:text-muted-foreground transition-colors disabled:opacity-30"
                >
                  {copied
                    ? <Check size={10} className="text-[hsl(var(--status-success))]" />
                    : <Copy size={10} />
                  }
                </button>
                <button
                  onClick={handleSync}
                  title="手动同步"
                  className="flex items-center gap-1 rounded-sm border border-border px-2 py-0.5 text-[9px] text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                >
                  <RefreshCw size={9} />
                  同步
                </button>
              </div>
            </div>

            {/* 预览文本框 */}
            <div className="min-h-[40px] rounded-sm border border-border/60 bg-secondary/30 px-2 py-1.5">
              {previewText ? (
                <p className="font-mono text-[10px] text-foreground/80 leading-relaxed break-words">
                  {previewText}
                </p>
              ) : (
                <p className="text-[10px] text-muted-foreground/40 italic">
                  {enabledFieldCount === 0 ? '未选择任何参数' : '无有效参数文本'}
                </p>
              )}
            </div>

            {/* 同步结果提示 */}
            {lastInjectedText && lastInjectedText !== previewText && (
              <p className="text-[9px] text-muted-foreground/50">
                上次同步：<span className="font-mono">{lastInjectedText.slice(0, 60)}{lastInjectedText.length > 60 ? '…' : ''}</span>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
