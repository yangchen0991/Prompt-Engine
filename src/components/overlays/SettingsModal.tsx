import React, { useState } from 'react';
import { useUIStore } from '@/stores/uiStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { X, Eye, EyeOff, Key, Cpu } from 'lucide-react';
import { IMAGE_MODELS, VIDEO_MODELS, CHAT_MODELS } from '@/lib/models';

export default function SettingsModal() {
  const { settingsOpen, setSettingsOpen } = useUIStore();
  const { apiKey, defaultImageModel, defaultVideoModel, defaultChatModel, setApiKey, setDefaultImageModel, setDefaultVideoModel, setDefaultChatModel } = useSettingsStore();
  const [showKey, setShowKey] = useState(false);
  const [localKey, setLocalKey] = useState(apiKey);
  const [activeTab, setActiveTab] = useState<'api' | 'models'>('api');

  if (!settingsOpen) return null;

  const handleSave = () => {
    setApiKey(localKey.trim());
    setSettingsOpen(false);
  };

  const maskedKey = localKey ? `${localKey.slice(0, 8)}${'•'.repeat(Math.max(0, localKey.length - 8))}` : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setSettingsOpen(false)}>
      <div
        className="w-full max-w-lg overflow-hidden rounded-sm border border-border bg-card shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold text-foreground">设置</h2>
          <button onClick={() => setSettingsOpen(false)} className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground">
            <X size={14} />
          </button>
        </div>

        {/* Tab */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab('api')}
            className={`flex items-center gap-2 px-5 py-2.5 text-[12px] transition-colors ${activeTab === 'api' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Key size={12} />
            API 配置
          </button>
          <button
            onClick={() => setActiveTab('models')}
            className={`flex items-center gap-2 px-5 py-2.5 text-[12px] transition-colors ${activeTab === 'models' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Cpu size={12} />
            默认模型
          </button>
        </div>

        {/* 内容 */}
        <div className="p-5">
          {activeTab === 'api' && (
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-[12px] font-medium text-foreground">TokenDance API Key</label>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={localKey}
                    onChange={e => setLocalKey(e.target.value)}
                    placeholder="sk-..."
                    className="w-full rounded-sm border border-input bg-input/50 px-3 pr-10 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none font-mono"
                  />
                  <button
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <p className="mt-1.5 text-[11px] text-muted-foreground">
                  在{' '}
                  <a href="https://tokendance.space/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    tokendance.space
                  </a>
                  {' '}获取 API Key
                </p>
              </div>

              {/* 已支持的模型 */}
              <div>
                <p className="mb-2 text-[12px] font-medium text-foreground">支持的模型 ({IMAGE_MODELS.length + VIDEO_MODELS.length + CHAT_MODELS.length})</p>
                <div className="space-y-2">
                  {[
                    { label: '图片生成', models: IMAGE_MODELS },
                    { label: '视频生成', models: VIDEO_MODELS },
                    { label: '对话模型', models: CHAT_MODELS },
                  ].map(group => (
                    <div key={group.label}>
                      <p className="mb-1 text-[10px] text-muted-foreground">{group.label}</p>
                      <div className="flex flex-wrap gap-1">
                        {group.models.map(m => (
                          <span key={m.id} className="rounded-sm bg-secondary px-2 py-0.5 text-[10px] text-secondary-foreground">{m.name}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'models' && (
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-foreground">默认图片模型</label>
                <select
                  value={defaultImageModel}
                  onChange={e => setDefaultImageModel(e.target.value)}
                  className="w-full rounded-sm border border-input bg-input/50 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                >
                  {IMAGE_MODELS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-foreground">默认视频模型</label>
                <select
                  value={defaultVideoModel}
                  onChange={e => setDefaultVideoModel(e.target.value)}
                  className="w-full rounded-sm border border-input bg-input/50 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                >
                  {VIDEO_MODELS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-foreground">默认对话模型</label>
                <select
                  value={defaultChatModel}
                  onChange={e => setDefaultChatModel(e.target.value)}
                  className="w-full rounded-sm border border-input bg-input/50 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                >
                  {CHAT_MODELS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* 底部 */}
        <div className="flex justify-end gap-2 border-t border-border px-5 py-3">
          <button onClick={() => setSettingsOpen(false)} className="rounded-sm border border-border px-4 py-1.5 text-[12px] text-muted-foreground hover:bg-accent">
            取消
          </button>
          <button onClick={handleSave} className="rounded-sm bg-primary px-4 py-1.5 text-[12px] text-primary-foreground hover:bg-primary/90">
            保存
          </button>
        </div>
      </div>
    </div>
  );
}
