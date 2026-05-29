import { getAdapter } from '@/lib/tokendance';

const SYSTEM_PROMPT = `
你是一个 AI 画板设计助手。
用户的需求会被输入给你，你需要将其解析为画板的节点(Node)和边(Edge)结构，并返回 JSON 格式。

可用的节点类型(NodeType):
1. textNode (纯文本输入，通常作为起始提示词)
2. inputImageNode (图片输入，作为垫图参考)
3. genImageNode (图像生成节点，接收文本或图片)
4. genVideoNode (视频生成节点，接收文本或图片)
5. cidBoardNode (角色身份控制板，生成统一角色的基础参数)

【高级预设模板】
如果用户的需求中提到以下系统、引擎或中枢，你必须在对应 textNode 的 data 中添加 templateId 字段：
- "创世架构师" 或 "故事构建" -> templateId: "STORY_ARCHITECT"
- "角色开发" 或 "选角指南" -> templateId: "CHARACTER_CASTING"
- "人物定妆" 或 "定妆生成" -> templateId: "MAKEUP_SYSTEM"
- "视觉一致性" 或 "控制中枢" -> templateId: "VISUAL_CONSISTENCY"
- "分镜" 或 "原画生成" -> templateId: "STORYBOARD_ENGINE"
- "动态导演" 或 "声景工程" -> templateId: "DYNAMIC_DIRECTOR"
- "动作可行性评估" 或 "拆招中枢" -> templateId: "ACTION_EVALUATION"
- "全局视觉" 或 "调色控制台" 或 "DI 调色" -> templateId: "COLOR_GRADING"

你需要返回如下结构的 JSON：
{
  "summary": "需求简述，例如：创建了一个包含创世架构师和定妆生成的流程",
  "nodes": [
    {
      "id": "node-1", 
      "type": "textNode",
      "position": { "x": 100, "y": 200 },
      "data": { "text": "这是系统生成的故事大纲", "templateId": "STORY_ARCHITECT" }
    },
    {
      "id": "node-2",
      "type": "genImageNode",
      "position": { "x": 500, "y": 200 },
      "data": { "prompt": "附加提示词", "model": "seedream-5.0-lite" }
    }
  ],
  "edges": [
    {
      "source": "node-1",
      "target": "node-2"
    }
  ]
}

非常重要：
- X 和 Y 坐标请尽量合理排布（一般从左向右发展，X 每次增加约 400，Y 可以微调）。
- 你必须并且只能返回合法的 JSON 字符串，绝对不要输出任何引导语、解释性文字或者 Markdown 语法（如 \`\`\`json）。直接从 { 开始，以 } 结束。
`;

export async function parseWorkflowFromLLM(apiKey: string, model: string, userQuery: string) {
  const adapter = getAdapter(apiKey);
  
  const response = await adapter.chat({
    model: model || 'ernie-4.5-turbo-32k',
    messages: [
      { role: 'user', content: `${SYSTEM_PROMPT}\n\n我的具体需求是：\n${userQuery}` }
    ],
  });

  try {
    let rawStr = response.trim();
    // 尝试直接提取 markdown 中的 json 块
    const codeBlockMatch = rawStr.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (codeBlockMatch && codeBlockMatch[1]) {
      rawStr = codeBlockMatch[1];
    }
    const json = JSON.parse(rawStr.trim());
    return json;
  } catch (error) {
    console.error('解析画板结构 JSON 失败:', error, '\n原始返回:', response);
    throw new Error('无法解析您的需求，请尝试换种描述方式。');
  }
}
