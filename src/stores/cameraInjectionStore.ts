import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CameraInjectionConfig, CameraInjectionFields, CameraInjectionScope } from '@/types/index';
import type { CameraParams } from '@/types/index';
import { cameraToPromptText } from '@/lib/cameraPresets';

// ===================== 默认配置 =====================
export const DEFAULT_INJECTION_FIELDS: CameraInjectionFields = {
  focalLength: true,
  aperture: true,
  iso: false,
  shutterSpeed: false,
  shotType: true,
  movement: false,
  composition: true,
  lighting: true,
  cameraAngle: false,
  colorTone: true,
  device: false,
};

export const DEFAULT_INJECTION_CONFIG: CameraInjectionConfig = {
  enabled: false,
  scope: 'selected',
  fields: DEFAULT_INJECTION_FIELDS,
  template: '',
  autoSync: false,
};

// 参数字段的中文标签，用于 UI
export const FIELD_LABELS: Record<keyof CameraInjectionFields, string> = {
  focalLength: '焦距',
  aperture: '光圈',
  iso: 'ISO',
  shutterSpeed: '快门',
  shotType: '景别',
  movement: '运镜',
  composition: '构图',
  lighting: '光照',
  cameraAngle: '机位',
  colorTone: '色调',
  device: '设备',
};

// ===================== 格式化函数 =====================
/**
 * 根据 fields 配置过滤 CameraParams，生成注入文本
 * template 若不为空则替换以下占位符：
 *   {focalLength}, {aperture}, {iso}, {shutterSpeed},
 *   {shotType}, {movement}, {composition}, {lighting},
 *   {cameraAngle}, {colorTone}, {device}
 */
export function buildInjectionText(
  params: CameraParams,
  fields: CameraInjectionFields,
  template: string
): string {
  // 使用自定义模板
  if (template.trim()) {
    return template.trim()
      .replace('{focalLength}', fields.focalLength ? params.focalLength : '')
      .replace('{aperture}', fields.aperture ? params.aperture : '')
      .replace('{iso}', fields.iso ? params.iso : '')
      .replace('{shutterSpeed}', fields.shutterSpeed ? params.shutterSpeed : '')
      .replace('{shotType}', fields.shotType ? params.shotType : '')
      .replace('{movement}', fields.movement ? params.movement : '')
      .replace('{composition}', fields.composition ? params.composition : '')
      .replace('{lighting}', fields.lighting ? params.lighting : '')
      .replace('{cameraAngle}', fields.cameraAngle ? params.cameraAngle : '')
      .replace('{colorTone}', fields.colorTone ? params.colorTone : '')
      .replace('{device}', fields.device ? params.device : '')
      .replace(/,\s*,/g, ',')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // 默认格式：基于选中字段过滤后调用 cameraToPromptText
  const filtered: CameraParams = {
    ...params,
    focalLength: fields.focalLength ? params.focalLength : '',
    aperture: fields.aperture ? params.aperture : '',
    iso: fields.iso ? params.iso : '',
    shutterSpeed: fields.shutterSpeed ? params.shutterSpeed : '',
    shotType: fields.shotType ? params.shotType : '',
    movement: fields.movement ? params.movement : '',
    composition: fields.composition ? params.composition : '',
    lighting: fields.lighting ? params.lighting : '',
    cameraAngle: fields.cameraAngle ? params.cameraAngle : '',
    colorTone: fields.colorTone ? params.colorTone : '',
    device: fields.device ? params.device : '',
    lensType: '',
  };

  const text = cameraToPromptText(filtered);
  return text ? `Camera: ${text}` : '';
}

// ===================== Store =====================
interface CameraInjectionState {
  config: CameraInjectionConfig;
  /** 最近一次手动同步的注入文本（显示在预览区） */
  lastInjectedText: string;
  setEnabled: (v: boolean) => void;
  setAutoSync: (v: boolean) => void;
  setScope: (scope: CameraInjectionScope) => void;
  toggleField: (field: keyof CameraInjectionFields) => void;
  setTemplate: (t: string) => void;
  resetFields: () => void;
  resetConfig: () => void;
  /** 根据当前参数和字段配置，更新 lastInjectedText */
  syncText: (params: CameraParams) => void;
}

export const useCameraInjectionStore = create<CameraInjectionState>()(
  persist(
    (set, get) => ({
      config: { ...DEFAULT_INJECTION_CONFIG },
      lastInjectedText: '',

      setEnabled: (v) => set(s => ({ config: { ...s.config, enabled: v } })),
      setAutoSync: (v) => set(s => ({ config: { ...s.config, autoSync: v } })),
      setScope: (scope) => set(s => ({ config: { ...s.config, scope } })),

      toggleField: (field) =>
        set(s => ({
          config: {
            ...s.config,
            fields: { ...s.config.fields, [field]: !s.config.fields[field] },
          },
        })),

      setTemplate: (t) => set(s => ({ config: { ...s.config, template: t } })),

      resetFields: () =>
        set(s => ({ config: { ...s.config, fields: { ...DEFAULT_INJECTION_FIELDS } } })),

      resetConfig: () =>
        set({ config: { ...DEFAULT_INJECTION_CONFIG }, lastInjectedText: '' }),

      syncText: (params: CameraParams) => {
        const { config } = get();
        const text = buildInjectionText(params, config.fields, config.template);
        set({ lastInjectedText: text });
      },
    }),
    { name: 'pe-camera-injection' }
  )
);
