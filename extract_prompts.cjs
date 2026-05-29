const fs = require('fs');
const path = require('path');

const tasksDir = '/workspace/app-bxi5vk6ftmv5/tasks';
const files = [
  '1.【创世架构师】终极故事构建系统 V3.0 .txt',
  '2. 影视级角色开发与选角指南系统 .txt',
  '3.终极电影人物定妆生成系统.txt',
  '5. 终极视觉一致性控制中枢 V3.0.txt',
  '6.终极全息影视分镜与原画生成引擎 V3.0 ..txt'
];

const varNames = [
  'STORY_ARCHITECT_PROMPT',
  'CHARACTER_CASTING_PROMPT',
  'MAKEUP_SYSTEM_PROMPT',
  'VISUAL_CONSISTENCY_PROMPT',
  'STORYBOARD_ENGINE_PROMPT'
];

let out = `// 预置的大师级提示词模板

`;

files.forEach((f, i) => {
  const content = fs.readFileSync(path.join(tasksDir, f), 'utf-8');
  // Need to escape backticks and dollar signs for template literals
  const escaped = content.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
  out += `export const ${varNames[i]} = \`${escaped}\`;\n\n`;
});

fs.writeFileSync('/workspace/app-bxi5vk6ftmv5/src/lib/agent-prompts.ts', out);
console.log('Done!');
