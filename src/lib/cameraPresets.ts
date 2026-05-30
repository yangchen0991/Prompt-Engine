import type { CameraParams, CameraPreset } from '@/types/index';
import { LENS_DATABASE } from '@/lib/cameraLenses';

// ===================== 全局选项集合 =====================
export const FOCAL_LENGTHS = [
  '8mm', '14mm', '20mm', '24mm', '28mm', '35mm',
  '50mm', '85mm', '90mm', '105mm', '105mm 微距', '135mm', '200mm', '400mm',
];
export const APERTURES = [
  'f/1.0', 'f/1.4', 'f/1.8', 'f/2.0', 'f/2.8',
  'f/4.0', 'f/5.6', 'f/8', 'f/11', 'f/16', 'f/22',
];
export const ISOS = [
  'ISO 50', 'ISO 64', 'ISO 100', 'ISO 200', 'ISO 400',
  'ISO 800', 'ISO 1600', 'ISO 3200', 'ISO 6400',
];
export const SHUTTER_SPEEDS = [
  '1/8000s', '1/4000s', '1/2000s', '1/1000s', '1/500s',
  '1/250s', '1/125s', '1/60s', '1/30s', '1/15s', '1/8s', '1s', '5s', '30s',
];
export const SHOT_TYPES = ['远景', '全景', '中景', '中近景', '近景', '特写', '大特写'];
export const MOVEMENTS = [
  '固定镜头', '手持', '推镜头', '拉镜头', '摇镜头', '跟随', '升降',
];

export const COMPOSITIONS = [
  '三分法', '中心对称', '引导线', '框架式', '对角线',
  '黄金螺旋', '平铺俯拍', '眼神引导', '负空间',
];

export const LIGHTINGS = [
  // 通用
  '自然光', '自然柔光', '黄金时段', '蓝调时段', '正午阳光', '阴天漫射',
  // 人像
  '环形灯', '伦勃朗光', '蝴蝶光', '分割光', '发型灯',
  // 产品
  '白背景棚拍', '柔光箱', '侧光', '背光轮廓',
  // 艺术
  '戏剧性侧光', '逆光剪影', '霓虹混合光', '自然逆光',
];

export const CAMERA_ANGLES = [
  '平视', '俯拍 15°', '俯拍 45°', '俯拍 90°（顶视）',
  '仰拍 15°', '仰拍 45°', '虫眼视角',
];

export const COLOR_TONES = [
  '中性自然', '暖调金黄', '冷调蓝银', '胶片褪色',
  '高对比黑白', '低饱和莫兰迪', '高饱和鲜艳', '青橙电影调',
];

// ===================== 摄影机设备（真实品牌·完整机型）=====================
// 数据来源：各品牌官方资料 + DPReview / EISA / 维基百科等权威摄影数据库
// 格式：{ brand: 品牌名, models: 真实型号[] }
export interface CameraDeviceGroup {
  brand: string;
  /** 传感器规格简注，用于 UI tooltip */
  sensorNote: string;
  models: string[];
}

