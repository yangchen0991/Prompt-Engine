import React, { useState, useMemo, useEffect } from 'react';
import { useCameraStore } from '@/stores/cameraStore';
import { useCameraInjectionStore } from '@/stores/cameraInjectionStore';
import CameraInjectionPanel from './CameraInjectionPanel';
import CameraDeviceSearch from './CameraDeviceSearch';
import CameraLensSelector from './CameraLensSelector';
import type { LensSpec } from '@/lib/cameraLenses';
import {
  SCENE_CONFIGS, FOCAL_LENGTHS, APERTURES, ISOS, SHUTTER_SPEEDS,
  SHOT_TYPES, MOVEMENTS, COMPOSITIONS, LIGHTINGS, CAMERA_ANGLES, COLOR_TONES,
  getPresetsByScene, cameraToPromptText, DEFAULT_CAMERA_PARAMS,
} from '@/lib/cameraPresets';
import type { SceneType } from '@/lib/cameraPresets';
import { Check, Save, Trash2, RotateCcw, ChevronDown, Copy, Camera } from 'lucide-react';

// 焦距数值（用于滑块映射）
const FOCAL_VALUES = [8, 14, 20, 24, 28, 35, 50, 85, 90, 105, 135, 200, 400];
// 光圈数值（用于滑块，越大光圈越小）
const APERTURE_VALUES = [1.0, 1.4, 1.8, 2.0, 2.8, 4.0, 5.6, 8, 11, 16, 22];

function focalToSlider(fl: string): number {
  const n = parseInt(fl);
  const idx = FOCAL_VALUES.indexOf(n);
  return idx >= 0 ? idx : 6; // 默认 50mm
}

function apertureToSlider(ap: string): number {
  const n = parseFloat(ap.replace('f/', ''));
  const idx = APERTURE_VALUES.indexOf(n);
  return idx >= 0 ? idx : 3; // 默认 f/2.0
}

function getDepthOfFieldLabel(ap: string): { label: string; desc: string; cls: string } {
  const n = parseFloat(ap.replace('f/', ''));
  if (n <= 2.0) return { label: '浅景深', desc: '主体清晰，背景虚化明显', cls: 'text-[hsl(var(--node-image))]' };
  if (n <= 5.6) return { label: '中景深', desc: '主体与局部背景均清晰', cls: 'text-[hsl(var(--node-text))]' };
  return { label: '深景深', desc: '前后景全部清晰', cls: 'text-[hsl(var(--node-input))]' };
}

