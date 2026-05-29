# 绘词引擎 V2 — 开发设计总纲

> **版本**：V1.0-master | **基准日**：2026-05-27 | **用途**：一份文档覆盖架构/需求/交互/设计/计划全景  
> **编译自**：PRD.md + TECH-ARCHITECTURE.md + UX-ARCHITECTURE-V2.md + DESIGN-SYSTEM-GUIDE.md + DEVELOPMENT-PLAN-V1.md 等 13 份文档

---

## 目录

| 章 | 主题 | 内容 |
|:--:|------|------|
| 一 | 产品定位 | 一句话定义 + 核心主张 + 竞品矩阵 + 差异化 |
| 二 | 品牌设计 | 命名/Slogan/人格/Logo 方向 |
| 三 | 技术架构 | Monorepo 结构 + 7 Store + 生成Pipeline + Provider 系统 |
| 四 | 功能完成度 | 16 模块矩阵 + 5 节点规格 + 供应商列表 |
| 五 | UX 架构 | 8 断点分析 + 三大原则 + 面板体系重组 + 关键交互流 |
| 六 | 设计系统 | 色彩令牌 + 节点色 + 三主题 + 间距/圆角/阴影/动效 |
| 七 | 开发计划 | 4 Phase × 8 周路线图 + 里程碑 + 风险 |
| 八 | 现状与基线 | 构建/测试/完成度 + 已知技术债 |
| 九 | 关键决策 | 8 ADR + UX 层 7 ADR |
| 十 | 文档索引 | 全部项目文档速查 |

---

## 一、产品定位

### 1.1 一句话定义

**绘词引擎 (Prompt Engine)** 是一个运行在浏览器中的 **可视化 AI 工作流设计平台**，用"节点连线"的方式让创作者像搭乐高一样编排多模态 AI 模型，将提示词、图片、视频串联成自动化创作流水线。

### 1.2 核心价值主张

> "提示词不是终点，而是起点。"

绘词引擎让用户**不只是输入一行 Prompt 拿到一张图**，而是把 Prompt 作为工作流的引擎节点，串联起 **文字 → 图片 → 视频分析 → 分镜拆解 → 批量生成 → 本地保存** 的完整创作链路。

### 1.3 产品画像

| 维度 | 说明 |
|------|------|
| **产品类型** | Web SPA（Single-Page Application） |
| **技术栈** | Vite 5 + React 18 + Zustand 5 + ReactFlow v12 + Tailwind CSS 3 |
| **后端** | Express 4 + better-sqlite3 (端口 9501) |
| **AI 供应商** | TokenDance (词元跳动) 为主要 |
| **部署形态** | 浏览器直接打开 / HTTP 服务器 / Docker |
| **目标用户** | 个人创作者、AI 艺术家、视频制作人、提示词工程师 |
| **竞品类比** | ComfyUI（节点式 AI 工作流）/ Flora（$42M 无限画布）/ Dify（LLM 应用编排） |
| **差异化** | **摄影机参数系统** + **CID Board 角色身份板** + 浏览器运行 + 多供应商 |

### 1.4 竞品矩阵

```
第一层：画布 SDK
├── ReactFlow v12      — V2 底层引擎（扣子/百宝箱同款）
├── tldraw             — 自由白板 SDK
└── Excalidraw         — 手绘风格白板

第二层：AI 图像工作流平台
├── ComfyUI            — 节点式 SD 工作流标杆（开源·仅本地·无视频分析）
├── Flora              — $42M 无限画布（为专业设计师·无摄影机参数系统）
└── Mulan.pro          — 视频批量 Workflow（闭源）

第三层：AI 视频创作平台
├── LibTV              — 剧本→分镜→视频全流程（绑定 LiblibAI）
├── TapNow             — Agentic 创意画布（无节点画布）
└── 绘词引擎 V2        ★ 画布 + 多模态 + 摄影机系统 + CID Board

第四层：通用白板/协作
├── Figma/FigJam       — 设计协作
├── Miro               — 企业级白板
└── DeepNotes          — 深度嵌套画布
```

### 1.5 差异化定位

| 平台 | 强项 | 弱项 |
|------|------|------|
| ComfyUI | SD 生态最全、社区节点海量 | 仅本地、无视频分析、无分镜系统 |
| Flora | 专业设计师友好、$42M 融资 | 无摄影机参数系统、无 CID Board |
| Mulan | 视频批量生成 Workflow | 非开源、无摄影机参数系统 |
| LibTV | 剧本→分镜→视频闭环 | 绑定 LiblibAI、无角色系统 |
| TapNow | 多场景模板、Agent 聊天式 | 闭源、无节点画布 |
| **绘词引擎 V2** | **摄影机参数系统 + CID Board + 多供应商 + 浏览器运行** | 成熟度不足（~52%） |

---

## 二、品牌设计

### 2.1 品牌定位

| 维度 | 描述 |
|------|------|
| **人格** | 暗房里的数字工匠 — 严谨的创作者 + 好奇的探索者 |
| **情绪** | 专注、流畅、沉浸、精准 |
| **核心隐喻** | 无限延展的暗房工作台，光来自每个节点亮起时的蓝色 |
| **Slogan** | 「提示词，即是画笔」 |
| **英文 Slogan** | "Where prompts become pipelines." |
| **品牌色** | `#2563eb` (Tailwind blue-600) |
| **基准设计系统** | Linear（极简暗色工具 UI 天花板） |

### 2.2 品牌命名逻辑

| 字 | 含义 | 品牌关联 |
|----|------|---------|
| **绘** | 描绘、绘制、创造 | 视觉创作的动词 |
| **词** | 词语、Prompt、语言 | 提示词是 AI 时代的"画笔" |
| **引擎** | Engine，动力核心 | 它不是工具，是驱动创作的发动机 |

### 2.3 Logo 设计方向

