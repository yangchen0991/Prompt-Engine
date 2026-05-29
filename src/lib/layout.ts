import dagre from 'dagre';
import type { Node, Edge } from 'reactflow';

export function getLayoutedElements(nodes: Node[], edges: Edge[], direction = 'LR') {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const nodeWidth = 300;
  const nodeHeight = 400; // 预估高度，根据不同节点可以更精细

  dagreGraph.setGraph({ rankdir: direction, ranksep: 100, nodesep: 50 });

  nodes.forEach((node) => {
    // 根据节点类型给定不同的大致宽高
    let width = 260;
    let height = 200;
    
    if (node.type === 'cidBoardNode') {
      width = 280;
      height = 450;
    } else if (node.type === 'inputImageNode') {
      width = 260;
      height = 250;
    } else if (node.type === 'textNode') {
      width = 260;
      height = 150;
    } else if (node.type === 'genImageNode' || node.type === 'genVideoNode') {
      width = 260;
      height = 320;
    }

    dagreGraph.setNode(node.id, { width, height });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    
    let width = 260;
    let height = 200;
    if (node.type === 'cidBoardNode') height = 450;
    else if (node.type === 'inputImageNode') height = 250;
    else if (node.type === 'textNode') height = 150;
    else if (node.type === 'genImageNode' || node.type === 'genVideoNode') height = 320;

    const newNode = {
      ...node,
      position: {
        x: nodeWithPosition.x - width / 2,
        y: nodeWithPosition.y - height / 2,
      },
    };

    return newNode;
  });

  return { nodes: layoutedNodes, edges };
}
