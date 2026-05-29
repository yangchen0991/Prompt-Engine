export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  withCount?: boolean;
}

// ===================== 节点类型 =====================
export type NodeType = 'textNode' | 'genImageNode' | 'genVideoNode' | 'inputImageNode' | 'cidBoardNode';

// ===================== 生成状态机 =====================
export type GenerationStatus = 'IDLE' | 'SUBMITTING' | 'POLLING' | 'DONE' | 'FAILED' | 'CANCELLED';

// ===================== 节点数据 =====================
export interface BaseNodeData {
  label?: string;
}

export interface TextNodeData extends BaseNodeData {
  text: string;
}

export interface GenImageNodeData extends BaseNodeData {
  prompt: string;
  model: string;
  cameraPresetId?: string;
  cameraParams?: CameraParams;
  status: GenerationStatus;
  progress: number;
  resultUrl?: string;
  taskId?: string;
  errorMessage?: string;
}

export interface GenVideoNodeData extends BaseNodeData {
  prompt: string;
  model: string;
  status: GenerationStatus;
  progress: number;
  resultUrl?: string;
  taskId?: string;
  errorMessage?: string;
}

export interface InputImageNodeData extends BaseNodeData {
  imageUrl?: string;
  fileName?: string;
}

export interface CIDBoardNodeData extends BaseNodeData {
  gender: string;
  age: string;
  ethnicity: string;
  bodyType: string;
  hairStyle: string;
  hairColor: string;
  eyeType: string;
  faceShape: string;
  skinTone: string;
  temperament: string[];
  clothingStyle: string;
  accessories: string[];
  pose: string;
  expression: string;
  viewAngle: string;
  promptCache?: string;
}

// ===================== 摄影机参数注入配置 =====================
export type CameraInjectionScope = 'selected' | 'all';

export interface CameraInjectionFields {
  focalLength: boolean;
  aperture: boolean;
  iso: boolean;
  shutterSpeed: boolean;
  shotType: boolean;
  movement: boolean;
  composition: boolean;
  lighting: boolean;
  cameraAngle: boolean;
  colorTone: boolean;
  device: boolean;
}

export interface CameraInjectionConfig {
  enabled: boolean;
  scope: CameraInjectionScope;
  fields: CameraInjectionFields;
  /** 自定义模板，留空则使用默认格式 */
  template: string;
  /** 是否实时自动注入（每次参数变动） */
  autoSync: boolean;
}

export interface CameraParams {
  device: string;
  /** 已选镜头 id，对应 cameraLenses.ts 中 LensSpec.id */
  lensId: string;
  focalLength: string;
  aperture: string;
  iso: string;
  shutterSpeed: string;
  lensType: string;
  movement: string;
  shotType: string;
  // 新增：构图、光照、机位、色调
  composition: string;
  lighting: string;
  cameraAngle: string;
  colorTone: string;
}

export interface CameraPreset {
  id: string;
  name: string;
  params: CameraParams;
  isCustom?: boolean;
}

// ===================== AI 模型 =====================
export interface AIModel {
  id: string;
  name: string;
  provider: string;
  type: 'chat' | 'image' | 'video';
  description: string;
  isAsync: boolean;
}

// ===================== 生成任务 =====================
export interface GenerationTask {
  id: string;
  nodeId: string;
  prompt: string;
  model: string;
  type: 'image' | 'video';
  status: GenerationStatus;
  progress: number;
  resultUrl?: string;
  taskId?: string;
  errorMessage?: string;
  startTime: number;
  endTime?: number;
  retryCount: number;
}

// ===================== 历史记录 =====================
export interface HistoryRecord {
  id: string;
  type: 'image' | 'video';
  prompt: string;
  model: string;
  resultUrl: string;
  createdAt: number;
  cameraParams?: CameraParams;
  nodeId?: string;
}

// ===================== Onboarding 模板 =====================
export type OnboardingTemplate = 'character' | 'storyboard' | 'style-transfer';

// ===================== 分镜 =====================
export interface StoryboardShot {
  id: string;
  index: number;
  description: string;
  resultUrl?: string;
  status: GenerationStatus;
}

export interface StoryboardGlobalLock {
  character: boolean;
  scene: boolean;
  style: boolean;
  colorTone: boolean;
  aspectRatio: boolean;
  camera: boolean;
  characterPrompt: string;
  scenePrompt: string;
  stylePrompt: string;
  colorTonePrompt: string;
  aspectRatioValue: string;
}

// ===================== 聊天 =====================
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  mode?: 'sculpt' | 'normal' | 'workflow';
}