| 方向 | 描述 |
|------|------|
| **A. 节点之光（推荐）** | 发光六边形节点 + 向外辐射连接线，品牌蓝主色 |
| **B. PE 字母标** | "P" 和 "E" 融合变形为节点 + 连线 |
| **C. 无限引擎** | 齿轮 + 无限符号 ∞ + 笔尖组合，蓝渐变 |

### 2.4 视觉参考

| 参考 | 借取元素 |
|------|---------|
| ComfyUI | 节点式界面、暗黑主题、连线风格 |
| Figma/FigJam | 无限画布、流畅缩放 |
| Linear | 暗黑模式配色、边框分割哲学、极简排版 |
| VS Code | 面板布局、图标风格 |

---

## 三、技术架构

### 3.1 技术栈

```
前端:         Vite 5.4 + React 18.2 + Zustand 5.0 + ReactFlow v12.10 + Tailwind CSS 3.4
状态管理:     7 个 Zustand Store + zundo 2.3 (undo/redo temporal middleware)
构建:         Vite + @vitejs/plugin-react 4.2
测试:         Vitest 1.6 + @testing-library/react 16.3 + jsdom 29.1
后端:         Express 4 + better-sqlite3 + cors
共享层:       TypeScript (API 类型/端点/客户端契约)
设计系统:     shared/design-tokens/ (12 文件 · 2244 行 · Linear 基准 · 三主题)
```

### 3.2 技术选型理由

| 技术 | 版本 | 选型理由 |
|------|:----:|---------|
| **React 18** | 18.2 | 成熟生态 + 并发特性 + 社区最广 |
| **Zustand 5** | 5.0 | 轻量（~2KB）+ 无 Provider 嵌套 + 原生支持 ReactFlow 受控 |
| **ReactFlow v12** | 12.10 | 扣子/百宝箱同款引擎 + 原生 dark mode + smoothstep 连线 |
| **zundo** | 2.3 | ReactFlow 社区推荐的 undo/redo 方案 |
| **Vite 5** | 5.4 | 秒级 HMR + 原生 ESM + Rollup 构建 |
| **Tailwind CSS** | 3.4 | 设计令牌 Tailwind preset 无缝集成 |
| **Express** | 4.x | 简单可靠的 Node.js HTTP 框架 |
| **better-sqlite3** | — | 同步 API + 零配置 + 适合本地工具场景 |

### 3.3 Monorepo 结构

```
prompt-engine/
├── packages/
│   ├── frontend/src/
│   │   ├── app/App.jsx                      # 应用编排
│   │   ├── stores/                           # 7 个 Zustand Store
│   │   │   ├── useFlowStore.js               ★ 核心画布 Store + zundo
│   │   │   ├── useModelStore.js              模型/供应商/Credentials
│   │   │   ├── useAppStore.js                主题/语言/Toast
│   │   │   ├── useChatStore.js               对话会话
│   │   │   ├── useHistoryStore.js            生成历史
│   │   │   └── useStoryboardStore.js         分镜/角色/锁定
│   │   ├── hooks/                            # 编排器状态机
│   │   │   ├── useGenerationOrchestrator.js   ★ 生成 Pipeline 状态机
│   │   │   ├── useUndoRedo.js                 zundo wrapper
│   │   │   ├── useBatchOrchestrator.js        批量调度（骨架）
│   │   │   └── ...
│   │   ├── providers/                        # AI 适配器（适配器模式）
│   │   │   ├── registry.js                   Provider Registry
│   │   │   ├── tokendance.js                 ★ TokenDance 完整适配
│   │   │   └── ollama.js                     Ollama 本地模型
│   │   ├── features/                         # 8 个功能模块
│   │   │   ├── canvas/                       # 画布（ReactFlow + 5 节点）
│   │   │   ├── generation/                   # 生成面板（将替代为 UnifiedGenBar）
│   │   │   ├── model-config/                 # 模型/API Key 配置
│   │   │   ├── history/                      # 历史记录
│   │   │   ├── chat/                         # AI 对话
│   │   │   ├── characters/                   # 角色管理 + CID Board
│   │   │   └── storyboard/                   # 分镜系统
│   │   ├── components/camera/                # 摄影机控制组件
│   │   └── assets/                           # 资产管理库
│   ├── backend/src/                          # Express + SQLite（:9501）
│   └── shared/
│       ├── src/                              # TS API 契约
│       └── design-tokens/                    ★ 完整设计令牌系统（12 文件·2244 行）
│           ├── tailwind-preset.js            Tailwind CSS preset
│           ├── colors.js                     三主题色板 + 节点分类色
│           ├── index.js                      CSS 变量生成 + 主题切换 API
│           └── DECISION.md                   设计决策记录
├── tests/              # 10 测试文件 · 140 用例
├── dist/               # 构建产物（~4.3MB，gzip ~430KB）
├── deliverables/       # 设计/架构/UX 文档
└── node_modules/
```

### 3.4 整体分层架构

```
浏览器 (SPA)
├── App.jsx 编排层
│   ├── CanvasViewport (ReactFlow v12 + 5 自定义节点)
│   │   ├── CanvasToolbar (撤销/重做)
│   │   └── ContextMenu (右键菜单)
│   ├── 面板层 (8 个浮动面板 → 5 层体系重构中)
│   └── StatusBar (待实现)
├── Zustand Stores (7)
│   ├── useFlowStore ★ (nodes/edges + zundo temporal)
│   ├── useModelStore (providers/keys/modelLibrary)
│   ├── useAppStore (theme/lang/toast)
│   ├── useHistoryStore (items/stats)
│   ├── useChatStore (messages/sessions)
│   └── useStoryboardStore (shots/locks)
├── Orchestrator Hooks (5)
│   ├── useGenerationOrchestrator ★ (状态机: IDLE→SUBMIT→POLL→DONE)
│   ├── useUndoRedo
│   ├── useBatchOrchestrator
│   └── ...
└── Provider 适配器
    ├── TokenDance (Chat/Image/Video)
    └── Ollama (Chat)
```

