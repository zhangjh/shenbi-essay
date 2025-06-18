import { useEffect, useRef } from 'react';
import type { Markmap } from 'markmap-view';

interface MindMapProps {
  content: string;
}

const MindMap = ({ content }: MindMapProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const mmRef = useRef<Markmap | null>(null);

  useEffect(() => {
    const renderMap = async () => {
      if (!svgRef.current || !content) return;

      const { Transformer } = await import('markmap-lib');
      const { Markmap } = await import('markmap-view');
      
      const transformer = new Transformer();
      const { root } = transformer.transform(content);
      
      if (mmRef.current) {
        mmRef.current.setData(root);
        mmRef.current.fit();
      } else {
        mmRef.current = Markmap.create(svgRef.current, {
          maxWidth: 300,
          spacingVertical: 5,
          spacingHorizontal: 80,
          autoFit: true,
          pan: true,
          zoom: true,
        }, root);
      }
    };
    renderMap();

    return () => {
      mmRef.current?.destroy();
    };
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
