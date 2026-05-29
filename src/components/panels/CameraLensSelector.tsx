/**
 * 镜头选择器
 * - 按品牌分组的 optgroup select
 * - 高亮联动推荐（边框 + 背景色变化）
 * - 点击推荐镜头自动填充焦距 & 光圈
 */
import React, { useMemo } from 'react';
import { getLensGroups, getRecommendationForDevice } from '@/lib/cameraLenses';
import type { LensSpec } from '@/lib/cameraLenses';

interface CameraLensSelectorProps {
  /** 当前已选镜头 id（可为空字符串） */
  selectedLensId: string;
  /** 当前已选相机设备名（用于联动推荐） */
  currentDevice: string;
  onChange: (lens: LensSpec | null) => void;
}

export default function CameraLensSelector({
  selectedLensId,
  currentDevice,
  onChange,
}: CameraLensSelectorProps) {
  const groups = useMemo(() => getLensGroups(), []);
  const recommendation = useMemo(
    () => getRecommendationForDevice(currentDevice),
    [currentDevice],
  );

  // 构建 id → spec 映射，方便快速查找
  const lensById = useMemo(() => {
    const map: Record<string, LensSpec> = {};
    groups.forEach(g => g.lenses.forEach(l => { map[l.id] = l; }));
    return map;
  }, [groups]);

  const isRecommended = (id: string) =>
    !!recommendation?.recommendedLensIds.includes(id);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    onChange(val ? lensById[val] ?? null : null);
  };

  // 推荐镜头数量（用于标题提示）
  const recommendedCount = recommendation?.recommendedLensIds.length ?? 0;

  return (
    <div className="flex flex-col gap-1.5">
      {/* 标题行 */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          镜头
        </span>
        {currentDevice && recommendation && (
          <span className="text-[9px] text-primary/70 font-medium px-1.5 py-0.5 rounded-sm bg-primary/10 border border-primary/20">
            {recommendedCount} 款兼容推荐
          </span>
        )}
      </div>

      {/* 推荐范围提示条 */}
      {currentDevice && recommendation && (
        <div className="flex items-center gap-2 rounded-sm border border-primary/30 bg-primary/8 px-2 py-1">
          <span className="text-[9px] text-primary/80 font-medium leading-tight">
            推荐范围
          </span>
          <span className="text-[9px] text-primary/70 leading-tight">
            {recommendation.focalLengthRange[0]}–{recommendation.focalLengthRange[1]}mm
          </span>
          <span className="text-[9px] text-muted-foreground/50">·</span>
          <span className="text-[9px] text-primary/70 leading-tight">
            f/{recommendation.apertureRange[0]}–f/{recommendation.apertureRange[1]}
          </span>
        </div>
      )}

      {/* 镜头下拉选择器 */}
      <select
        value={selectedLensId}
        onChange={handleChange}
        className="w-full rounded-sm border border-input bg-input/50 px-2 py-1 text-[11px] text-foreground focus:border-primary focus:outline-none"
      >
        <option value="">— 不指定镜头 —</option>
        {groups.map(group => {
          const recommendedInGroup = group.lenses.filter(l =>
            recommendation?.recommendedLensIds.includes(l.id),
          );
          const otherInGroup = group.lenses.filter(
            l => !recommendation?.recommendedLensIds.includes(l.id),
          );

          // 若该组有推荐镜头，拆分为"推荐"与"其他"两个 optgroup
          if (currentDevice && recommendation && recommendedInGroup.length > 0) {
            return (
              <React.Fragment key={group.brand}>
                <optgroup label={`★ ${group.brand}（推荐兼容）`}>
                  {recommendedInGroup.map(lens => (
                    <option key={lens.id} value={lens.id}>
                      {lens.name}
                    </option>
                  ))}
                </optgroup>
                {otherInGroup.length > 0 && (
                  <optgroup label={`${group.brand} — ${group.mountLabel}`}>
                    {otherInGroup.map(lens => (
                      <option key={lens.id} value={lens.id}>
                        {lens.name}
                      </option>
                    ))}
                  </optgroup>
                )}
              </React.Fragment>
            );
          }

          return (
            <optgroup key={group.brand} label={`${group.brand} — ${group.mountLabel}`}>
              {group.lenses.map(lens => (
                <option key={lens.id} value={lens.id}>
                  {lens.name}
                </option>
              ))}
            </optgroup>
          );
        })}
      </select>

      {/* 已选镜头规格展示 */}
      {selectedLensId && lensById[selectedLensId] && (
        <div
          className={[
            'flex items-center gap-1.5 rounded-sm border px-2 py-1.5 transition-colors',
            isRecommended(selectedLensId)
              ? 'border-primary/50 bg-primary/10'
              : 'border-border/60 bg-secondary/30',
          ].join(' ')}
        >
          {isRecommended(selectedLensId) && (
            <span className="text-[8px] font-bold text-primary uppercase tracking-wider shrink-0">
              推荐
            </span>
          )}
          <div className="flex flex-wrap gap-x-2 gap-y-0.5 min-w-0">
            <span className="text-[10px] text-foreground/90 font-medium truncate">
              {lensById[selectedLensId].focalLength}
            </span>
            <span className="text-[10px] text-foreground/70">
              {lensById[selectedLensId].maxAperture}
            </span>
            <span className="text-[10px] text-muted-foreground/60 truncate">
              {lensById[selectedLensId].mount}
            </span>
          </div>
          <div className="ml-auto flex gap-1 shrink-0">
            {lensById[selectedLensId].tags.slice(0, 2).map(tag => (
              <span
                key={tag}
                className="text-[8px] px-1 py-0.5 rounded-sm bg-secondary/60 text-muted-foreground/80"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
