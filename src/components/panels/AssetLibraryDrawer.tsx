import React, { useState } from 'react';
import { useUIStore } from '@/stores/uiStore';
import { useAssetStore, AssetType, AssetItem } from '@/stores/assetStore';
import { 
  X, Image as ImageIcon, Video, Music, FileText, Box, 
  Settings2, Workflow, UserSquare, Film, Trash2, Download, Play, Search, ArrowDownToLine 
} from 'lucide-react';
import { toast } from 'sonner';

const TABS: { type: AssetType; label: string; icon: React.ReactNode }[] = [
  { type: 'image', label: '图片', icon: <ImageIcon size={14} /> },
  { type: 'video', label: '视频', icon: <Video size={14} /> },
  { type: 'audio', label: '音频', icon: <Music size={14} /> },
  { type: 'text', label: '文本', icon: <FileText size={14} /> },
  { type: 'model', label: '模型', icon: <Box size={14} /> },
  { type: 'preset', label: '预设', icon: <Settings2 size={14} /> },
  { type: 'workflow', label: '工作流', icon: <Workflow size={14} /> },
  { type: 'character', label: '角色', icon: <UserSquare size={14} /> },
  { type: 'storyboard', label: '分镜', icon: <Film size={14} /> },
];

export default function AssetLibraryDrawer() {
  const { assetLibraryOpen, setAssetLibraryOpen } = useUIStore();
  const { assets, removeAsset } = useAssetStore();
  const [activeTab, setActiveTab] = useState<AssetType>('image');
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  if (!assetLibraryOpen) return null;

  const filteredAssets = assets
    .filter(a => a.type === activeTab)
    .filter(a => a.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortOrder === 'desc' ? b.createdAt - a.createdAt : a.createdAt - b.createdAt);

  const handleDelete = (id: string) => {
    if (confirm('确定要删除此资产吗？')) {
      removeAsset(id);
      toast.success('删除成功');
    }
  };

  const handleExport = (asset: AssetItem) => {
    toast.success(`导出成功: ${asset.title}`);
  };

  const handleApply = (asset: AssetItem) => {
    toast.success(`已应用到画布: ${asset.title}`);
    setAssetLibraryOpen(false);
  };

  return (
    <>
      {/* 遮罩 */}
      <div 
        className="fixed inset-0 z-40 bg-background/20 backdrop-blur-sm transition-opacity"
        onClick={() => setAssetLibraryOpen(false)}
      />
      
      {/* 抽屉 */}
      <div className="fixed inset-x-0 bottom-0 z-50 flex h-[60vh] flex-col rounded-t-xl border-t border-border bg-card shadow-2xl transition-transform duration-300 ease-in-out">
        {/* 头部与过滤区域 */}
        <div className="flex flex-col border-b border-border p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-foreground">资产管理库</h2>
            <button 
              onClick={() => setAssetLibraryOpen(false)}
              className="rounded-sm p-1 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            {/* Tabs */}
            <div className="flex flex-wrap gap-1">
              {TABS.map(tab => (
                <button
                  key={tab.type}
                  onClick={() => setActiveTab(tab.type)}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors ${
                    activeTab === tab.type 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary text-secondary-foreground hover:bg-accent'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* 搜索与排序 */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-48">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input 
                  type="text"
                  placeholder="搜索资产..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-md border border-input bg-input/50 pl-8 pr-3 py-1.5 text-[12px] focus:border-primary focus:outline-none"
                />
              </div>
              <button 
                onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                className="flex shrink-0 items-center gap-1 rounded-md border border-input bg-card px-3 py-1.5 text-[12px] text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                时间 {sortOrder === 'desc' ? '↓' : '↑'}
              </button>
            </div>
          </div>
        </div>

        {/* 资产列表内容区 */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredAssets.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
              <Box size={48} className="mb-4 opacity-20" />
              <p className="text-sm">暂无{TABS.find(t => t.type === activeTab)?.label}资产</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredAssets.map(asset => (
                <div key={asset.id} className="group relative flex flex-col overflow-hidden rounded-md border border-border bg-secondary/30 transition-colors hover:border-primary/50">
                  {/* 预览区 */}
                  <div className="relative aspect-video w-full bg-muted overflow-hidden flex items-center justify-center">
                    {asset.type === 'image' && asset.url ? (
                      <img src={asset.url} alt={asset.title} className="h-full w-full object-cover" />
                    ) : asset.type === 'video' && asset.url ? (
                      <div className="relative h-full w-full bg-black flex items-center justify-center">
                        <Play size={24} className="text-white/50" />
                      </div>
                    ) : (
                      <div className="text-muted-foreground/50 scale-150">
                        {TABS.find(t => t.type === asset.type)?.icon}
                      </div>
                    )}
                    
                    {/* Hover Actions */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center gap-2">
                      <button onClick={() => handleExport(asset)} className="p-2 text-white hover:text-primary rounded-full hover:bg-white/10" title="导出">
                        <ArrowDownToLine size={16} />
                      </button>
                      <button onClick={() => handleDelete(asset.id)} className="p-2 text-white hover:text-red-400 rounded-full hover:bg-white/10" title="删除">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  {/* 信息区 */}
                  <div className="p-2">
                    <h3 className="truncate text-[12px] font-medium text-foreground" title={asset.title}>
                      {asset.title}
                    </h3>
                    <div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>{new Date(asset.createdAt).toLocaleDateString()}</span>
                      {asset.size && <span>{asset.size}</span>}
                    </div>
                  </div>

                  {/* 应用按钮 (如果是工作流、角色、分镜) */}
                  {['workflow', 'character', 'storyboard'].includes(asset.type) && (
                    <button 
                      onClick={() => handleApply(asset)}
                      className="absolute bottom-0 left-0 right-0 translate-y-full bg-primary py-1.5 text-center text-[11px] font-medium text-primary-foreground opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100"
                    >
                      应用到画布
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
