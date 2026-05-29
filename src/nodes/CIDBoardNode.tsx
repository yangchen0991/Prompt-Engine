import React, { memo, useMemo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import type { CIDBoardNodeData } from '@/types/index';
import { useFlowStore } from '@/stores/flowStore';
import { useUIStore } from '@/stores/uiStore';
import { cidToPromptText } from '@/lib/cidToPrompt';
import { User } from 'lucide-react';

const TEMPERAMENT_OPTIONS = ['intellectual', 'gentle', 'confident', 'mysterious', 'lively', 'elegant'];
const ACCESSORY_OPTIONS = ['glasses', 'earrings', 'necklace', 'hat', 'watch', 'scarf'];

const FieldRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-center gap-2 min-w-0">
    <span className="w-14 shrink-0 text-[10px] text-muted-foreground">{label}</span>
    {children}
  </div>
);

const SelectField = ({
  value, options, onChange
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) => (
  <select
    value={value}
    onChange={e => onChange(e.target.value)}
    className="nodrag flex-1 min-w-0 rounded-sm border border-input bg-input/50 px-1.5 py-0.5 text-[11px] text-foreground focus:border-primary focus:outline-none"
    onClick={e => e.stopPropagation()}
  >
    {options.map(o => <option key={o} value={o}>{o}</option>)}
  </select>
);

const CIDBoardNode = memo(({ id, data, selected }: NodeProps<CIDBoardNodeData>) => {
  const updateNodeData = useFlowStore(s => s.updateNodeData);
  const setSelectedNodeId = useUIStore(s => s.setSelectedNodeId);

  const update = (patch: Partial<CIDBoardNodeData>) => updateNodeData(id, patch);

  const toggleArrayValue = (field: 'temperament' | 'accessories', value: string) => {
    const arr = data[field] ?? [];
    const next = arr.includes(value) ? arr.filter((v: string) => v !== value) : [...arr, value];
    update({ [field]: next });
  };

  const promptPreview = useMemo(() => cidToPromptText(data), [data]);

  return (
    <div
      onClick={() => setSelectedNodeId(id)}
      className={`w-[280px] cursor-pointer rounded-sm border bg-card transition-colors ${
        selected ? 'border-primary shadow-[0_0_0_1px_hsl(var(--primary))]' : 'border-border'
      }`}
    >
      <div className="h-[2px] w-full rounded-t-sm bg-[hsl(var(--node-cid))]" />

      <div className="flex items-center px-3 py-2">
        <User size={12} className="mr-1.5 text-[hsl(var(--node-cid))] shrink-0" />
        <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">角色控制板</span>
      </div>

      <div className="px-3 pb-3 space-y-2">
        {/* Layer 1 基础身份 */}
        <div className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wide">基础身份</div>
        <FieldRow label="性别">
          <SelectField value={data.gender} options={['female', 'male', 'non-binary']} onChange={v => update({ gender: v })} />
        </FieldRow>
        <FieldRow label="年龄">
          <input
            value={data.age}
            onChange={e => update({ age: e.target.value })}
            className="nodrag flex-1 min-w-0 rounded-sm border border-input bg-input/50 px-1.5 py-0.5 text-[11px] text-foreground focus:border-primary focus:outline-none"
            placeholder="25"
            onClick={e => e.stopPropagation()}
          />
        </FieldRow>
        <FieldRow label="民族">
          <SelectField value={data.ethnicity} options={['East Asian', 'South Asian', 'White', 'Black', 'Latino']} onChange={v => update({ ethnicity: v })} />
        </FieldRow>

        {/* Layer 2 外貌特征 */}
        <div className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wide pt-1">外貌特征</div>
        <FieldRow label="发型">
          <SelectField value={data.hairStyle} options={['long straight', 'long wavy', 'short', 'bob', 'curly', 'bun']} onChange={v => update({ hairStyle: v })} />
        </FieldRow>
        <FieldRow label="发色">
          <SelectField value={data.hairColor} options={['black', 'brown', 'blonde', 'red', 'white', 'silver']} onChange={v => update({ hairColor: v })} />
        </FieldRow>
        <FieldRow label="肤色">
          <SelectField value={data.skinTone} options={['fair', 'light', 'medium', 'tan', 'dark']} onChange={v => update({ skinTone: v })} />
        </FieldRow>

        {/* Layer 3 气质 */}
        <div className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wide pt-1">气质</div>
        <div className="flex flex-wrap gap-1">
          {TEMPERAMENT_OPTIONS.map(t => (
            <button
              key={t}
              onClick={e => { e.stopPropagation(); toggleArrayValue('temperament', t); }}
              className={`nodrag rounded-sm px-1.5 py-0.5 text-[10px] transition-colors ${
                data.temperament?.includes(t)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-accent'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Layer 4 姿势情绪 */}
        <div className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wide pt-1">姿势与视角</div>
        <FieldRow label="姿势">
          <SelectField value={data.pose} options={['standing', 'sitting', 'walking', 'lying', 'crouching']} onChange={v => update({ pose: v })} />
        </FieldRow>
        <FieldRow label="表情">
          <SelectField value={data.expression} options={['slight smile', 'neutral', 'laughing', 'serious', 'surprised']} onChange={v => update({ expression: v })} />
        </FieldRow>
        <FieldRow label="视角">
          <SelectField value={data.viewAngle} options={['front view', '3/4 view', 'side profile', 'back view']} onChange={v => update({ viewAngle: v })} />
        </FieldRow>

        {/* 配件 */}
        <div className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wide pt-1">配件</div>
        <div className="flex flex-wrap gap-1">
          {ACCESSORY_OPTIONS.map(a => (
            <button
              key={a}
              onClick={e => { e.stopPropagation(); toggleArrayValue('accessories', a); }}
              className={`nodrag rounded-sm px-1.5 py-0.5 text-[10px] transition-colors ${
                data.accessories?.includes(a)
                  ? 'bg-[hsl(var(--node-cid))] text-black'
                  : 'bg-secondary text-secondary-foreground hover:bg-accent'
              }`}
            >
              {a}
            </button>
          ))}
        </div>

        {/* 提示词预览 */}
        <div className="mt-2 rounded-sm bg-muted/70 p-2">
          <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-3">{promptPreview || '配置角色参数...'}</p>
        </div>
      </div>

      <Handle type="source" position={Position.Right} id="cid-out" />
    </div>
  );
});

CIDBoardNode.displayName = 'CIDBoardNode';
export default CIDBoardNode;
