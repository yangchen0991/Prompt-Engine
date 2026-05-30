import { create } from 'zustand';
import { toast } from 'sonner';
import type { GenerationTask, GenerationStatus } from '@/types/index';
import { getAdapter } from '@/lib/tokendance';
import { useSettingsStore } from './settingsStore';
import { useFlowStore } from './flowStore';
import { useHistoryStore } from './historyStore';

interface GenerationState {
  tasks: GenerationTask[];
  maxConcurrency: number;
  todayCount: number;
  submitTask: (params: { nodeId: string; prompt: string; model: string; type: 'image' | 'video' }) => Promise<void>;
  cancelTask: (taskId: string) => void;
  retryTask: (id: string) => void;
  clearCompleted: () => void;
  getActiveCount: () => number;
}

let taskIdCounter = 1;

export const useGenerationStore = create<GenerationState>()((set, get) => ({
  tasks: [],
  maxConcurrency: 2,
  todayCount: 0,

  submitTask: async ({ nodeId, prompt, model, type }) => {
    const { apiKey } = useSettingsStore.getState();
    if (!apiKey) {
      toast.error('请先配置 API Key', { description: '在设置中输入你的 TokenDance API Key' });
      return;
    }

    const id = `task-${taskIdCounter++}`;
    const task: GenerationTask = {
      id,
      nodeId,
      prompt,
      model,
      type,
      status: 'SUBMITTING',
      progress: 5,
      startTime: Date.now(),
      retryCount: 0,
    };

    set(s => ({ tasks: [...s.tasks, task] }));
    useFlowStore.getState().updateNodeStatus(nodeId, 'SUBMITTING', 5);
    toast.info('生成任务已提交', { description: prompt.slice(0, 50) });

    const updateTask = (updates: Partial<GenerationTask>) => {
      set(s => ({
        tasks: s.tasks.map(t => t.id === id ? { ...t, ...updates } : t),
      }));
    };

    try {
      const adapter = getAdapter(apiKey);

      if (type === 'image') {
        // 同步图片生成
        updateTask({ status: 'POLLING', progress: 30 });
        useFlowStore.getState().updateNodeStatus(nodeId, 'POLLING', 30);

        const resultUrl = await adapter.generateImage({ prompt, model });

        updateTask({ status: 'DONE', progress: 100, resultUrl, endTime: Date.now() });
        useFlowStore.getState().updateNodeStatus(nodeId, 'DONE', 100, resultUrl);
        set(s => ({ todayCount: s.todayCount + 1 }));

        // 加入历史
        useHistoryStore.getState().addRecord({
          type: 'image',
          prompt,
          model,
          resultUrl,
          nodeId,
        });

        toast.success('生成完成 ✨');
      } else {
        // 异步视频生成
        const protocol = model.startsWith('happyhorse') ? 'happyhorse' : 'seedance';
        const remoteTaskId = await adapter.submitVideoTask({ prompt, model, protocol });
        updateTask({ status: 'POLLING', progress: 10, taskId: remoteTaskId });
        useFlowStore.getState().updateNodeStatus(nodeId, 'POLLING', 10);

        // 轮询
        let pollCount = 0;
        const maxPolls = 300;

        const poll = async (): Promise<void> => {
          // 检查是否已取消
          const currentTask = get().tasks.find(t => t.id === id);
          if (currentTask?.status === 'CANCELLED') return;

          if (pollCount >= maxPolls) {
            updateTask({ status: 'FAILED', errorMessage: '生成超时，请稍后重试', endTime: Date.now() });
            useFlowStore.getState().updateNodeStatus(nodeId, 'FAILED', 0, undefined, '生成超时');
            toast.error('生成超时', { description: '请稍后重试' });
            return;
          }

          const interval = pollCount < 10 ? 3000 : pollCount < 50 ? 5000 : 8000;
          await new Promise(r => setTimeout(r, interval));

          const result = await adapter.pollTask(remoteTaskId, protocol);
          pollCount++;

          const progress = Math.min(10 + (pollCount / maxPolls) * 85, 95);
          updateTask({ progress });
          useFlowStore.getState().updateNodeStatus(nodeId, 'POLLING', Math.round(progress));

          if (result.status === 'succeeded' || result.status === 'completed') {
            const resultUrl = result.url ?? '';
            updateTask({ status: 'DONE', progress: 100, resultUrl, endTime: Date.now() });
            useFlowStore.getState().updateNodeStatus(nodeId, 'DONE', 100, resultUrl);
            set(s => ({ todayCount: s.todayCount + 1 }));

            useHistoryStore.getState().addRecord({
              type: 'video',
              prompt,
              model,
              resultUrl,
              nodeId,
            });

            toast.success('视频生成完成 🎬');
          } else if (result.status === 'failed') {
            updateTask({ status: 'FAILED', errorMessage: '视频生成失败', endTime: Date.now() });
            useFlowStore.getState().updateNodeStatus(nodeId, 'FAILED', 0, undefined, '视频生成失败');
            toast.error('视频生成失败');
          } else {
            await poll();
          }
        };

        await poll();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : '未知错误';
      updateTask({ status: 'FAILED', errorMessage: message, endTime: Date.now() });
      useFlowStore.getState().updateNodeStatus(nodeId, 'FAILED', 0, undefined, message);
      toast.error('生成失败', { description: message });
    }
  },

  cancelTask: (id: string) => {
    const task = get().tasks.find(t => t.id === id);
    if (!task) return;
    set(s => ({
      tasks: s.tasks.map(t => t.id === id ? { ...t, status: 'CANCELLED' as GenerationStatus, endTime: Date.now() } : t),
    }));
    useFlowStore.getState().updateNodeStatus(task.nodeId, 'CANCELLED', 0);
    toast.info('任务已取消');
  },

  retryTask: (id: string) => {
    const task = get().tasks.find(t => t.id === id);
    if (!task) return;
    get().submitTask({ nodeId: task.nodeId, prompt: task.prompt, model: task.model, type: task.type });
  },

  clearCompleted: () => {
    set(s => ({ tasks: s.tasks.filter(t => t.status !== 'DONE' && t.status !== 'FAILED' && t.status !== 'CANCELLED') }));
  },

  getActiveCount: () => {
    return get().tasks.filter(t => t.status === 'SUBMITTING' || t.status === 'POLLING').length;
  },
}));