### 3.5 7 个 Store 职责边界

| Store | 行数 | 职责 | 持久化 |
|-------|:----:|------|:------:|
| `useFlowStore` | 168 | ReactFlow nodes/edges + zundo undo/redo | ❌ 内存 |
| `useModelStore` | 229 | 供应商/模型库/API Key | ✅ localStorage |
| `useAppStore` | 32 | 主题/语言/性能/Toast | ❌ 内存 |
| `useChatStore` | 21 | 对话会话/消息 | ❌ 内存 |
| `useHistoryStore` | 115 | 生成历史/统计/过滤 | ✅ localStorage |
| `useStoryboardStore` | 39 | 分镜/角色/全局锁 | ❌ 内存 |

### 3.6 生成 Pipeline 状态机

```
GEN_STATES: IDLE → SUBMITTING → POLLING → DONE
                         ↓
                       FAILED
            (任意) → CANCELLED

Image 同步: SUBMIT → 直接返回 → DONE
Image 异步: SUBMIT → POLLING (300次×3s) → DONE/FAILED
Video 全异步: SUBMIT → POLLING (300次×3s) → DONE/FAILED
```

### 3.7 Provider 适配器系统

```
providerRegistry (全局单例)
├── TOKENDANCE (词元跳动)
│   ├── Chat: POST /v1/chat/completions
│   ├── Image: POST /v1/images/generations (同步+异步)
│   └── Video: POST /ark/v3/{engine}/generations/tasks (全异步)
└── OLLAMA (本地)
    └── Chat: POST /api/chat (OpenAI 格式兼容转换)
```

### 3.8 生成请求完整链路

```
用户操作 → Panel/Node → useGenerationOrchestrator
  → useModelStore.getState() → apiKey/model
  → TokenDance Provider → TokenDance API
  → 同步：直接返回 results
  → 异步：轮询 /v1/images/tasks/{id} (max 300次)
  → onResult(results)
  → useFlowStore.updateNodeData(id, {status, resultUrl})
  → useHistoryStore.updateItem(taskId, {status, url})
```

### 3.9 ReactFlow 集成关键设计

- **nodeTypes 在模块顶层定义**（避免每次渲染重建触发全量节点重渲染）
- **Zustand 受控模式**：nodes/edges 通过 Store 管理，ReactFlow UI 事件同步回 Store
- **zundo temporal 拖拽优化**：`onNodeDragStart=pause` / `onNodeDragStop=resume`，避免拖拽中每帧记录历史
- **连接验证**：防自环 + 防重复连线

### 3.10 构建与部署

| 方案 | 命令 | 适用场景 |
|------|------|---------|
| HTTP 服务器 | `python -m http.server 9607` | 本地开发/演示 |
| 批处理 | `打开页面.bat` | Windows 一键启动 |
| Docker | `docker compose up` | 生产部署 |
| 静态托管 | 直接部署 dist/ | Vercel/Netlify/EdgeOne |

构建产物：~4.3MB (16 JS + 9 CSS + 5 图片)，gzip 后约 430KB。

---

## 四、功能完成度

### 4.1 功能矩阵

| # | 模块 | 状态 | 完成度 | 核心文件 | 说明 |
|---|------|:----:|:------:|---------|------|
| 1 | **画布基础** | ✅ | 95% | ReactFlowCanvasViewport + useFlowStore | 5 节点 + zundo undo/redo + 右键菜单 |
| 2 | **生成管道** | ✅ | 85% | useGenerationOrchestrator + GenerationPanel | Image + Video 同步/异步双模式 |
| 3 | **模型配置** | ✅ | 90% | SettingsPanel + useModelStore | TokenDance 20 模型 + Ollama |
| 4 | **历史记录** | ✅ | 80% | HistoryPanel + useHistoryStore | 类型筛选 + 预览 + 删除 |
| 5 | **AI 对话** | ⚠️ | 40% | ChatPanel + useChatStore | 基础对话，缺少 Agent 模式 |
| 6 | **摄影机控制** | ⚠️ | 30% | camera.js + WheelPicker | 数据定义完整，未接入生成提示词注入 |
| 7 | **CID Board** | ✅ | 90% | CIDBoardNode + cidBoardPrompt | 角色参数完整，缺少批量生成 |
| 8 | **分镜系统** | ⚠️ | 35% | StoryboardPanel + useStoryboardStore | 6 镜网格 UI 就绪，业务逻辑 TODO |
| 9 | **资产管理库** | ⚠️ | 50% | AssetLibrary | 9 种类型，纯内存无持久化 |
| 10 | **协作系统** | ❌ | 0% | — | Yjs + WebSocket 全部禁用 |
| 11 | **多主题** | ⚠️ | 30% | app.css + useAppStore | CSS 存在，Store 未连接 |
| 12 | **国际化** | ❌ | 5% | i18n/index.js | 仅骨架文件 |
| 13 | **视频分析** | ❌ | 0% | — | 抽帧/反推/AB 对比全未迁移 |
| 14 | **导出系统** | ❌ | 0% | — | ZIP/PDF/项目文件导出 |
| 15 | **后端 API** | ⚠️ | 50% | backend/src | assets CRUD 就绪 |
| 16 | **测试** | ✅ | 完整 | 10 文件 140 用例 | 缺少 E2E |

**总体完成度：~52%**

### 4.2 核心节点类型（5 种）

| 节点 | 标识色 | 标签 | 尺寸 | 功能 |
|------|--------|------|------|------|
| **TextNode** | 蓝 `#3b82f6` | Text | 260×80 | 文本提示词输入 |
| **GenImageNode** | 紫 `#a855f7` | Image | 380×520 | 文生图 + WheelPicker 摄影机控制 |
| **GenVideoNode** | 青 `#06b6d4` | Video | 380×520 | 文生视频，异步轮询 |
| **InputImageNode** | 蓝 `#3b82f6` | Input | 260×200 | 上传/拖入参考图片 |
| **CIDBoardNode** | 金 `#f59e0b` | CID | 280×520 | 角色身份控制板 |

