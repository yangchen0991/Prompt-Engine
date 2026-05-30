import type { CIDBoardNodeData } from '@/types/index';

// CID Board 参数转提示词
export function cidToPromptText(data: CIDBoardNodeData): string {
  const parts: string[] = [];

  // Layer 1 基础身份
  if (data.gender) parts.push(data.gender);
  if (data.age) parts.push(`age ${data.age}`);
  if (data.ethnicity) parts.push(data.ethnicity);
  if (data.bodyType) parts.push(data.bodyType);

  // Layer 2 外貌特征
  if (data.hairStyle && data.hairColor) {
    parts.push(`${data.hairStyle} ${data.hairColor} hair`);
  } else if (data.hairStyle) {
    parts.push(`${data.hairStyle} hair`);
  }
  if (data.eyeType) parts.push(`${data.eyeType} eyes`);
  if (data.faceShape) parts.push(`${data.faceShape} face`);
  if (data.skinTone) parts.push(`${data.skinTone} skin`);

  // Layer 3 气质风格
  if (data.temperament && data.temperament.length > 0) {
    parts.push(`${data.temperament.join(', ')} temperament`);
  }
  if (data.clothingStyle) parts.push(`${data.clothingStyle} style`);
  if (data.accessories && data.accessories.length > 0) {
    parts.push(data.accessories.join(', '));
  }

  // Layer 4 姿势情绪
  if (data.pose) parts.push(data.pose);
  if (data.expression) parts.push(data.expression);
  if (data.viewAngle) parts.push(data.viewAngle);

  return parts.filter(Boolean).join(', ');
}