export const CAMERA_DEVICES: CameraDeviceGroup[] = [
  // ── 索尼 Sony ────────────────────────────────────────────────────────
  {
    brand: 'Sony 索尼',
    sensorNote: '全画幅 / APS-C Exmor R CMOS',
    models: [
      'Sony A7R V',
      'Sony A7R IV',
      'Sony A7 IV',
      'Sony A7 III',
      'Sony A7S III',
      'Sony A9 III',
      'Sony A9 II',
      'Sony FX3',
      'Sony FX6',
      'Sony FX9',
      'Sony ZV-E1',
      'Sony A6700',
      'Sony A6400',
    ],
  },
  // ── 徕卡 Leica ───────────────────────────────────────────────────────
  {
    brand: 'Leica 徕卡',
    sensorNote: '全画幅 / 中画幅 CMOS',
    models: [
      'Leica M11',
      'Leica M11 Monochrom',
      'Leica M10-R',
      'Leica M10 Monochrom',
      'Leica M6',
      'Leica Q3',
      'Leica Q2',
      'Leica Q2 Monochrom',
      'Leica S3',
      'Leica SL2-S',
      'Leica SL2',
    ],
  },
  // ── 佳能 Canon ───────────────────────────────────────────────────────
  {
    brand: 'Canon 佳能',
    sensorNote: '全画幅 CMOS',
    models: [
      'Canon EOS R5',
      'Canon EOS R5C',
      'Canon EOS R6 Mark II',
      'Canon EOS R3',
      'Canon EOS R1',
      'Canon EOS 5D Mark IV',
      'Canon EOS 1DX Mark III',
      'Canon EOS 90D',
    ],
  },
  // ── 尼康 Nikon ───────────────────────────────────────────────────────
  {
    brand: 'Nikon 尼康',
    sensorNote: '全画幅 / APS-C Backside CMOS',
    models: [
      'Nikon Z9',
      'Nikon Z8',
      'Nikon Z7 II',
      'Nikon Z6 III',
      'Nikon Z6 II',
      'Nikon D850',
      'Nikon D6',
      'Nikon Zf',
      'Nikon Zfc',
    ],
  },
  // ── 富士 Fujifilm ────────────────────────────────────────────────────
  {
    brand: 'Fujifilm 富士',
    sensorNote: 'APS-C X-Trans / 中画幅 GFX CMOS',
    models: [
      'Fujifilm X-T5',
      'Fujifilm X-T4',
      'Fujifilm X-T3',
      'Fujifilm X-Pro3',
      'Fujifilm X100VI',
      'Fujifilm X100V',
      'Fujifilm GFX 100S II',
      'Fujifilm GFX 100S',
      'Fujifilm GFX 50S II',
      'Fujifilm GFX100 II',
    ],
  },
  // ── 哈苏 Hasselblad ──────────────────────────────────────────────────
  {
    brand: 'Hasselblad 哈苏',
    sensorNote: '中画幅 CMOS / 胶片 6×6',
    models: [
      'Hasselblad X2D 100C',
      'Hasselblad H6D-100c',
      'Hasselblad H6D-50c',
      'Hasselblad 907X 50C',
      'Hasselblad 503CX',
      'Hasselblad 500CM',
    ],
  },
  // ── 宾得 Pentax ──────────────────────────────────────────────────────
  {
    brand: 'Pentax 宾得',
    sensorNote: '全画幅 / 中画幅 CMOS',
    models: [
      'Pentax 645Z',
      'Pentax K-1 Mark II',
      'Pentax KF',
    ],
  },
  // ── OM System（原奥林巴斯 Olympus）───────────────────────────────────
  {
    brand: 'OM System 奥林巴斯',
    sensorNote: 'M4/3 Live MOS',
    models: [
      'OM System OM-1 Mark II',
      'OM System OM-1',
      'OM System OM-5',
      'Olympus E-M1X',
      'Olympus E-M1 Mark III',
    ],
  },
  // ── 松下 Panasonic ───────────────────────────────────────────────────
  {
    brand: 'Panasonic 松下',
    sensorNote: '全画幅 / M4/3 CMOS',
    models: [
      'Panasonic LUMIX S5 II',
      'Panasonic LUMIX S5 IIX',
      'Panasonic LUMIX S1R',
      'Panasonic LUMIX S1H',
      'Panasonic LUMIX GH6',
      'Panasonic LUMIX GH5 II',
      'Panasonic LUMIX GH5',
    ],
  },
  // ── 飞思 Phase One ───────────────────────────────────────────────────
  {
    brand: 'Phase One 飞思',
    sensorNote: '超大中画幅 CMOS（100-150MP）',
    models: [
      'Phase One IQ4 150MP',
      'Phase One IQ4 100MP',
      'Phase One XF IQ3 100MP',
      'Phase One XT',
    ],
  },
  // ── 玛米亚 Mamiya ────────────────────────────────────────────────────
  {
    brand: 'Mamiya 玛米亚',
    sensorNote: '胶片 6×7 / 6×4.5',
    models: [
      'Mamiya RZ67 Pro II',
      'Mamiya RB67',
      'Mamiya 645AF',
      'Mamiya 7 II',
    ],
  },
  // ── 禄来 Rollei ──────────────────────────────────────────────────────
  {
    brand: 'Rollei 禄来',
    sensorNote: '胶片 6×6 双镜头反光',
    models: [
      'Rolleiflex 2.8F',
      'Rolleiflex 3.5F',
      'Rolleiflex 2.8GX',
      'Rolleiflex T',
    ],
  },
  // ── 适马 Sigma ───────────────────────────────────────────────────────
  {
    brand: 'Sigma 适马',
    sensorNote: '全画幅 Foveon / BSI CMOS',
    models: [
      'Sigma fp L',
      'Sigma fp',
    ],
  },
  // ── 理光 Ricoh ───────────────────────────────────────────────────────
  {
    brand: 'Ricoh 理光',
    sensorNote: 'APS-C CMOS',
    models: [
      'Ricoh GR IIIx',
      'Ricoh GR III',
    ],
  },
  // ── 福伦达 Voigtlander ───────────────────────────────────────────────
  {
    brand: 'Voigtlander 福伦达',
    sensorNote: '135 胶片旁轴',
    models: [
      'Voigtlander Bessa R4A',
      'Voigtlander Bessa R3A',
      'Voigtlander Bessa R2',
    ],
  },
  // ── 康泰时 Contax ────────────────────────────────────────────────────
  {
    brand: 'Contax 康泰时',
    sensorNote: '135 胶片（Zeiss 镜头）',
    models: [
      'Contax T3',
      'Contax T2',
      'Contax G2',
      'Contax RTS III',
    ],
  },
  // ── 雅西卡 Yashica ───────────────────────────────────────────────────
  {
    brand: 'Yashica 雅西卡',
    sensorNote: '135 胶片',
    models: [
      'Yashica T4',
      'Yashica T5',
    ],
  },
  // ── 蔡司 Zeiss ───────────────────────────────────────────────────────
  {
    brand: 'Zeiss 蔡司',
    sensorNote: '135 胶片旁轴',
    models: [
      'Zeiss Ikon ZM',
    ],
  },
  // ── 宝丽来 Polaroid ──────────────────────────────────────────────────
  {
    brand: 'Polaroid 宝丽来',
    sensorNote: '即时成像胶片',
    models: [
      'Polaroid Now+',
      'Polaroid Now',
      'Polaroid Go',
      'Polaroid SX-70',
      'Polaroid 600',
    ],
  },
  // ── 柯达 Kodak ───────────────────────────────────────────────────────
  {
    brand: 'Kodak 柯达',
    sensorNote: '半格 / 35mm 胶片',
    models: [
      'Kodak Ektar H35',
      'Kodak Ektar H35N',
    ],
  },
  // ── 林哈夫 Linhof ────────────────────────────────────────────────────
  {
    brand: 'Linhof 林哈夫',
    sensorNote: '大画幅 4×5 / 8×10 胶片',
    models: [
      'Linhof Technika 5×4',
      'Linhof Master Technika',
      'Linhof Technorama 617',
    ],
  },
  // ── 仙娜 Sinar ───────────────────────────────────────────────────────
  {
    brand: 'Sinar 仙娜',
    sensorNote: '大画幅 4×5 / 8×10 胶片',
    models: [
      'Sinar P2',
      'Sinar X',
      'Sinar F2',
    ],
  },
  // ── 爱克发 Alpa ──────────────────────────────────────────────────────
  {
    brand: 'Alpa 爱克发',
    sensorNote: '技术相机 120 / 中画幅',
    models: [
      'Alpa 12 MAX',
      'Alpa 12 TC',
      'Alpa FPS',
    ],
  },
  // ── 大疆 DJI（航拍）───────────────────────────────────────────────────
  {
    brand: 'DJI 大疆',
    sensorNote: '航拍 / 运动相机',
    models: [
      'DJI Inspire 3',
      'DJI Mavic 3 Pro',
      'DJI Mavic 3 Classic',
      'DJI Air 3',
      'DJI Osmo Action 5 Pro',
    ],
  },
  // ── GoPro ────────────────────────────────────────────────────────────
  {
    brand: 'GoPro',
    sensorNote: '运动防水相机',
    models: [
      'GoPro Hero 12 Black',
      'GoPro Hero 11 Black',
      'GoPro Max',
    ],
  },
  // ── ARRI（电影摄影机）────────────────────────────────────────────────
  {
    brand: 'ARRI',
    sensorNote: '电影级 Super 35 / LF CMOS',
    models: [
      'ARRI Alexa 35',
      'ARRI Alexa Mini LF',
      'ARRI Alexa Mini',
      'ARRI Alexa LF',
      'ARRI Alexa 65',
    ],
  },
  // ── RED（电影摄影机）──────────────────────────────────────────────────
  {
    brand: 'RED',
    sensorNote: '电影级 Super 35 / Monstro 8K CMOS',
    models: [
      'RED V-RAPTOR 8K VV',
      'RED RAPTOR 8K S35',
      'RED Komodo-X 6K',
      'RED Komodo 6K',
      'RED MONSTRO 8K VV',
    ],
  },
  // ── Blackmagic Design（电影摄影机）────────────────────────────────────
  {
    brand: 'Blackmagic Design',
    sensorNote: '电影级 Super 35 / 12K CMOS',
    models: [
      'Blackmagic URSA Mini Pro 12K',
      'Blackmagic URSA Mini Pro G2',
      'Blackmagic Pocket Cinema Camera 6K G2',
      'Blackmagic Pocket Cinema Camera 4K',
    ],
  },
];