> **ADR-005 修正**：GenImageNode 头部从蓝 `#60a5fa` 改为紫 `#a855f7`，GenVideoNode 头部从 amber `#f59e0b` 改为青 `#06b6d4`。

### 4.3 接入的 AI 服务商

| 服务商 | 协议 | 模型数量 | 能力 |
|--------|------|:------:|------|
| **TokenDance（词元跳动）** | OpenAI / Anthropic / Seedance | 20 | Chat + Image + Video + 向量 |
| **Ollama** | 原生 OpenAI 兼容 | 动态获取 | Chat（本地） |

---

## 五、UX 架构

### 5.1 八大 UX 断点

| # | 断点 | 严重度 | 修复 Phase | 核心解决方案 |
|:--:|------|:------:|:------:|------|
| 1 | GenerationPanel 与 GenImageNode 双重生成入口 | 🔴 | P1.1 | UnifiedGenBar 统一入口 |
| 2 | 8 个面板各自为政，无导航关系 | 🔴 | P2.1-2.5 | 面板体系重组（Dock/Drawer/Modal） |
| 3 | 空画布冷启动——新用户 30 秒内迷失 | 🔴 | P1.4-1.6 | Onboarding 引导 + 模板 |
| 4 | 结果反馈断裂——生成后不知去哪看 | 🔴 | P1.3 + P1.5 | Toast + 结果快捷操作 |
| 5 | Chat 面板与画布绝对隔离 | 🟡 | P3.1 | Agent 模式升级 |
| 6 | 摄影机参数埋在 520px 节点内部 | 🟡 | P2.2-2.3 | 属性面板 + 预设系统 |
| 7 | 分镜与画布完全割裂 | 🟡 | P3.2-3.3 | 分镜节点联动 + 批量管道 |
| 8 | 全局状态缺失——无连接/进度/通知 | 🔴 | P1.2 | 全局 StatusBar |

### 5.2 三大设计原则

**原则 1：Canvas-First（画布即中心）**
- 画布占据全部可用空间，工具按需浮出（overlay/抽屉模式）
- 不再有始终可见的 GenerationPanel 固定在右上角
- 不再有 7 个按钮排成一行

**原则 2：Context-Sensitive（上下文驱动）**
- 选中什么 → 显示什么（而非用户去找工具）
- 未选中节点 → 引导创建
- 选中文本节点 → 显示提示词编辑器
- 选中生成节点 → 显示参数+相机+结果
- 选中多个节点 → 显示批量操作选项

**原则 3：Progressive Disclosure（渐进式揭示）**
- 新手 → 3 个模板，快速上手
- 中级 → 5 种节点 + Ctrl+K 搜索 + 右键菜单
- 高级 → 自定义节点 + 快捷方式 + 手动连线 + 批量调度

### 5.3 面板体系重组

```
旧体系（8 个独立浮动面板）           新体系（5 层结构）

SettingsPanel                   → ① Modal（设置弹窗）
CharactersPanel                 → ② Right Dock（右侧属性面板，上下文驱动）
StoryboardPanel                 → ③ Full-screen Mode（全屏模式）
ChatPanel                       → ④ Slide-in Drawer（右侧滑出，Agent 模式）
HistoryPanel                    → ② Right Dock（右侧属性面板，底部 tab）
AssetLibrary                    → ⑤ Bottom Drawer（底部抽屉）
AddNodePanel                    → ⑦ Cmd+K Palette（Ctrl+K 搜索面板）
GenerationPanel                 → ⑧ Unified Generation Bar（顶部统一生成栏）
  （无）                         → ⑥ Global Status Bar（底部全局状态栏）
```

### 5.4 新布局全景

```
┌──────────────────────────────────────────────────────────────────────┐
│ ⑧ [模型: seedream ▾] [风格: 无 ▾] [提示词输入...              ] [⚡] │ ← Unified Gen Bar
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│                         ReactFlow 无限画布                            │
│                     （占据全部可用空间）                               │
│    ┌────────┐          ┌──────────────────┐                         │
│    │ Text   │─────────▶│   GenImage       │                         │
│    │ Node   │          │   running ●●●    │                         │
│    └────────┘          └──────────────────┘                         │
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤
│ ⑥ [● 已连接 TokenDance] [今日: 23张] [额度: 500/1000]  [生成中 67%] │ ← Status Bar
└──────────────────────────────────────────────────────────────────────┘
                                          ② 属性面板（选中节点时出现）
                                          ┌────────────────────┐
                                          │ 🎨 GenImage Node    │
                                          │ 提示词 / 摄影机      │
                                          │ 结果 / 历史          │
                                          └────────────────────┘
```

### 5.5 关键交互流

#### 首次体验（Onboarding）
```
Step 0: 空画布 + 欢迎覆盖层（"提示词，即是画笔"）
  ┌─────────────────────────────┐
  │ 🌟 导入示例工作流（推荐）      │
  │ 🔑 配置 API Key              │
  │ 🎨 直接开始空白画布           │
  └─────────────────────────────┘

Step 1: 选择模板
  ┌──────────┐ ┌──────────┐ ┌──────────┐
  │ 🎨 角色设计 │ │ 🎬 短片分镜 │ │ 🖼 风格迁移 │
  │ Text→Image │ │ 6镜+批量   │ │ Input→Img │
  └──────────┘ └──────────┘ └──────────┘

Step 2: 画布自动创建节点+连线 → 右侧属性面板自动打开
Step 3: 用户改提示词 → 点「⚡」→ 30 秒内看到第一张图
```

#### 生成→结果→迭代（Result Flow）
```
用户点统一生成栏「⚡」
  → 节点边框脉冲 + 底部状态栏显示「生成中 12%」
  → 完成时：Toast 通知 + 节点绿色闪烁 + 状态栏更新
  → 结果出现在节点预览区
  → 右侧属性面板「结果 tab」显示最近 5 个结果
  → 每个结果旁快捷操作：
    [🖼 预览] [🔄 变体] [📋 作输入] [💾 保存] [🗑]
```

