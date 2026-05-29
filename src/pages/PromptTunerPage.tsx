import React, { useState } from 'react';
import { useSettingsStore } from '@/stores/settingsStore';
import { getSilentSculptPrompt, SCULPT_SYSTEM_PROMPT } from '@/lib/sculpt-prompt';
import { getAdapter } from '@/lib/tokendance';
import { Loader2, Wand2, Copy, Check, ArrowRight, Settings } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';

export default function PromptTunerPage() {
  const [inputPrompt, setInputPrompt] = useState('');
  const [outputPrompt, setOutputPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const { apiKey, defaultChatModel } = useSettingsStore();
  const { setSettingsOpen } = useUIStore();

  const handleTune = async () => {
    if (!apiKey) {
      setSettingsOpen(true);
      return;
    }
    if (!inputPrompt.trim()) return;

    setIsGenerating(true);
    setOutputPrompt('');
    
    try {
      const adapter = getAdapter(apiKey);
      const res = await adapter.chat({
        model: defaultChatModel || 'ernie-4.5-turbo-32k',
        messages: [
          { role: 'system', content: getSilentSculptPrompt() },
          { role: 'user', content: inputPrompt }
        ]
      });

      // 提取代码块
      const codeBlockMatch = res.match(/```(?:text|json|[\w]+)?\s*([\s\S]*?)\s*```/);
      if (codeBlockMatch && codeBlockMatch[1]) {
        setOutputPrompt(codeBlockMatch[1].trim());
      } else {
        setOutputPrompt(res.trim());
      }
    } catch (err) {
      console.error(err);
      setOutputPrompt('优化失败，请检查 API 配置或网络连接。');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!outputPrompt) return;
    navigator.clipboard.writeText(outputPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-screen w-full flex-col bg-background">
      <header className="flex h-14 items-center justify-between border-b border-border px-6 shrink-0">
        <div className="flex items-center gap-2">
          <Wand2 className="text-primary" size={18} />
          <h1 className="text-sm font-semibold">专业提示词调优器</h1>
          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">SCULPT 框架驱动</span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-medium text-foreground">输入基础灵感</h2>
            <p className="text-[13px] text-muted-foreground">
              请输入您想生成的画面内容（无需堆砌如 "8k, masterpiece" 等画质词，系统会自动注入结构化专家参数）。
            </p>
            <textarea
              className="min-h-[120px] w-full resize-y rounded-md border border-input bg-card p-3 text-[13px] text-foreground focus:border-primary focus:outline-none"
              placeholder="例如：画一个赛博朋克城市..."
              value={inputPrompt}
              onChange={e => setInputPrompt(e.target.value)}
            />
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleTune}
              disabled={isGenerating || !inputPrompt.trim()}
              className="flex items-center gap-2 rounded-md bg-primary px-6 py-2.5 text-[13px] font-medium text-primary-foreground shadow transition hover:bg-primary/90 disabled:opacity-50"
            >
              {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
              立即调优
            </button>
          </div>

          {outputPrompt && (
            <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-foreground flex items-center gap-2">
                  <ArrowRight size={16} className="text-muted-foreground" /> 
                  生成结果
                </h2>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 rounded-md border border-border bg-secondary px-3 py-1.5 text-[12px] text-secondary-foreground hover:bg-accent"
                >
                  {copied ? <Check size={14} className="text-[hsl(var(--status-success))]" /> : <Copy size={14} />}
                  {copied ? '已复制' : '复制代码'}
                </button>
              </div>
              <div className="rounded-md border border-border bg-card p-4 relative">
                <pre className="whitespace-pre-wrap text-[13px] leading-relaxed text-foreground font-mono">
                  {outputPrompt}
                </pre>
              </div>
            </div>
          )}
          
          <div className="mt-12 rounded-lg bg-secondary/50 p-6 border border-border">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Settings size={14} className="text-muted-foreground" />
              当前应用的 SCULPT 系统底层逻辑
            </h3>
            <div className="h-64 overflow-y-auto rounded bg-card p-4 border border-border text-[12px] text-muted-foreground whitespace-pre-wrap font-mono">
              {SCULPT_SYSTEM_PROMPT}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}