// ===================== 内置预设 =====================
const defaultExtra = {
  composition: '三分法',
  lighting: '自然光',
  cameraAngle: '平视',
  colorTone: '中性自然',
};


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
export function getPresetsByScene(): CameraPreset[] {
  return BUILT_IN_PRESETS;
}

export function getPresetById(id: string): CameraPreset | undefined {
  return BUILT_IN_PRESETS.find(p => p.id === id);
}

// ===================== 参数 → 英文提示词 =====================
const SHOT_TYPE_EN: Record<string, string> = {
  '远景': 'extreme long shot', '全景': 'long shot', '中景': 'medium shot',
  '中近景': 'medium close-up', '近景': 'close-up', '特写': 'extreme close-up', '大特写': 'macro extreme close-up',
};
const MOVEMENT_EN: Record<string, string> = {
  '固定镜头': 'static shot', '手持': 'handheld shot', '推镜头': 'dolly in',
  '拉镜头': 'dolly out', '摇镜头': 'pan shot', '跟随': 'tracking shot', '升降': 'crane shot',
};
const COMPOSITION_EN: Record<string, string> = {
  '三分法': 'rule of thirds composition', '中心对称': 'centered symmetrical composition',
  '引导线': 'leading lines composition', '框架式': 'frame within frame composition',
  '对角线': 'diagonal composition', '黄金螺旋': 'golden spiral composition',
  '平铺俯拍': 'flat lay overhead composition', '眼神引导': 'eye-contact leading',
  '负空间': 'negative space composition',
};
const LIGHTING_EN: Record<string, string> = {
  '自然光': 'natural light', '自然柔光': 'soft natural light', '黄金时段': 'golden hour',
  '蓝调时段': 'blue hour', '正午阳光': 'harsh midday sun', '阴天漫射': 'overcast diffused light',
  '环形灯': 'ring light', '伦勃朗光': 'Rembrandt lighting', '蝴蝶光': 'butterfly lighting',
  '分割光': 'split lighting', '发型灯': 'hair light', '白背景棚拍': 'studio white background',
  '柔光箱': 'softbox lighting', '侧光': 'side lighting', '背光轮廓': 'rim backlight',
  '戏剧性侧光': 'dramatic side lighting', '逆光剪影': 'silhouette backlight',
  '霓虹混合光': 'neon mixed lighting', '自然逆光': 'natural backlight',
};
const ANGLE_EN: Record<string, string> = {
  '平视': 'eye level', '俯拍 15°': 'slight overhead angle', '俯拍 45°': 'high angle shot',
  '俯拍 90°（顶视）': "bird's eye view overhead", '仰拍 15°': 'slight low angle',
  '仰拍 45°': 'low angle shot', '虫眼视角': "worm's eye view",
};
const COLOR_TONE_EN: Record<string, string> = {
  '中性自然': '', '暖调金黄': 'warm golden color grading', '冷调蓝银': 'cool blue silver tones',
  '胶片褪色': 'faded film color grade', '高对比黑白': 'high contrast black and white',
  '低饱和莫兰迪': 'muted desaturated Morandi palette', '高饱和鲜艳': 'vivid high saturation',
  '青橙电影调': 'teal and orange cinematic grade',
};

