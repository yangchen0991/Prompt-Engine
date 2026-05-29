import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AssetType = 'image' | 'video' | 'audio' | 'text' | 'model' | 'preset' | 'workflow' | 'character' | 'storyboard';

export interface AssetItem {
  id: string;
  type: AssetType;
  title: string;
  url?: string;
  content?: string;
  createdAt: number;
  size?: string;
}

interface AssetState {
  assets: AssetItem[];
  addAsset: (asset: Omit<AssetItem, 'id' | 'createdAt'>) => void;
  removeAsset: (id: string) => void;
}

export const useAssetStore = create<AssetState>()(
  persist(
    (set) => ({
      assets: [
        // 一些初始 mock 数据
        {
          id: 'asset-1',
          type: 'image',
          title: '赛博朋克城市.jpg',
          url: 'https://images.unsplash.com/photo-1515630278258-407f66498911',
          createdAt: Date.now() - 100000,
          size: '1.2 MB'
        },
        {
          id: 'asset-2',
          type: 'text',
          title: '商业海报提示词',
          content: 'A professional commercial poster for coffee...',
          createdAt: Date.now() - 200000,
          size: '128 B'
        }
      ],
      addAsset: (asset) => set((state) => ({
        assets: [
          {
            ...asset,
            id: `asset-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            createdAt: Date.now(),
          },
          ...state.assets
        ]
      })),
      removeAsset: (id) => set((state) => ({
        assets: state.assets.filter(a => a.id !== id)
      }))
    }),
    {
      name: 'pe-asset-store'
    }
  )
);
