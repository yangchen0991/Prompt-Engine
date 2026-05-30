# 🎨 绘词引擎 V3 (Prompt Engine V3)

> 基于 ReactFlow 的可视化 AI 内容创作平台 — 用节点流程图构建专业级提示词，一键驱动多模型生成图像与视频。

[![Tech Stack](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-RollDown-646CFF?logo=vite)](https://vite.dev)
[![ReactFlow](https://img.shields.io/badge/ReactFlow-11-FF0072)](https://reactflow.dev)
[![Zustand](https://img.shields.io/badge/Zustand-5-443E38)](https://zustand.docs.pmnd.rs/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![pnpm](https://img.shields.io/badge/pnpm-10-F69220?logo=pnpm)](https://pnpm.io)

[演示](#) · [报告 Bug](#) · [请求功能](#)

---

## 📖 简介

**绘词引擎 (Prompt Engine V3)** 是一个视觉化的 AI 提示词工程平台。它将传统的纯文本 prompt 编写升级为**节点式流程图编辑**，让你像搭电路一样构建复杂的创作流程：

- 一条文本节点可以分叉出多个图像/视频生成节点
- 摄影机参数可精细注入到每个生成环节
- AI 助手能根据自然语言描述自动解析出完整工作流
- 内置 40+ 种生成模型，覆盖文生图、文生视频、图生视频

---

## ✨ 核心功能

### 🧩 可视化工作流画布

基于 **ReactFlow** 的拖拽式节点编辑系统，支持 5 种节点类型：

| 节点 | 图标 | 用途 |
|------|------|------|
| **TextNode** | 📝 | 文本输入节点，存放提示词或创作指令 |
| **GenImageNode** | 🖼️ | 图像生成节点，支持 Seedream、ERNIE Image |
| **GenVideoNode** | 🎬 | 视频生成节点，支持 Seedance、HappyHorse |
| **InputImageNode** | 📎 | 图片输入节点，用作垫图参考 |
| **CIDBoardNode** | 👤 | 角色身份控制板，定义统一角色参数 |

> 完整支持 undo/redo（基于 Zundo 时间旅行），50 步历史回溯。

### 📷 专业摄影机参数注入

将专业影像参数注入提示词：

| 类别 | 可选参数 |
|------|----------|
| 焦距 | 8mm → 400mm |
| 光圈 | f/1.0 → f/22 |
| 景别 | 远景、全景、中景、近景、特写 |
| 运镜 | 推拉摇移跟升降 |
| 构图 | 三分法、引导线、黄金螺旋... |
| 光照 | 伦勃朗光、蝴蝶光、霓虹混合光... |
| 色调 | 暖调金黄、青橙电影调、胶片褪色... |

> 内置 **Canon R5、Sony A7IV、Nikon Z9** 等设备预设，5 组预定义风格。

### 🤖 AI 智能工作流解析

自然语言自动转化为节点流程图：

```
输入：「创建一个奇幻故事的角色设定，然后生成角色定妆照和关键场景概念图」
      ↓
AI 输出：「TextNode(创世架构师) → CIDBoardNode → GenImageNode(定妆照) → GenImageNode(场景图)」
```

> 支持"创世架构师"、"角色选角"、"人物定妆"、"分镜引擎"等 8 种高级预设模板。

### 🎬 完整的内容生成管线

- **同步生成**：图片即时返回（Seedream / ERNIE Image）
- **异步生成**：视频任务提交 + 智能轮询（Seedance / HappyHorse）
- **并发控制**：最大并发任务数限制
- **今日计数**：实时统计当日生成数量
- **历史记录**：所有生成结果留存（最多 500 条），支持按类型筛选

### 🎛️ 配套工具集

| 面板 | 功能 |
|------|------|
| **CmdK 命令面板** | 全局快捷键搜索与操作 |
| **AI 对话抽屉** | SCULPT/Normal/Workflow 三种对话模式 |
| **分镜系统** | 多镜头管理与全局一致性锁定 |
| **素材库** | 生成结果集中管理 |
| **新手引导** | 角色创建 / 分镜 / 风格迁移三大模板 |

---

## 🏗️ 技术架构

```
src/
├── components/          # UI 组件
│   ├── canvas/          #   ReactFlow 画布核心
│   ├── overlays/        #   设置、引导、命令面板
│   ├── panels/          #   生成栏、相机面板、AI 对话等
│   └── ui/              #   shadcn/ui 组件库 (40+ 组件)
├── lib/                 # 核心业务逻辑
│   ├── tokendance.ts    #   TokenDance API 适配器（图/视频/对话三协议）
│   ├── models.ts        #   40+ AI 模型注册表
│   ├── sculpt-prompt.ts #   SCULPT 提示词系统（1300+ 行框架文档）
│   ├── cameraPresets.ts #   摄影机参数预设
│   ├── cameraLenses.ts  #   镜头数据库
│   ├── workflowParser.ts#   AI 工作流解析器
│   ├── agent-prompts.ts #   7 种创作大师预设提示词
│   └── cidToPrompt.ts   #   角色描述生成器
├── nodes/               # ReactFlow 自定义节点
│   ├── TextNode.tsx
│   ├── GenImageNode.tsx
│   ├── GenVideoNode.tsx
│   ├── InputImageNode.tsx
│   └── CIDBoardNode.tsx
├── stores/              # Zustand 状态管理 (10 个 Store)
│   ├── flowStore.ts     #   画布节点/边状态 + zundo 时间旅行
│   ├── generationStore.ts#  生成任务队列 + 轮询
│   ├── cameraStore.ts   #   摄影机参数 + 预设
│   ├── cameraInjectionStore.ts # 参数注入配置
│   ├── settingsStore.ts #   用户设置 (持久化)
│   ├── chatStore.ts     #   AI 对话
│   ├── historyStore.ts  #   历史记录 (持久化)
│   ├── assetStore.ts    #   素材库
│   └── uiStore.ts       #   UI 面板状态
├── pages/               # 页面路由
│   ├── CanvasPage.tsx   #   画布主页
│   └── PromptTunerPage.tsx #  SCULPT 调优器
├── types/index.ts       # 完整的 TypeScript 类型定义
└── routes.tsx           # 路由配置
```

### 技术选型

| 层级 | 技术 | 版本 |
|------|------|------|
| 构建工具 | RollDown Vite | 7.3 |
| UI 框架 | React | 18 |
| 类型系统 | TypeScript | 5.9 |
| 状态管理 | Zustand | 5.0 |
| 撤销重做 | Zundo | 2.3 |
| 流程画布 | ReactFlow | 11 |
| 组件库 | Radix UI + shadcn/ui | New York |
| 样式方案 | Tailwind CSS | 3.4 |
| 动效 | Motion (Framer) | 12 |
| 图表 | Recharts | 2.15 |
| 表单 | React Hook Form + Zod | 7.66 / 3.25 |
| 包管理 | pnpm | 10 |

---

## 🚀 本地开发

### 环境要求

- **Node.js** ≥ 20
- **pnpm** ≥ 10

### 快速开始

```bash
# 1. 克隆仓库
git clone https://github.com/yangchen0991/Prompt-Engine.git
cd Prompt-Engine

# 2. 安装依赖
pnpm install

# 3. 启动开发服务器
pnpm exec vite --config vite.config.dev.ts --host 127.0.0.1
```

开发服务器默认运行在 **http://127.0.0.1:5173/**

### 配置 API Key

1. 点击右上角齿轮图标打开设置
2. 前往 [tokendance.space](https://tokendance.space/) 获取 API Key
3. 粘贴到设置面板中即可开始生成

---

## 🔌 API 与模型

### TokenDance 网关

所有 AI 模型通过 TokenDance 统一网关 (`https://tokendance.space/gateway`) 调用，支持三种协议：

- **OpenAI 兼容协议** — `/v1/chat/completions`、`/v1/images/generations`
- **ARK 协议** — `/ark/v3/images/generations`（Seedream）、`/ark/v3/seedance/...`（Seedance）
- **阿里协议** — `/alibaba/happyhorse/v1/video-synthesis`（HappyHorse）

### 模型清单

<details>
<summary><b>📸 图像模型 (2)</b></summary>

| 模型 | 提供方 | 协议 |
|------|--------|------|
| Seedream 5.0 Lite | ByteDance | ARK / OpenAI |
| ERNIE Image | Baidu | OpenAI |

</details>

<details>
<summary><b>🎬 视频模型 (6)</b></summary>

| 模型 | 提供方 | 类型 |
|------|--------|------|
| Seedance 2.0 | ByteDance | 文生/图生视频 |
| Seedance 2.0 Fast | ByteDance | 快速视频 |
| HappyHorse 1.0 T2V | Alibaba | 文生视频 |
| HappyHorse 1.0 I2V | Alibaba | 图生视频 |
| HappyHorse 1.0 R2V | Alibaba | 参考生视频 |
| HappyHorse 1.0 Edit | Alibaba | 视频编辑 |

</details>

<details>
<summary><b>💬 对话模型 (31+)</b></summary>

涵盖 **DeepSeek、Qwen、Kimi、GLM、MiniMax、Seed、StepFun、MiMo、UniFuncs** 等头部模型厂商的旗舰模型。

| 代表模型 | 上下文窗口 |
|----------|-----------|
| DeepSeek V4 Pro | 1M |
| Qwen3.7 Max | 1M |
| Kimi K2.6 | 262K |
| GLM 5.1 | 202K |
| MiniMax M2.7 | 200K |

</details>

---

## 🎮 使用指南

### 基础流程

```
输入提示词 → [可选: SCULPT 自动优化] → 选择模型 → 生成 → 节点出现在画布上
```

### 高级玩法

1. **节点连线** — 拖拽节点底部连接点到下一个节点，构建多步流程
2. **角色一致性** — 使用 CIDBoardNode 锁定角色参数，下游所有生成节点共享角色设定
3. **摄影机注入** — 在侧边栏配置摄影机参数，一键注入到生成提示词中
4. **AI 工作流** — 在对话抽屉中描述需求，AI 自动绘制完整工作流
5. **分镜系统** — 批量管理多镜头，全局锁保持视觉一致性
6. **提示词调优** — 切换到调优器页面，用 SCULPT 框架将模糊需求精炼为专业提示词

### 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl+Enter` | 快速生成 |
| `Ctrl+K` | 命令面板 |
| `Ctrl+H` | 历史记录 |
| `Ctrl+Z` / `Ctrl+Y` | 撤销 / 重做 |

---

## 📝 项目状态

项目基于**秒哒 (Miaoda)** 低代码平台生成初始框架，深度依托**腾讯 WorkBuddy** 作为主要 AI 辅助开发平台进行大量定制化开发。当前处于活跃开发阶段。

## 📄 许可证

本项目遵循 **[GNU Affero 通用公共许可证 v3.0 (AGPLv3)](https://www.gnu.org/licenses/agpl-3.0.html)**。

> 核心要求：如果您修改了本项目的代码并通过网络提供服务（包括 SaaS），您必须公开您修改后的完整源代码。详情请参阅 [LICENSE](./LICENSE) 文件。

---

<p align="center">
  <sub>Built with ❤️ by AI-powered creative tools</sub>
</p>