#### 摄影机参数→一号位提升
```
节点折叠态摘要（1 行）：
┌──────────────────────────────────────┐
│ 🎨 Image   [seedream]   ●           │
│ 📷 Leica M10 · 50mm · f/2.0        │
└──────────────────────────────────────┘

右侧属性面板 → 摄影机 tab：
┌────────────────────┐
│ 📷 摄影机参数        │
│ 🎯 快速预设          │
│ [电影感] [复古] [清新]│
│ [赛博朋克] [纪实]    │
│ 设备/镜头/焦距/...   │
│ 📐 参数预览文本       │
│ [💾 保存为我的预设]   │
└────────────────────┘

8 个内置预设：
电影感: Leica M10, 50mm, f/2.0, ISO 400, 1/125
复古:   Pentax K1000, 35mm, f/5.6, ISO 200, 1/60
赛博:   Sony A7S III, 24mm, f/1.4, ISO 1600, 1/30
纪实:   Canon 5D, 85mm, f/2.8, ISO 800, 1/250
清新:   Fuji X-T4, 35mm, f/4.0, ISO 100, 1/500
人像:   Hasselblad 500CM, 80mm, f/2.8, ISO 200, 1/125
风光:   Nikon D850, 14mm, f/11, ISO 64, 1/60
微距:   Olympus OM-1, 60mm macro, f/4.0, ISO 400, 1/200
```

#### Chat → Agent 模式升级
```
用户: 帮我创建一个角色设计的工作流
Agent: 好的，我在画布上创建了：
       📝 TextNode → 🎨 GenImageNode
       TextNode 已填入角色描述模板
       GenImageNode 已配置 seedream 模型
       （画布上自动出现 2 个连线节点）

用户: 把当前画布上的图片节点都改成 16:9 尺寸
Agent: 已找到 3 个 GenImageNode，尺寸改为 1280×720。
```

#### 分镜一体化工作流
```
① 用户在分镜面板写 6 个镜头的描述
② 配置全局锁定（角色/场景/风格/色调/画幅）
③ 从 CID Board 选择一个角色
④ 点击「一键生成全部 6 镜」
   → 画布自动创建 6 个 GenImageNode（各自对应一个镜头）
   → 节点间自动连线
   → 提示词 = 镜头描述 + 全局锁定参数
   → 批量调度器按顺序执行
⑤ 状态栏显示「分镜生成：3/6」
⑥ 全部完成后 → Toast 通知 + 节点显示结果
```

### 5.6 用户旅程映射

| 角色 | 首次行为 | 核心目标 | 关键断点 |
|------|---------|---------|:------:|
| AI 视觉创作者 | 输入提示词→生成图 | 多模型切换/批量生成/参数快速迭代 | #1 #4 #6 |
| 视频内容制作人 | 视频分析→分镜→批量产出 | 分镜拆解/批量生成/风格一致 | #7 #1 |
| 提示词工程师 | 提示词 A/B 对比测试 | 多模型对比/参数微调/结果记录 | #1 #4 #6 |
| 新手探索者 | 打开应用，想知"能做什么" | 快速上手/模板/引导 | #3 #8 |

---

## 六、设计系统

### 6.1 设计令牌系统架构

```
shared/design-tokens/  (12 文件 · 2244 行)

数据源 (JS Modules)
├── colors.js       → 三主题色板 + 5 节点分类色
├── typography.js   → 字体族/字号阶梯/字重
├── spacing.js      → 4px 基准间距体系
├── radii.js        → 4 级圆角
├── shadows.js      → 三主题阴影
├── motion.js       → 5 级时长 + 4 条缓动 + 7 种关键帧
├── glass.js        → 3 级毛玻璃
├── glow.js         → 4 级霓虹光效
└── layout.js       → Z-Index 12 级 + 断点 + 容器

编译输出
├── tailwind-preset.js   → Tailwind CSS theme.extend
└── index.js             → CSS 变量生成 + 主题切换 API
```

### 6.2 色彩系统（暗黑模式 · 默认）

| 角色 | HEX | CSS 变量 | Tailwind 类名 | 用途 |
|------|-----|----------|--------------|------|
| 画布背景 | `#09090b` | `--pe-bg-canvas` | `bg-pe-bg-canvas` | 主画布底色 |
| 面板背景 | `#131317` | `--pe-bg-surface` | `bg-pe-bg-surface` | 面板/卡片 |
| 次级面板 | `#1a1a20` | `--pe-bg-elevated` | `bg-pe-bg-elevated` | 悬浮面板 |
| 输入区域 | `#22222a` | `--pe-bg-overlay` | `bg-pe-bg-overlay` | 弹窗/输入框 |
| 标准边框 | `#27272a` | `--pe-border-default` | `border-pe-border-default` | 标准边框 |
| 强调边框 | `#3f3f46` | `--pe-border-strong` | `border-pe-border-strong` | 焦点 |
| 主文字 | `#fafafa` | `--pe-text-primary` | `text-pe-text-primary` | 标题 |
| 次文字 | `#a1a1aa` | `--pe-text-secondary` | `text-pe-text-secondary` | 描述 |
| 辅文字 | `#71717a` | `--pe-text-tertiary` | `text-pe-text-tertiary` | 辅助 |
| 禁用文字 | `#52525b` | `--pe-text-disabled` | `text-pe-text-disabled` | 占位符 |
| 品牌主色 | `#2563eb` | `--pe-accent` | `bg-pe-brand` | 主操作 |
| 成功色 | `#22c55e` | `--pe-success` | `bg-pe-success` | 完成/连接 |
| 警告色 | `#f59e0b` | `--pe-warning` | `bg-pe-warning` | 提醒 |
| 错误色 | `#ef4444` | `--pe-error` | `bg-pe-error` | 失败 |
| 信息色 | `#06b6d4` | `--pe-info` | — | 信息 |
| 链接色 | `#60a5fa` | `--pe-link` | `text-pe-link` | 链接 |

