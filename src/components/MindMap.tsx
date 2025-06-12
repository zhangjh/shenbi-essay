
import { useEffect, useRef } from 'react';
import { Markmap } from 'markmap-view';
import { Transformer } from 'markmap-lib';

interface MindMapProps {
  content: string;
}

const MindMap = ({ content }: MindMapProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const mmRef = useRef<Markmap>();

  useEffect(() => {
    if (!svgRef.current || !content) return;

    // 创建 transformer 实例
    const transformer = new Transformer();
    
    // 将 markdown 转换为 markmap 数据
    const { root } = transformer.transform(content);
    
    // 如果已经有 markmap 实例，更新数据
    if (mmRef.current) {
      mmRef.current.setData(root);
      mmRef.current.fit();
    } else {
      // 创建新的 markmap 实例
      mmRef.current = Markmap.create(svgRef.current, {
        maxWidth: 300,
        spacingVertical: 5,
        spacingHorizontal: 80,
        autoFit: true,
        pan: true,
        zoom: true,
      }, root);
    }
  }, [content]);

  if (!content) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        暂无思维导图内容
      </div>
    );
  }

  return (
    <div className="w-full h-96 border border-gray-200 rounded-lg overflow-hidden">
      <svg
        ref={svgRef}
        className="w-full h-full"
        style={{ background: '#fafafa' }}
      />
    </div>
  );
};

export default MindMap;
