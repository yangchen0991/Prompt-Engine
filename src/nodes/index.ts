import TextNode from './TextNode';
import GenImageNode from './GenImageNode';
import GenVideoNode from './GenVideoNode';
import InputImageNode from './InputImageNode';
import CIDBoardNode from './CIDBoardNode';

export const nodeTypes = {
  textNode: TextNode,
  genImageNode: GenImageNode,
  genVideoNode: GenVideoNode,
  inputImageNode: InputImageNode,
  cidBoardNode: CIDBoardNode,
};

export { TextNode, GenImageNode, GenVideoNode, InputImageNode, CIDBoardNode };