### 6.3 节点分类色（ColorBrewer · 色盲友好）

| 节点 | 颜色 | CSS 变量 | Tailwind 类名 |
|------|------|----------|--------------|
| TextNode (LLM) | `#3b82f6` 蓝 | `--pe-node-llm` | `text-pe-node-llm` |
| GenImageNode | `#a855f7` 紫 | `--pe-node-image` | `text-pe-node-image` |
| GenVideoNode | `#06b6d4` 青 | `--pe-node-video` | `text-pe-node-video` |
| CIDBoardNode | `#f59e0b` 金 | `--pe-node-audio` | `text-pe-node-audio` |
| InputImageNode | `#64748b` 灰 | `--pe-node-utility` | `text-pe-node-utility` |

### 6.4 三主题系统

| 模式 | 属性 | 感受 |
|------|------|------|
| `dark` (默认) | `data-theme="dark"` | 专业、沉浸、护眼 |
| `light` | `data-theme="light"` | 清晰、现代、日间 |
| `solarized` | `data-theme="solarized"` | 温暖、阅读友好、复古 |

### 6.5 Tailwind Token 类名速查

```
// 背景
bg-pe-bg-canvas / bg-pe-bg-surface / bg-pe-bg-elevated / bg-pe-bg-overlay

// 边框
border-pe-border-default / border-pe-border-strong / border-pe-border-subtle

// 文字
text-pe-text-primary / text-pe-text-secondary / text-pe-text-tertiary / text-pe-text-disabled

// 语义色
bg-pe-brand / bg-pe-brand-hover / text-pe-success / bg-pe-warning / bg-pe-error

// 节点分类色
text-pe-node-llm / text-pe-node-image / text-pe-node-video / text-pe-node-audio / text-pe-node-utility

// 圆角
rounded-pe-subtle (4px) / rounded-pe-control (8px) / rounded-pe-card (14px) / rounded-pe-pill (full)

// 阴影
shadow-pe-node / shadow-pe-lift / shadow-pe-dropdown / shadow-pe-modal

// 动效
transition-all duration-pe-fast (120ms) / duration-pe-normal (200ms) / animate-pe-glow-pulse
```

### 6.6 设计原则

1. **边框分割优先** — 用 1px 细边框区分层级，阴影仅在 lift 状态使用
2. **排版即层级** — 9px-14px 紧凑阶梯，不靠装饰区分信息
3. **色彩克制** — 界面 95% 单色，色彩仅用于状态标记

### 6.7 设计禁区

- ❌ 大圆角 (>8px) · ❌ 渐变背景 · ❌ 过饱和色彩
- ❌ 弥散阴影 · ❌ 暖色调底色 · ❌ 反光/玻璃态效果
- ❌ emoji 作为 UI 元素 · ❌ 全大写英文标签

### 6.8 组件模式

**面板卡片**：`bg-pe-bg-surface border border-pe-border-default rounded-pe-card shadow-pe-dropdown p-4`

**输入框**：`w-full px-3 py-2 text-xs rounded-pe-control bg-pe-bg-overlay border border-pe-border-default text-pe-text-primary outline-none`

**主按钮**：`bg-pe-brand text-white hover:bg-pe-brand-hover disabled:bg-pe-bg-overlay disabled:text-pe-text-disabled`

**节点状态**：idle (default border) / selected (brand border) / running (pulse animation) / success (green) / fail (red)

---

## 七、开发计划

### 7.1 总览

> **基准日期**：2026-05-27 | **目标完成**：2026-07-22（8 周）  
> **北极星**：用户打开链接 → 30 秒内看到第一个成果 → 被摄影机参数精准控制震撼 → 可分享工作流

| Phase | 周期 | 主题 | 核心产出 |
|:---:|------|------|---------|
| **A** | Week 1-3 | 地基夯实 | 设计令牌落地 + 摄影机参数集成 + ResultBus + UnifiedGenBar + StatusBar + Toast + Onboarding |
| **B** | Week 4-5 | 面板重组 | RightDock + CameraTab + CameraPresets + CmdKPalette + 面板 Dock 化 + 旧面板令牌迁移 |
| **C** | Week 6-7 | 工作流打通 | 分镜联动 + 批量生成 + E2E 补全 + 动效注入 + 三主题切换 |
| **D** | Week 8 | 打磨发布 | 性能优化 + 文档 + app.css 清理 + 打包发布 |

### 7.2 Phase A · 地基夯实（Week 1-3）

**目标**：修复全部 6 项 🔴 阻塞级问题。

| 任务 | 描述 | 预计 |
|------|------|:--:|
| A.0 设计令牌全局注入 | main.jsx 注入 generateAllThemesCSS() + initTheme() | 0.5d |
| A.1 设计令牌核心迁移 | 7 个文件消除硬编码色值（GenImageNode/GenVideoNode/TextNode/InputImageNode/CIDBoardNode/App.jsx/ReactFlowCanvasViewport） | 3d |
| A.2 摄影机参数集成 | cameraToPromptText() + 8 预设 + GenerationPanel 集成 | 3d |
| A.3 GenerationResultBus | resultBus.onResult() 统一处理生成结果落点 | 2d |
| A.4 新 UX 组件 | UnifiedGenBar + StatusBar + Toast + ToastStore + App.jsx 集成 | 3d |
| A.5 Onboarding 引导 | OnboardingOverlay + 3 模板 JSON + localStorage 检测 | 2d |
| A.6 结果快捷操作 | GenImageNode 结果上叠加「变体」按钮 | 0.5d |

