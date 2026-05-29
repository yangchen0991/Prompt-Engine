const fs = require('fs');

const file = '/workspace/app-bxi5vk6ftmv5/src/lib/cameraPresets.ts';
let content = fs.readFileSync(file, 'utf-8');

const newPresets = `
export const BUILT_IN_PRESETS: CameraPreset[] = [
  {
    id: 'preset-cinematic',
    name: '电影感',
    params: {
      device: 'ARRI Alexa 35', focalLength: '35mm', aperture: 'f/2.0',
      iso: 'ISO 800', shutterSpeed: '1/60s', lensType: '电影镜头', lensId: '',
      movement: '推镜头', shotType: '中景',
      composition: '三分法', lighting: '戏剧性侧光', cameraAngle: '平视', colorTone: '青橙电影调',
    },
  },
  {
    id: 'preset-retro',
    name: '复古',
    params: {
      device: 'Leica M6', focalLength: '50mm', aperture: 'f/2.0',
      iso: 'ISO 400', shutterSpeed: '1/60s', lensType: '标准镜头', lensId: '',
      movement: '手持', shotType: '中近景',
      composition: '中心对称', lighting: '自然光', cameraAngle: '平视', colorTone: '胶片褪色',
    },
  },
  {
    id: 'preset-cyberpunk',
    name: '赛博朋克',
    params: {
      device: 'RED V-RAPTOR 8K VV', focalLength: '24mm', aperture: 'f/1.4',
      iso: 'ISO 1600', shutterSpeed: '1/125s', lensType: '广角镜头', lensId: '',
      movement: '手持', shotType: '全景',
      composition: '对角线', lighting: '霓虹混合光', cameraAngle: '仰拍 15°', colorTone: '高饱和鲜艳',
    },
  },
  {
    id: 'preset-documentary',
    name: '纪实',
    params: {
      device: 'Sony A7 IV', focalLength: '35mm', aperture: 'f/2.8',
      iso: 'ISO 800', shutterSpeed: '1/125s', lensType: '标准镜头', lensId: '',
      movement: '跟随', shotType: '中景',
      composition: '三分法', lighting: '自然柔光', cameraAngle: '平视', colorTone: '高对比黑白',
    },
  },
  {
    id: 'preset-fresh',
    name: '清新',
    params: {
      device: 'Fujifilm X-T5', focalLength: '50mm', aperture: 'f/2.0',
      iso: 'ISO 200', shutterSpeed: '1/250s', lensType: '标准镜头', lensId: '',
      movement: '固定镜头', shotType: '近景',
      composition: '三分法', lighting: '正午阳光', cameraAngle: '俯拍 15°', colorTone: '低饱和莫兰迪',
    },
  },
  {
    id: 'preset-portrait',
    name: '人像',
    params: {
      device: 'Hasselblad X2D 100C', focalLength: '85mm', aperture: 'f/1.8',
      iso: 'ISO 100', shutterSpeed: '1/125s', lensType: '人像定焦', lensId: '',
      movement: '固定镜头', shotType: '近景',
      composition: '眼神引导', lighting: '伦勃朗光', cameraAngle: '平视', colorTone: '暖调金黄',
    },
  },
  {
    id: 'preset-landscape',
    name: '风光',
    params: {
      device: 'Nikon Z9', focalLength: '14mm', aperture: 'f/8',
      iso: 'ISO 64', shutterSpeed: '1/60s', lensType: '超广角', lensId: '',
      movement: '固定镜头', shotType: '远景',
      composition: '引导线', lighting: '黄金时段', cameraAngle: '平视', colorTone: '中性自然',
    },
  },
  {
    id: 'preset-macro',
    name: '微距',
    params: {
      device: 'Canon EOS R5', focalLength: '105mm 微距', aperture: 'f/5.6',
      iso: 'ISO 100', shutterSpeed: '1/125s', lensType: '微距镜头', lensId: '',
      movement: '固定镜头', shotType: '特写',
      composition: '中心对称', lighting: '环形灯', cameraAngle: '平视', colorTone: '高饱和鲜艳',
    },
  },
];

// ===================== 场景预设映射 =====================
export function getPresetsByScene(sceneId: SceneType): CameraPreset[] {
  return BUILT_IN_PRESETS;
}
`;

const startIndex = content.indexOf('export const BUILT_IN_PRESETS');
const endIndex = content.indexOf('export function getPresetById');
if (startIndex !== -1 && endIndex !== -1) {
  content = content.substring(0, startIndex) + newPresets + '\n' + content.substring(endIndex);
  fs.writeFileSync(file, content);
  console.log('Replaced successfully');
} else {
  console.log('Could not find boundaries', startIndex, endIndex);
}
