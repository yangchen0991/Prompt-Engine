import React, { memo, useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import type { InputImageNodeData } from '@/types/index';
import { useFlowStore } from '@/stores/flowStore';
import { useUIStore } from '@/stores/uiStore';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileImage } from 'lucide-react';

const InputImageNode = memo(({ id, data, selected }: NodeProps<InputImageNodeData>) => {
  const updateNodeData = useFlowStore(s => s.updateNodeData);
  const setSelectedNodeId = useUIStore(s => s.setSelectedNodeId);

  const onDrop = useCallback((files: File[]) => {
    const file = files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    updateNodeData(id, { imageUrl: url, fileName: file.name });
  }, [id, updateNodeData]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'] },
    maxFiles: 1,
    noClick: false,
  });

  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    updateNodeData(id, { imageUrl: undefined, fileName: undefined });
  }, [id, updateNodeData]);

  return (
    <div
      onClick={() => setSelectedNodeId(id)}
      className={`w-[260px] cursor-pointer rounded-sm border bg-card transition-colors ${
        selected ? 'border-primary shadow-[0_0_0_1px_hsl(var(--primary))]' : 'border-border'
      }`}
    >
      <div className="h-[2px] w-full rounded-t-sm bg-[hsl(var(--node-input))]" />

      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-1.5">
          <FileImage size={12} className="text-[hsl(var(--node-input))] shrink-0" />
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">图片输入</span>
        </div>
        {data.imageUrl && (
          <button onClick={handleClear} className="nodrag rounded p-0.5 text-muted-foreground hover:text-destructive">
            <X size={12} />
          </button>
        )}
      </div>

      <div className="px-3 pb-3">
        <div
          {...getRootProps()}
          className={`nodrag aspect-video cursor-pointer overflow-hidden rounded-sm border-2 border-dashed transition-colors ${
            isDragActive ? 'border-primary bg-primary/10' : 'border-border bg-muted/50 hover:border-primary/50'
          }`}
        >
          <input {...getInputProps()} />
          {data.imageUrl ? (
            <img src={data.imageUrl} alt={data.fileName ?? '参考图'} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 p-4">
              <Upload size={20} className="text-muted-foreground" />
              <p className="text-center text-[11px] text-muted-foreground">
                {isDragActive ? '松开上传' : '拖入或点击上传图片'}
              </p>
              <p className="text-center text-[10px] text-muted-foreground/60">JPG · PNG · GIF · SVG</p>
            </div>
          )}
        </div>
        {data.fileName && (
          <p className="mt-1 truncate text-[10px] text-muted-foreground">{data.fileName}</p>
        )}
      </div>

      <Handle type="source" position={Position.Right} id="image-out" />
    </div>
  );
});

InputImageNode.displayName = 'InputImageNode';
export default InputImageNode;
