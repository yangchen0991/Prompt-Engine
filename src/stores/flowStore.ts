import { create } from 'zustand';
import { temporal } from 'zundo';
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';
import type {
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  Connection,
} from 'reactflow';
import type { NodeType, GenImageNodeData, GenVideoNodeData, TextNodeData, InputImageNodeData, CIDBoardNodeData, GenerationStatus } from '@/types/index';

interface FlowState {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (type: NodeType, position?: { x: number; y: number }) => Node;
  updateNodeData: (id: string, data: Partial<Node['data']>) => void;
  deleteNode: (id: string) => void;
  duplicateNode: (id: string) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  clearCanvas: () => void;
  updateNodeStatus: (nodeId: string, status: GenerationStatus, progress: number, resultUrl?: string, errorMessage?: string) => void;
  loadWorkflow: (nodes: Node[], edges: Edge[]) => void;
}

let nodeIdCounter = 1;

const createDefaultNodeData = (type: NodeType): Node['data'] => {
  switch (type) {
    case 'textNode':
      return { text: '' } satisfies TextNodeData;
    case 'genImageNode':
      return {
        prompt: '',
        model: 'seedream-5.0-lite',
        status: 'IDLE',
        progress: 0,
      } satisfies GenImageNodeData;
    case 'genVideoNode':
      return {
        prompt: '',
        model: 'seedance-2.0',
        status: 'IDLE',
        progress: 0,
      } satisfies GenVideoNodeData;
    case 'inputImageNode':
      return {} satisfies InputImageNodeData;
    case 'cidBoardNode':
      return {
        gender: 'female',
        age: '25',
        ethnicity: 'East Asian',
        bodyType: 'slim figure',
        hairStyle: 'long straight',
        hairColor: 'black',
        eyeType: 'big',
        faceShape: 'oval',
        skinTone: 'fair',
        temperament: ['intellectual'],
        clothingStyle: 'casual',
        accessories: [],
        pose: 'standing',
        expression: 'slight smile',
        viewAngle: 'front view',
      } satisfies CIDBoardNodeData;
    default:
      return {};
  }
};

const getNodeDimensions = (type: NodeType) => {
  switch (type) {
    case 'textNode': return { width: 260, height: 100 };
    case 'genImageNode': return { width: 280, height: 300 };
    case 'genVideoNode': return { width: 280, height: 300 };
    case 'inputImageNode': return { width: 260, height: 200 };
    case 'cidBoardNode': return { width: 280, height: 480 };
    default: return { width: 260, height: 100 };
  }
};

export const useFlowStore = create<FlowState>()(
  temporal(
    (set, get) => ({
      nodes: [],
      edges: [],

      onNodesChange: (changes) => {
        set({ nodes: applyNodeChanges(changes, get().nodes) });
      },

      onEdgesChange: (changes) => {
        set({ edges: applyEdgeChanges(changes, get().edges) });
      },

      onConnect: (connection: Connection) => {
        set({ edges: addEdge({ ...connection, animated: false }, get().edges) });
      },

      addNode: (type: NodeType, position = { x: 200 + Math.random() * 200, y: 200 + Math.random() * 100 }) => {
        const id = `${type}-${nodeIdCounter++}`;
        const dims = getNodeDimensions(type);
        const node: Node = {
          id,
          type,
          position,
          data: createDefaultNodeData(type),
          style: { width: dims.width },
        };
        set({ nodes: [...get().nodes, node] });
        return node;
      },

      updateNodeData: (id: string, data: Partial<Node['data']>) => {
        set({
          nodes: get().nodes.map(n =>
            n.id === id ? { ...n, data: { ...n.data, ...data } } : n
          ),
        });
      },

      deleteNode: (id: string) => {
        set({
          nodes: get().nodes.filter(n => n.id !== id),
          edges: get().edges.filter(e => e.source !== id && e.target !== id),
        });
      },

      duplicateNode: (id: string) => {
        const node = get().nodes.find(n => n.id === id);
        if (!node) return;
        const newId = `${node.type}-${nodeIdCounter++}`;
        const newNode: Node = {
          ...node,
          id: newId,
          position: { x: node.position.x + 40, y: node.position.y + 40 },
          selected: false,
          data: { ...node.data, status: 'IDLE', progress: 0, resultUrl: undefined, taskId: undefined },
        };
        set({ nodes: [...get().nodes, newNode] });
      },

      setNodes: (nodes: Node[]) => set({ nodes }),
      setEdges: (edges: Edge[]) => set({ edges }),
      
      loadWorkflow: (nodes: Node[], edges: Edge[]) => set({ nodes, edges }),

      clearCanvas: () => set({ nodes: [], edges: [] }),

      updateNodeStatus: (nodeId: string, status: GenerationStatus, progress: number, resultUrl?: string, errorMessage?: string) => {
        set({
          nodes: get().nodes.map(n =>
            n.id === nodeId
              ? { ...n, data: { ...n.data, status, progress, ...(resultUrl !== undefined ? { resultUrl } : {}), ...(errorMessage !== undefined ? { errorMessage } : {}) } }
              : n
          ),
        });
      },
    }),
    {
      // 只记录 nodes/edges 变化，排除拖拽中间帧
      partialize: (state) => ({ nodes: state.nodes, edges: state.edges }),
      limit: 50,
    }
  )
);