export function cameraToPromptText(params: CameraParams): string {
  const parts: string[] = [];
  if (SHOT_TYPE_EN[params.shotType]) parts.push(SHOT_TYPE_EN[params.shotType]);
  if (MOVEMENT_EN[params.movement]) parts.push(MOVEMENT_EN[params.movement]);
  if (COMPOSITION_EN[params.composition]) parts.push(COMPOSITION_EN[params.composition]);
  if (ANGLE_EN[params.cameraAngle]) parts.push(ANGLE_EN[params.cameraAngle]);
  if (params.device) parts.push(`shot on ${params.device}`);
  // 优先显示已选镜头完整型号，回退到 focalLength
  if (params.lensId) {
    const lens = LENS_DATABASE.find(l => l.id === params.lensId);
    if (lens) {
      parts.push(`with ${lens.name}`);
    } else if (params.focalLength) {
      parts.push(`${params.focalLength} lens`);
    }
  } else if (params.focalLength) {
    parts.push(`${params.focalLength} lens`);
  }
  if (params.aperture) parts.push(params.aperture);
  if (params.iso) parts.push(params.iso);
  if (params.shutterSpeed) parts.push(params.shutterSpeed);
  if (LIGHTING_EN[params.lighting]) parts.push(LIGHTING_EN[params.lighting]);
  if (COLOR_TONE_EN[params.colorTone]) parts.push(COLOR_TONE_EN[params.colorTone]);
  return parts.join(', ');
}

// 默认参数（兼容旧数据，确保新字段有默认值）
export const DEFAULT_CAMERA_PARAMS: CameraParams = {
  device: 'Hasselblad X2D 100C', lensId: 'hasselblad-xcd-90-2.5',
  focalLength: '85mm', aperture: 'f/2.0',
  iso: 'ISO 200', shutterSpeed: '1/250s', lensType: '人像定焦',
  movement: '固定镜头', shotType: '近景',
  composition: '三分法', lighting: '自然柔光', cameraAngle: '平视', colorTone: '中性自然',
};
