import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { HistoryRecord } from '@/types/index';

interface HistoryState {
  records: HistoryRecord[];
  addRecord: (record: Omit<HistoryRecord, 'id' | 'createdAt'>) => void;
  deleteRecord: (id: string) => void;
  clearAll: () => void;
  getByType: (type: 'image' | 'video') => HistoryRecord[];
}

const MAX_RECORDS = 500;

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      records: [],

      addRecord: (record) => {
        const newRecord: HistoryRecord = {
          ...record,
          id: `hist-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          createdAt: Date.now(),
        };
        set(s => ({
          records: [newRecord, ...s.records].slice(0, MAX_RECORDS),
        }));
      },

      deleteRecord: (id: string) => {
        set(s => ({ records: s.records.filter(r => r.id !== id) }));
      },

      clearAll: () => set({ records: [] }),

      getByType: (type) => get().records.filter(r => r.type === type),
    }),
    {
      name: 'pe-history-store',
    }
  )
);