**Phase A 验收清单**：（12 项）
- `npm run gate` 零错误
- `npm run test` 140/140 通过
- 设计令牌 DevTools 可查 CSS 变量
- 5 节点 + App.jsx 无硬编码色值
- 新用户 30 秒内完成首次生成
- 只有一个生成入口（UnifiedGenBar）
- 生成完成有 Toast 通知
- 无选中节点生成 → 结果自动落画布
- 状态栏显示 API 连接和生成进度
- 首次启动出现 Onboarding 引导
- 选择模板后画布自动创建节点
- 生成结果旁有「变体」按钮

### 7.3 Phase B · 面板重组（Week 4-5）

**目标**：修复 #2 #6 断点——让工具在需要时出现。

| 任务 | 描述 |
|------|------|
| B.1 旧面板令牌迁移 | 10 个面板文件迁移设计令牌 |
| B.2 RightDock + CameraTab | 右侧属性面板 + 摄影机参数 Tab（预设+WheelPicker） |
| B.3 CameraPresets 保存 | 自定义预设 localStorage 持久化 |
| B.4 CmdKPalette | Ctrl+K 搜索面板（节点+操作） |
| B.5 面板体系落地 | 7 个独立面板→Dock/Drawer/Modal 体系 |

**Phase B 验收**：RightDock 上下文驱动 + 摄影机参数从节点移到面板 + Ctrl+K 搜索创建节点 + 旧浮动按钮替换 + 未选中节点时界面干净。

### 7.4 Phase C · 工作流打通（Week 6-7）

**目标**：修复 #5 #7 断点——让分镜和批量生成真正可用。

| 任务 | 描述 |
|------|------|
| C.1 分镜一体化 | useStoryboardOrchestrator + useBatchOrchestrator 实现 + StoryboardPanel 重构 |
| C.2 动效全面注入 | 面板滑入/滑出 + 节点折叠/展开 + glow/glass 效果 |
| C.3 E2E 测试补全 | 6 个 Playwright 用例（Onboarding/Generation/RightDock/CmdK/Storyboard） |
| C.4 三主题切换 | useAppStore.setTheme() 连接设计令牌 API |

### 7.5 Phase D · 打磨发布（Week 8）

**目标**：清理、优化、打包、发布。

| 任务 | 描述 |
|------|------|
| D.1 | 删除 app.css 中已被设计令牌替代的旧规则 |
| D.2 | Lighthouse 性能优化（目标 ≥85） |
| D.3 | 虚拟滚动（100+ 节点帧率 ≥20fps） |
| D.4 | README.md 更新（开发指南 + 架构图 + 快速开始） |
| D.5 | `npm run gate` + E2E 全量通过 |
| D.6 | Docker 镜像 + 静态部署脚本 |

### 7.6 关键里程碑

| 节点 | 日期 | 标志 |
|------|------|------|
| M1 — 地基完成 | Week 3 末 | 用户可完成「打开 → 生成 → 查看 → 再生成」完整流程 |
| M2 — 面板就绪 | Week 5 末 | 画布全屏，工具按需浮出，摄影机参数独立面板可用 |
| M3 — 功能冻结 | Week 7 末 | 分镜批量生成 + E2E 全覆盖 + 三主题可切换 |
| M4 — 发布 | Week 8 末 | V1.0.0 正式发布 |

### 7.7 全局依赖关系图

```
Phase A                           Phase B                    Phase C                   Phase D

A.0 CSS变量注入 ────────────────────────────────────────────────────────────────────→ 全部依赖
   │
   ├─→ A.1 令牌迁移 ──────────────→ B.1 面板迁移 ────────→ C.2 动效注入 ──→ D.1 CSS清理
   │     │
   │     └─→ A.4 UnifiedGenBar ──→ B.5 面板落地
   │           StatusBar
   │           Toast
   │
   ├─→ A.2 摄影机集成 ────────────→ B.2 CameraTab ──────→ C.1 分镜联动
   │                               B.3 Presets保存
   │
   ├─→ A.3 ResultBus ────────────────────────────────────────────────────────────────→ 全部生成路径
   │
   ├─→ A.5 Onboarding
   │
   └─→ A.6 结果快捷操作
```

### 7.8 明确砍掉的功能（V1.1）

| 功能 | 理由 |
|------|------|
| Ollama 本地模型 | 对无本地安装用户零价值 |
| Chat Agent 模式 | 依赖未就绪组件，降为 V1.1 |
| 国际化 (i18n) | 仅 5% 骨架，非核心路径 |
| 社区模板市场 | Phase C 仅做硬编码 3 模板 |
| AB 图像对比 | 功能未定义，交互未设计 |

### 7.9 风险登记

| 风险 | 概率 | 缓解 |
|------|:---:|------|
| 设计令牌迁移引入视觉回归 | 中 | 渐进式迁移，每文件构建验证 |
| TokenDance API 不稳定 | 中 | V1.1 恢复 Provider Registry 多供应商 |
| E2E 时间不足 | 中 | Phase A 结束后立即启动 E2E |
| 摄影机参数效果不可验证 | 低 | 8 个预设做 A/B 测试 |
| 100+ 节点性能不达标 | 低 | `.perf-mode` 降级策略 |

---

## 八、现状与基线

### 8.1 质量指标

| 指标 | 状态 | 数值 |
|------|:----:|------|
| 构建 | ✅ 通过 | 0 错误，~449KB JS gzip |
| 测试 | ✅ 通过 | 10 文件，140/140 |
| 完成度 | ⚠️ | ~52%（8 面板中 4 个就绪） |
| Git | ✅ 干净 | 最新提交 `8c44639` |
| 设计令牌 | ⚠️ | 系统完整，代码未落地 |

### 8.2 测试覆盖

```
tests/
├── unit/ (9 文件)
│   ├── stores.test.js
│   ├── generation-orchestrator.test.js
│   ├── providers.test.js
│   ├── all-providers.test.js
│   ├── canvas-viewport.test.js
│   ├── utils.test.js
│   ├── cid-board.test.js
│   ├── shot-annotation.test.js
│   └── prompt-templates.test.js
└── integration/ (1 文件)
    └── build-integrity.test.js

缺失：E2E 测试（Playwright）、组件测试、性能测试、无障碍测试
```

