import React, { useRef, useEffect, useState } from 'react';
import { useUIStore } from '@/stores/uiStore';
import { useChatStore } from '@/stores/chatStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useFlowStore } from '@/stores/flowStore';
import { X, Plus, Send, MessageSquare, Loader2, Bot, User, Wand2, Workflow } from 'lucide-react';
import { toast } from 'sonner';
import { parseWorkflowFromLLM } from '@/lib/workflowParser';
import { getLayoutedElements } from '@/lib/layout';
import {
  STORY_ARCHITECT_PROMPT,
  CHARACTER_CASTING_PROMPT,
  MAKEUP_SYSTEM_PROMPT,
  VISUAL_CONSISTENCY_PROMPT,
  STORYBOARD_ENGINE_PROMPT,
  DYNAMIC_DIRECTOR_PROMPT,
  ACTION_EVALUATION_PROMPT,
  COLOR_GRADING_PROMPT
} from '@/lib/agent-prompts';

export default function ChatDrawer() {
  const { chatDrawerOpen, setChatDrawerOpen } = useUIStore();
  const { sessions, activeSessionId, isStreaming, createSession, deleteSession, setActiveSession, sendMessage, getActiveSession } = useChatStore();
  const { apiKey } = useSettingsStore();
  const [input, setInput] = React.useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeSession = getActiveSession();
  const { loadWorkflow, nodes: currentNodes, edges: currentEdges } = useFlowStore();
  const [isGeneratingWorkflow, setIsGeneratingWorkflow] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages]);

  if (!chatDrawerOpen) return null;

  const handleSend = async () => {
    const content = input.trim();
    if (!content || isStreaming) return;
    setInput('');
    
    // 如果当前没有任何会话，新建一个会话作为兜底
    // 默认使用 workflow (画板生成) 模式，以满足大部分用户打开抽屉直接输入需求生成画板的期望
    if (!activeSessionId || !activeSession) {
      useChatStore.getState().createSession('workflow');
      
      const storeState = useChatStore.getState();
      const currentActiveSession = storeState.getActiveSession();
      if (currentActiveSession) {
        await handleGenerateWorkflow(content, currentActiveSession.id);
      }
      return;
    }
    
    // 智能识别画板生成意图：即使用户在"普通对话"中，如果提到了生成节点，自动切换至生成逻辑
    let isWorkflowMode = activeSession.mode === 'workflow';
    const workflowKeywords = ['生成', '画板', '节点', '工作流', '创世架构师', '视觉一致性', '原画生成', '声景', '调色', '拆招', '连线', '引擎'];
    const hasWorkflowIntent = workflowKeywords.some(kw => content.includes(kw));

    if (!isWorkflowMode && hasWorkflowIntent) {
      isWorkflowMode = true;
    }
    
    if (isWorkflowMode) {
      await handleGenerateWorkflow(content);
      return;
    }
    
    await sendMessage(content);
  };

  const handleGenerateWorkflow = async (content: string, overrideSessionId?: string) => {
    if (!apiKey) {
      toast.error('请先配置 API Key');
      return;
    }
    
    const targetSessionId = overrideSessionId || activeSessionId;
    
    setIsGeneratingWorkflow(true);
    // 乐观更新用户消息
    const tempId = `msg-${Date.now()}`;
    useChatStore.setState(s => ({
      sessions: s.sessions.map(sess => 
        sess.id === targetSessionId 
          ? { ...sess, messages: [...sess.messages, { id: tempId, role: 'user', content, createdAt: Date.now() }] }
          : sess
      ),
      isStreaming: true
    }));

    try {
      const { defaultChatModel } = useSettingsStore.getState();
      const workflowData = await parseWorkflowFromLLM(apiKey, defaultChatModel, content);
      
      const idMap = new Map<string, string>();
      
      const newNodes = workflowData.nodes.map((n: any, index: number) => {
        const newId = `${n.id}-${Math.random().toString(36).substr(2, 6)}`;
        idMap.set(n.id, newId);
        
        // 补充缺失的必填状态字段
        let defaultData: any = {};
        if (n.type === 'genImageNode') {
          defaultData = { status: 'IDLE', progress: 0, prompt: '', model: 'seedream-5.0-lite' };
        } else if (n.type === 'genVideoNode') {
          defaultData = { status: 'IDLE', progress: 0, prompt: '', model: 'seedance-2.0' };
        } else if (n.type === 'textNode') {
          let text = n.data?.text || '';
          if (n.data?.templateId === 'STORY_ARCHITECT') text = STORY_ARCHITECT_PROMPT;
          else if (n.data?.templateId === 'CHARACTER_CASTING') text = CHARACTER_CASTING_PROMPT;
          else if (n.data?.templateId === 'MAKEUP_SYSTEM') text = MAKEUP_SYSTEM_PROMPT;
          else if (n.data?.templateId === 'VISUAL_CONSISTENCY') text = VISUAL_CONSISTENCY_PROMPT;
          else if (n.data?.templateId === 'STORYBOARD_ENGINE') text = STORYBOARD_ENGINE_PROMPT;
          else if (n.data?.templateId === 'DYNAMIC_DIRECTOR') text = DYNAMIC_DIRECTOR_PROMPT;
          else if (n.data?.templateId === 'ACTION_EVALUATION') text = ACTION_EVALUATION_PROMPT;
          else if (n.data?.templateId === 'COLOR_GRADING') text = COLOR_GRADING_PROMPT;
          
          defaultData = { text };
        } else if (n.type === 'inputImageNode') {
          defaultData = { imageUrl: '', fileName: '' };
        } else if (n.type === 'cidBoardNode') {
          defaultData = { characterDesc: '', gender: 'female', age: 'adult', bodyType: 'medium', occupation: '', temperament: [], clothing: '', accessories: [], hairstyle: '', hairColor: '', expression: 'neutral', viewAngle: 'front view' };
        }

        const position = n.position || { x: 100 + index * 350, y: 200 };
        
        const finalData = { ...defaultData, ...n.data };
        if (n.type === 'textNode' && n.data?.templateId) {
          finalData.text = defaultData.text; // 强制使用模板内容
        }

        return {
          ...n,
          id: newId,
          position,
          data: finalData,
        };
      });
      
      const newEdges = workflowData.edges.map((e: any) => {
        let sourceHandle = e.sourceHandle;
        let targetHandle = e.targetHandle;
        
        // 自动补全连接点 ID (如果大模型没有返回)
        const sourceNode = workflowData.nodes.find((n: any) => n.id === e.source);
        const targetNode = workflowData.nodes.find((n: any) => n.id === e.target);
        
        if (!sourceHandle && sourceNode) {
          if (sourceNode.type === 'textNode') sourceHandle = 'text-out';
          else if (sourceNode.type === 'inputImageNode') sourceHandle = 'image-out';
          else if (sourceNode.type === 'genImageNode') sourceHandle = 'image-out';
          else if (sourceNode.type === 'genVideoNode') sourceHandle = 'video-out';
          else if (sourceNode.type === 'cidBoardNode') sourceHandle = 'cid-out';
        }
        
        if (!targetHandle && targetNode) {
          if (targetNode.type === 'genImageNode' || targetNode.type === 'genVideoNode') {
            targetHandle = (sourceNode?.type === 'inputImageNode' || sourceNode?.type === 'genImageNode') ? 'image-in' : 'text-in';
          }
        }

        return {
          ...e,
          id: `e-${idMap.get(e.source) || e.source}-${idMap.get(e.target) || e.target}-${Math.random().toString(36).substr(2, 6)}`,
          source: idMap.get(e.source) || e.source,
          target: idMap.get(e.target) || e.target,
          sourceHandle,
          targetHandle
        };
      });

      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(newNodes, newEdges);

      loadWorkflow(layoutedNodes, layoutedEdges);

      useChatStore.setState(s => ({
        sessions: s.sessions.map(sess => 
          sess.id === targetSessionId 
            ? { 
                ...sess, 
                messages: [
                  ...sess.messages, 
                  { 
                    id: `msg-${Date.now()}`, 
                    role: 'assistant', 
                    content: `🎉 画板生成完毕！分析需求如下：\n\n${workflowData.summary}\n\n**您现在可以关闭对话抽屉查看生成的画板。**`, 
                    createdAt: Date.now() 
                  }
                ] 
              }
            : sess
        ),
        isStreaming: false
      }));
      toast.success('画板已在后台生成并加载');
      setTimeout(() => {
        setChatDrawerOpen(false);
      }, 1500);
    } catch (error: any) {
      useChatStore.setState(s => ({
        sessions: s.sessions.map(sess => 
          sess.id === targetSessionId 
            ? { 
                ...sess, 
                messages: [
                  ...sess.messages, 
                  { 
                    id: `msg-${Date.now()}`, 
                    role: 'assistant', 
                    content: `❌ 画板生成失败：${error.message}`, 
                    createdAt: Date.now() 
                  }
                ] 
              }
            : sess
        ),
        isStreaming: false
      }));
    } finally {
      setIsGeneratingWorkflow(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex">
      {/* 背景遮罩 */}
      <div className="flex-1" onClick={() => setChatDrawerOpen(false)} />

      {/* 抽屉 */}
      <div className="flex h-full w-80 flex-col border-l border-border bg-card">
        {/* 头部 */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <MessageSquare size={14} className="text-primary" />
            <span className="text-sm font-medium text-foreground">AI 对话</span>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => createSession('workflow')}
              className="flex items-center gap-1 rounded p-1 text-[10px] font-medium text-[hsl(var(--status-success))] bg-[hsl(var(--status-success))]/10 transition-colors hover:bg-[hsl(var(--status-success))]/20"
              title="AI 画板生成"
            >
              <Workflow size={12} />
              AI画板
            </button>
            <button
              onClick={() => createSession('sculpt')}
              className="flex items-center gap-1 rounded p-1 text-[10px] font-medium text-primary bg-primary/10 transition-colors hover:bg-primary/20"
              title="SCULPT 专家优化"
            >
              <Wand2 size={12} />
              优化器
            </button>
            <button
              onClick={() => createSession('normal')}
              className="rounded p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              title="新对话"
            >
              <Plus size={14} />
            </button>
            <button
              onClick={() => setChatDrawerOpen(false)}
              className="rounded p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* 会话列表（折叠） */}
        {sessions.length > 1 && (
          <div className="border-b border-border overflow-x-auto">
            <div className="flex gap-1 p-2">
              {sessions.map(s => (
                <button
                  key={s.id}
                  onClick={() => setActiveSession(s.id)}
                  className={`flex shrink-0 items-center gap-1 rounded-sm px-2 py-1 text-[10px] transition-colors ${
                    s.id === activeSessionId ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-accent'
                  }`}
                >
                  {s.mode === 'sculpt' && <Wand2 size={10} />}
                  {s.mode === 'workflow' && <Workflow size={10} />}
                  <span className="max-w-[60px] truncate">{s.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 消息区 */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
          {!activeSession || activeSession.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-4">
              <Bot size={28} className="text-border" />
              <p className="text-[12px] text-muted-foreground">
                {apiKey ? '你好！我可以帮你优化提示词、提供创作建议...' : '请先配置 API Key 才能使用 AI 对话'}
              </p>
              {!activeSession && (
                <div className="flex gap-2 mt-2">
                  <button onClick={() => createSession('normal')} className="rounded-sm bg-secondary px-3 py-1.5 text-[12px] text-secondary-foreground hover:bg-secondary/80">
                    普通对话
                  </button>
                  <button onClick={() => createSession('sculpt')} className="flex items-center gap-1 rounded-sm bg-primary px-3 py-1.5 text-[12px] text-primary-foreground hover:bg-primary/90">
                    <Wand2 size={12} />
                    提示词优化
                  </button>
                  <button onClick={() => createSession('workflow')} className="flex items-center gap-1 rounded-sm bg-[hsl(var(--status-success))] px-3 py-1.5 text-[12px] text-primary-foreground hover:bg-[hsl(var(--status-success))]/90">
                    <Workflow size={12} />
                    画板生成
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              {activeSession.messages.map(msg => (
                <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className="shrink-0">
                    {msg.role === 'user' ? (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                        <User size={11} className="text-primary-foreground" />
                      </div>
                    ) : (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary">
                        <Bot size={11} className="text-secondary-foreground" />
                      </div>
                    )}
                  </div>
                  <div className={`max-w-[200px] whitespace-pre-wrap rounded-sm px-3 py-2 text-[12px] leading-relaxed ${
                    msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isStreaming && (
                <div className="flex gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary">
                    <Bot size={11} className="text-secondary-foreground" />
                  </div>
                  <div className="flex items-center gap-1 rounded-sm bg-secondary px-3 py-2">
                    <Loader2 size={11} className="animate-spin text-muted-foreground" />
                    <span className="text-[12px] text-muted-foreground">正在思考...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* 输入框 */}
        <div className="border-t border-border p-3">
          {activeSession?.mode === 'sculpt' && activeSession.messages.length === 0 && (
            <div className="mb-2 text-[10px] text-primary/80 bg-primary/10 px-2 py-1.5 rounded-sm">
              ✨ 你已进入 <b>SCULPT 专家诊断模式</b>。输入您的简短灵感，AI 将会为您补全专业结构化提示词。
            </div>
          )}
          {activeSession?.mode === 'workflow' && activeSession.messages.length === 0 && (
            <div className="mb-2 text-[10px] text-[hsl(var(--status-success))]/80 bg-[hsl(var(--status-success))]/10 px-2 py-1.5 rounded-sm">
              ✨ <b>AI 画板生成</b>。用自然语言描述你想创建的工作流（如"创建一个从文本到图像再到视频的流程"）。
            </div>
          )}
          <div className="flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder={activeSession?.mode === 'workflow' ? "描述你想创建的工作流..." : "输入消息..."}
              disabled={isStreaming || isGeneratingWorkflow}
              className="flex-1 min-w-0 rounded-sm border border-input bg-input/50 px-2.5 py-1.5 text-[12px] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={isStreaming || isGeneratingWorkflow || !input.trim()}
              className="flex items-center justify-center rounded-sm bg-primary px-2.5 py-1.5 text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {(isStreaming || isGeneratingWorkflow) ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