export default function CameraPanel() {
  const {
    selectedPresetId, customPresets, currentParams,
    sceneType, selectPreset, updateParams, saveCustomPreset,
    deleteCustomPreset, setSceneType, resetToDefault,
  } = useCameraStore();

  // autoSync：摄影机参数变化时自动更新注入文本
  const { config: injConfig, syncText } = useCameraInjectionStore();
  const safeParamsForSync = { ...DEFAULT_CAMERA_PARAMS, ...currentParams };
  useEffect(() => {
    if (injConfig.enabled && injConfig.autoSync) {
      syncText(safeParamsForSync);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentParams, injConfig.enabled, injConfig.autoSync]);

  const [saveName, setSaveName] = useState('');
  const [showSave, setShowSave] = useState(false);
  const [copied, setCopied] = useState(false);
  // 展开/收起各参数区
  const [sections, setSections] = useState({
    presets: true, focal: true, aperture: true,
    composition: true, lighting: false, advanced: false,
  });

  const sceneConfig = SCENE_CONFIGS.find(s => s.id === sceneType)!;
  const scenePresets = getPresetsByScene(sceneType);
  const promptText = useMemo(() => cameraToPromptText(currentParams), [currentParams]);
  const dof = getDepthOfFieldLabel(currentParams.aperture);

  // 安全读取（兼容旧数据无新字段情况）
  const safeParams = { ...DEFAULT_CAMERA_PARAMS, ...currentParams };

  const toggleSection = (key: keyof typeof sections) =>
    setSections(s => ({ ...s, [key]: !s[key] }));

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col text-[11px]">
      {/* ── 场景类型 Tabs ────────────────────────────── */}
      <div className="border-b border-border px-3 pt-3 pb-0">
        <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">拍摄场景</p>
        <div className="grid grid-cols-2 gap-1 pb-3">
          {SCENE_CONFIGS.map(s => (
            <button
              key={s.id}
              onClick={() => setSceneType(s.id as SceneType)}
              className={`flex flex-col items-start gap-0.5 rounded-sm border px-2.5 py-2 text-left transition-all active:scale-[0.98] ${
                sceneType === s.id
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-secondary/40 text-muted-foreground hover:border-border/80 hover:bg-accent'
              }`}
            >
              <span className="font-medium text-[11px]">{s.label}</span>
              <span className="text-[9px] opacity-70">{s.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 space-y-0 divide-y divide-border">
        {/* ── 场景预设 ────────────────────────────────── */}
        <Section
          title="场景预设"
          open={sections.presets}
          onToggle={() => toggleSection('presets')}
        >
          <div className="grid grid-cols-2 gap-1">
            {scenePresets.map(p => (
              <button
                key={p.id}
                onClick={() => selectPreset(p.id)}
                className={`flex items-center justify-between rounded-sm px-2 py-1.5 text-left transition-colors active:scale-[0.98] ${
                  selectedPresetId === p.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary/60 text-foreground hover:bg-accent'
                }`}
              >
                <span className="truncate text-[10px]">{p.name}</span>
                {selectedPresetId === p.id && <Check size={9} className="shrink-0 ml-1" />}
              </button>
            ))}
          </div>

          {/* 自定义预设列表 */}
          {customPresets.length > 0 && (
            <div className="mt-2 space-y-1">
              <p className="text-[9px] text-muted-foreground uppercase tracking-wide">自定义</p>
              {customPresets.map(p => (
                <div key={p.id} className="flex items-center gap-1">
                  <button
                    onClick={() => selectPreset(p.id)}
                    className={`flex-1 rounded-sm px-2 py-1 text-[10px] text-left transition-colors ${
                      selectedPresetId === p.id ? 'bg-primary text-primary-foreground' : 'bg-secondary/60 hover:bg-accent'
                    }`}
                  >
                    {p.name}
                  </button>
                  <button
                    onClick={() => deleteCustomPreset(p.id)}
                    className="rounded p-0.5 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* ── 焦距滑块 ─────────────────────────────────── */}
        <Section
          title="镜头焦距"
          open={sections.focal}
          onToggle={() => toggleSection('focal')}
          badge={safeParams.focalLength}
        >
          {/* 推荐焦距快捷按钮 */}
          <div className="mb-2 flex flex-wrap gap-1">
            {sceneConfig.recommendedFocalLengths.map(f => (
              <button
                key={f}
                onClick={() => updateParams({ focalLength: f })}
                className={`rounded-sm border px-1.5 py-0.5 text-[10px] transition-colors ${
                  safeParams.focalLength === f
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
                }`}
              >
                {f}
              </button>
            ))}
            <span className="self-center text-[9px] text-muted-foreground/50">推荐</span>
          </div>

          {/* 滑块 */}
          <input
            type="range"
            min={0}
            max={FOCAL_VALUES.length - 1}
            step={1}
            value={focalToSlider(safeParams.focalLength)}
            onChange={e => {
              const mm = FOCAL_VALUES[parseInt(e.target.value)];
              updateParams({ focalLength: `${mm}mm` });
            }}
            className="camera-slider w-full"
          />
          <div className="mt-1 flex justify-between text-[9px] text-muted-foreground/50">
            <span>超广角 8mm</span>
            <span>长焦 400mm</span>
          </div>

          {/* 全焦距列表 */}
          <NativeSelect
            value={safeParams.focalLength}
            options={FOCAL_LENGTHS}
            onChange={v => updateParams({ focalLength: v })}
            className="mt-2"
          />
        </Section>

        {/* ── 光圈与景深 ───────────────────────────────── */}
        <Section
          title="光圈 / 景深"
          open={sections.aperture}
          onToggle={() => toggleSection('aperture')}
          badge={safeParams.aperture}
        >
          {/* 推荐光圈 */}
          <div className="mb-2 flex flex-wrap gap-1">
            {sceneConfig.recommendedApertures.map(a => (
              <button
                key={a}
                onClick={() => updateParams({ aperture: a })}
                className={`rounded-sm border px-1.5 py-0.5 text-[10px] transition-colors ${
                  safeParams.aperture === a
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
                }`}
              >
                {a}
              </button>
            ))}
            <span className="self-center text-[9px] text-muted-foreground/50">推荐</span>
          </div>

          {/* 光圈滑块 */}
          <input
            type="range"
            min={0}
            max={APERTURE_VALUES.length - 1}
            step={1}
            value={apertureToSlider(safeParams.aperture)}
            onChange={e => {
              const val = APERTURE_VALUES[parseInt(e.target.value)];
              updateParams({ aperture: `f/${val}` });
            }}
            className="camera-slider w-full"
          />
          <div className="mt-1 flex justify-between text-[9px] text-muted-foreground/50">
            <span>大光圈 f/1.0</span>
            <span>小光圈 f/22</span>
          </div>

          {/* 景深指示器 */}
          <div className={`mt-2 flex items-center gap-2 rounded-sm border border-border/50 bg-secondary/30 px-2 py-1.5`}>
            <div className="flex gap-0.5">
              {[0, 1, 2, 3, 4].map(i => (
                <div
                  key={i}
                  className={`h-3 w-1 rounded-sm transition-all ${
                    i < Math.round(5 - (apertureToSlider(safeParams.aperture) / (APERTURE_VALUES.length - 1)) * 4.5)
                      ? 'bg-primary'
                      : 'bg-border'
                  }`}
                />
              ))}
            </div>
            <div>
              <p className={`text-[10px] font-medium ${dof.cls}`}>{dof.label}</p>
              <p className="text-[9px] text-muted-foreground/60">{dof.desc}</p>
            </div>
          </div>

          <NativeSelect
            value={safeParams.aperture}
            options={APERTURES}
            onChange={v => updateParams({ aperture: v })}
            className="mt-2"
          />
        </Section>

        {/* ── 构图预设 ─────────────────────────────────── */}
        <Section
          title="构图方式"
          open={sections.composition}
          onToggle={() => toggleSection('composition')}
          badge={safeParams.composition}
        >
          {/* 推荐构图 */}
          <div className="mb-1.5 flex flex-wrap gap-1">
            {sceneConfig.recommendedCompositions.map(c => (
              <button
                key={c}
                onClick={() => updateParams({ composition: c })}
                className={`rounded-sm border px-1.5 py-0.5 text-[10px] transition-colors ${
                  safeParams.composition === c
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* 全构图列表 */}
          <div className="grid grid-cols-3 gap-1">
            {COMPOSITIONS.map(c => (
              <button
                key={c}
                onClick={() => updateParams({ composition: c })}
                className={`rounded-sm border px-1 py-1 text-center text-[10px] transition-colors ${
                  safeParams.composition === c
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border/60 text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </Section>

        {/* ── 光照方案 ─────────────────────────────────── */}
        <Section
          title="光照方案"
          open={sections.lighting}
          onToggle={() => toggleSection('lighting')}
          badge={safeParams.lighting}
        >
          {/* 推荐光照 */}
          <div className="mb-1.5 flex flex-wrap gap-1">
            {sceneConfig.recommendedLightings.map(l => (
              <button
                key={l}
                onClick={() => updateParams({ lighting: l })}
                className={`rounded-sm border px-1.5 py-0.5 text-[10px] transition-colors ${
                  safeParams.lighting === l
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
          <NativeSelect
            value={safeParams.lighting}
            options={LIGHTINGS}
            onChange={v => updateParams({ lighting: v })}
          />
        </Section>

        {/* ── 高级参数 ─────────────────────────────────── */}
        <Section
          title="高级参数"
          open={sections.advanced}
          onToggle={() => toggleSection('advanced')}
        >
          <div className="space-y-2">
            <ParamRow label="景别">
              <NativeSelect value={safeParams.shotType} options={SHOT_TYPES} onChange={v => updateParams({ shotType: v })} />
            </ParamRow>
            <ParamRow label="运镜">
              <NativeSelect value={safeParams.movement} options={MOVEMENTS} onChange={v => updateParams({ movement: v })} />
            </ParamRow>
            <ParamRow label="机位">
              <NativeSelect value={safeParams.cameraAngle} options={CAMERA_ANGLES} onChange={v => updateParams({ cameraAngle: v })} />
            </ParamRow>
            <ParamRow label="色调">
              <NativeSelect value={safeParams.colorTone} options={COLOR_TONES} onChange={v => updateParams({ colorTone: v })} />
            </ParamRow>
            <ParamRow label="ISO">
              <NativeSelect value={safeParams.iso} options={ISOS} onChange={v => updateParams({ iso: v })} />
            </ParamRow>
            <ParamRow label="快门">
              <NativeSelect value={safeParams.shutterSpeed} options={SHUTTER_SPEEDS} onChange={v => updateParams({ shutterSpeed: v })} />
            </ParamRow>

            {/* 设备搜索 — 全宽独占行 */}
            <div className="space-y-1">
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">设备</span>
              <CameraDeviceSearch
                selectedDevice={safeParams.device}
                onChange={device => updateParams({ device, lensId: '' })}
              />
            </div>

            {/* 镜头选择 — 联动推荐 */}
            <CameraLensSelector
              selectedLensId={safeParams.lensId ?? ''}
              currentDevice={safeParams.device}
              onChange={(lens: LensSpec | null) => {
                if (lens) {
                  // 选中镜头：自动回填焦距与光圈
                  updateParams({
                    lensId: lens.id,
                    focalLength: lens.focalLength,
                    aperture: lens.maxAperture,
                  });
                } else {
                  updateParams({ lensId: '' });
                }
              }}
            />
          </div>
        </Section>

        {/* ── 提示词预览 ───────────────────────────────── */}
        <div className="px-3 py-3">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">生成提示词</p>
            <div className="flex items-center gap-1">
              <button
                onClick={resetToDefault}
                title="重置为默认"
                className="rounded p-0.5 text-muted-foreground/60 hover:text-muted-foreground"
              >
                <RotateCcw size={10} />
              </button>
              <button
                onClick={handleCopyPrompt}
                title="复制提示词"
                className="rounded p-0.5 text-muted-foreground/60 hover:text-muted-foreground"
              >
                {copied ? <Check size={10} className="text-[hsl(var(--status-success))]" /> : <Copy size={10} />}
              </button>
            </div>
          </div>
          <div className="rounded-sm bg-secondary/40 border border-border/50 p-2">
            <p className="text-[10px] text-foreground/80 leading-relaxed break-words">
              {promptText || <span className="text-muted-foreground/50">（空）</span>}
            </p>
          </div>
        </div>

        {/* ── 保存预设 ─────────────────────────────────── */}
        <div className="px-3 py-3">
          {!showSave ? (
            <button
              onClick={() => setShowSave(true)}
              className="flex w-full items-center justify-center gap-1.5 rounded-sm border border-border py-1.5 text-[11px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <Save size={11} />
              保存为自定义预设
            </button>
          ) : (
            <div className="flex gap-1">
              <input
                value={saveName}
                onChange={e => setSaveName(e.target.value)}
                placeholder="预设名称..."
                className="flex-1 rounded-sm border border-input bg-input/50 px-2 py-1 text-[11px] text-foreground focus:border-primary focus:outline-none"
                autoFocus
                onKeyDown={e => {
                  if (e.key === 'Enter' && saveName.trim()) {
                    saveCustomPreset(saveName.trim());
                    setSaveName('');
                    setShowSave(false);
                  }
                  if (e.key === 'Escape') setShowSave(false);
                }}
              />
              <button
                onClick={() => {
                  if (saveName.trim()) {
                    saveCustomPreset(saveName.trim());
                    setSaveName('');
                    setShowSave(false);
                  }
                }}
                className="rounded-sm bg-primary px-2.5 py-1 text-[11px] text-primary-foreground hover:bg-primary/90"
              >
                保存
              </button>
              <button
                onClick={() => setShowSave(false)}
                className="rounded-sm border border-border px-2 py-1 text-[11px] text-muted-foreground hover:bg-accent"
              >
                取消
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── 摄影机参数注入控制面板 ───────────────────── */}
      <CameraInjectionPanel />
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// 子组件
// ──────────────────────────────────────────────────────────
function Section({ title, open, onToggle, badge, children }: {
  title: string;
  open: boolean;
  onToggle: () => void;
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-3 py-2.5 text-left hover:bg-accent/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{title}</span>
          {badge && (
            <span className="rounded-sm bg-secondary px-1.5 py-0.5 text-[9px] font-mono text-muted-foreground/80 max-w-[80px] truncate">
              {badge}
            </span>
          )}
        </div>
        <ChevronDown
          size={11}
          className={`shrink-0 text-muted-foreground/50 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <div className="px-3 pb-3">{children}</div>}
    </div>
  );
}

function ParamRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-10 shrink-0 text-[10px] text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}

function NativeSelect({ value, options, onChange, className = '' }: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <div className={`relative flex-1 ${className}`}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full appearance-none rounded-sm border border-input bg-input/50 px-2 py-1 pr-6 text-[11px] text-foreground focus:border-primary focus:outline-none"
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={10} className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
    </div>
  );
}
