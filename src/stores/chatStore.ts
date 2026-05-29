import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChatSession, ChatMessage } from '@/types/index';
import { getAdapter } from '@/lib/tokendance';
import { useSettingsStore } from './settingsStore';

interface ChatState {
  sessions: ChatSession[];
  activeSessionId: string | null;
  isStreaming: boolean;
  createSession: (mode?: 'sculpt' | 'normal' | 'workflow') => void;
  deleteSession: (id: string) => void;
  setActiveSession: (id: string) => void;
  sendMessage: (content: string) => Promise<void>;
  getActiveSession: () => ChatSession | undefined;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      sessions: [],
      activeSessionId: null,
      isStreaming: false,

      createSession: (mode = 'normal') => {
        const id = `session-${Date.now()}`;
        const titleMap = {
          'sculpt': 'SCULPT 提示词优化',
          'normal': '新对话',
          'workflow': 'AI 画板生成'
        };
        const session: ChatSession = {
          id,
          title: titleMap[mode] || '新对话',
          messages: [],
          createdAt: Date.now(),
          mode,
        };
        set(s => ({
          sessions: [session, ...s.sessions],
          activeSessionId: id,
        }));
      },

      deleteSession: (id: string) => {
        set(s => {
          const remaining = s.sessions.filter(sess => sess.id !== id);
          return {
            sessions: remaining,
            activeSessionId: s.activeSessionId === id ? (remaining[0]?.id ?? null) : s.activeSessionId,
          };
        });
      },

      setActiveSession: (id: string) => set({ activeSessionId: id }),

      getActiveSession: () => {
        const { sessions, activeSessionId } = get();
        return sessions.find(s => s.id === activeSessionId);
      },

      sendMessage: async (content: string) => {
        const { activeSessionId, sessions } = get();
        if (!activeSessionId) return;

        const { apiKey, defaultChatModel } = useSettingsStore.getState();

        const userMsg: ChatMessage = {
          id: `msg-${Date.now()}`,
          role: 'user',
          content,
          createdAt: Date.now(),
        };

        // 添加用户消息
        set(s => ({
          sessions: s.sessions.map(sess =>
            sess.id === activeSessionId
              ? { ...sess, messages: [...sess.messages, userMsg], title: sess.messages.length === 0 ? content.slice(0, 20) : sess.title }
              : sess
          ),
          isStreaming: true,
        }));

        try {
          const session = sessions.find(s => s.id === activeSessionId);
          const history = (session?.messages ?? []).map(m => ({ role: m.role, content: m.content }));
          
          let sysPrompt = '';
          if (session?.mode === 'sculpt') {
            const { SCULPT_SYSTEM_PROMPT } = await import('@/lib/sculpt-prompt');
            sysPrompt = SCULPT_SYSTEM_PROMPT;
          }

          const adapter = getAdapter(apiKey || 'demo');
          const reply = await adapter.chat({
            model: defaultChatModel,
            messages: sysPrompt 
              ? [{ role: 'system', content: sysPrompt }, ...history, { role: 'user', content }] 
              : [...history, { role: 'user', content }],
          });

          const assistantMsg: ChatMessage = {
            id: `msg-${Date.now()}`,
            role: 'assistant',
            content: reply,
            createdAt: Date.now(),
          };

          set(s => ({
            sessions: s.sessions.map(sess =>
              sess.id === activeSessionId
                ? { ...sess, messages: [...sess.messages, assistantMsg] }
                : sess
            ),
            isStreaming: false,
          }));
        } catch {
          const errorMsg: ChatMessage = {
            id: `msg-${Date.now()}`,
            role: 'assistant',
            content: '抱歉，对话失败，请检查 API Key 配置。',
            createdAt: Date.now(),
          };
          set(s => ({
            sessions: s.sessions.map(sess =>
              sess.id === activeSessionId
                ? { ...sess, messages: [...sess.messages, errorMsg] }
                : sess
            ),
            isStreaming: false,
          }));
        }
      },
    }),
    {
      name: 'pe-chat-store',
      partialize: (state) => ({ sessions: state.sessions, activeSessionId: state.activeSessionId }),
    }
  )
);
