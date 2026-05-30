const fs = require('fs');
const path = require('path');

const tasksDir = '/workspace/app-bxi5vk6ftmv5/tasks';
const files = [
  '7.终极 AI 动态导演与声景工程系统 V3.0 (Seedance 2.0 特化版).txt',
  '8.AI 动作可行性评估与拆招中枢 V2.0 (Seedance 2.0 蒙太奇特化版).txt',
  '9.终极全局视觉与 DI 调色控制台 V2.0 (全链路色彩锁定版).txt'
];

const varNames = [
  'DYNAMIC_DIRECTOR_PROMPT',
  'ACTION_EVALUATION_PROMPT',
  'COLOR_GRADING_PROMPT'
];

let out = `\n`;

files.forEach((f, i) => {
  const content = fs.readFileSync(path.join(tasksDir, f), 'utf-8');
  const escaped = content.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
  out += `export const ${varNames[i]} = \`${escaped}\`;\n\n`;
});

fs.appendFileSync('/workspace/app-bxi5vk6ftmv5/src/lib/agent-prompts.ts', out);
console.log('Appended successfully!');