### 8.3 已知技术债

1. **设计令牌未落地** — 设计令牌系统完整（2244 行），但所有源码使用硬编码内联样式
2. **双重 Store 问题（已修复）** — useCanvasStore 已删除，统一使用 useFlowStore
3. **Provider Registry 未集成** — 已定义但未实际使用，硬编码调用 TOKENDANCE
4. **app.css 主题规则重复** — `.theme-dark/.theme-light/.theme-solarized` 与设计令牌系统功能重复
5. **useBatchOrchestrator 空壳** — 状态机存在，业务逻辑未实现
6. **useStoryboardOrchestrator 空壳** — 同上
7. **ChatPanel 与画布零交互** — 独立对话，未感知画布状态

### 8.4 关键 Bug 教训

1. **Zustand selector 禁止返回新引用** — `s.getModelsByType('Image')` 配合 `filter/map` 导致无限重渲染白屏
   - 正确：selector 只取原始数据，`useMemo` 在组件层过滤
2. **`transform: scale()` 不适合全局缩放** — vw/vh 计算问题导致内容溢出
   - 正确：`html.style.zoom`（所有子元素同步缩放）
3. **zoom 后不要用 100vw/100vh 做容器尺寸** — 被放大后超出视口
   - 正确：使用百分比 `width: 100%; height: 100%`

---

## 九、关键设计决策 (ADR)

### 9.1 技术 ADR

| ID | 决策 | 理由 |
|:--:|------|------|
| ADR-001 | ReactFlow v12 + Zustand 受控模式 | 社区最佳实践，避免自己实现画布引擎 |
| ADR-002 | 单 Store (useFlowStore) 管理画布 | 废弃 useCanvasStore 双重存在问题 |
| ADR-003 | zundo temporal 中间件 | ReactFlow 推荐的 undo/redo 方案 |
| ADR-004 | 适配器模式接入 AI 供应商 | 新增供应商成本低，接口统一 |
| ADR-005 | Linear 设计系统基准 | 暗色工具 UI 最高水准参考 |
| ADR-006 | CSS 变量 + data-theme 属性切换主题 | 运行时零成本切换，不重建 DOM |
| ADR-007 | `html.style.zoom` 全局缩放 | 避免 `transform:scale` vw/vh 问题 |
| ADR-008 | 同步+异步双模式生成 | 不同模型返回策略不同，需同时支持 |

### 9.2 UX ADR

| ID | 决策 | 理由 | Phase |
|:--:|------|------|:----:|
| ADR-001 | 采用 UnifiedGenBar 替代双入口 | 消除用户认知混乱，唯一生成入口 | P1 |
| ADR-002 | 摄影机参数从节点移到属性面板 | 减小节点高度（520→280px），参数成为一等公民 | P2 |
| ADR-003 | 面板从浮动改为 Dock/Drawer 体系 | 画布全屏化，工具按需出现 | P2 |
| ADR-004 | Phase 1 先不做毛玻璃效果 | 性能优先，纯平面方案 | P1 |
| ADR-005 | 节点色彩用 ComfyUI 式顶部色条 | 兼容性好、无需复杂 CSS 技术 | P1 |
| ADR-006 | Chat Agent 第一阶段用关键词匹配 | 降低实现复杂度，后续可升级 NLP | P3 |
| ADR-007 | Phase 1 先做硬编码模板 | 快速验证 Onboarding 效果 | P1 |

---

## 十、文档索引

| 文档 | 路径 | 说明 |
|------|------|------|
| 开发设计总纲 | `deliverables/DEVELOPMENT-DESIGN-MASTER.md` | ★ 本文档 |
| 产品需求文档 | `PRD.md` | 产品定位/功能/路线/品牌 |
| 技术架构 | `deliverables/TECH-ARCHITECTURE.md` | 完整技术架构 + 数据流 + Mermaid 图 |
| UX 架构重构 | `deliverables/UX-ARCHITECTURE-V2.md` | 8 断点 + 面板重组 + 三阶段路线 |
| 设计系统指南 | `deliverables/DESIGN-SYSTEM-GUIDE.md` | 令牌落地到组件的执行指南 |
| 设计令牌落地计划 | `deliverables/DESIGN-TOKEN-IMPLEMENTATION-PLAN.md` | GStack 设计顾问的落地方案 |
| 开发计划 | `deliverables/DEVELOPMENT-PLAN-V1.md` | 4 Phase × 8 周详细计划 |
| 全面代码审查 | `deliverables/PRD-设计方向-全面分析.md` | 48 源文件审计 + V1.0 路线图 |
| 产品评审 | `deliverables/gstack/product-review-design-plan-2026-05-27.md` | GStack 全面评审结论 |
| 画布竞品研究 | `deliverables/canvas-design-reference.md` | 11 平台 UX 对比 |
| 画布方案 B 重构报告 | `deliverables/canvas-refactor-report.md` | ReactFlow v12 重构技术报告 |
| 设计原型 | `deliverables/prototype/index.html` | 浏览器交互原型（63KB HTML） |
| 原型审查报告 | `deliverables/prototype/REVIEW.md` | 22/25 分质量审查 |
| 设计令牌决策 | `packages/shared/design-tokens/DECISION.md` | Linear 基准选择理由 |
| 设计令牌详设 | `packages/shared/design-tokens/DESIGN.md` | 令牌系统完整设计文档 |
| 画布原型设计令牌 | `deliverables/prototype/DESIGN-TOKENS.md` | 原型阶段令牌定义 |
| 设计总纲 | `deliverables/DESIGN.md` | 早期设计方向文档 |

---

*本文档编译自 13 份项目核心文档，覆盖绘词引擎 V2 的完整开发设计知识体系。*  
*任何子系统级别的设计决策和实现细节，请参考对应的专项文档。*
