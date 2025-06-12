
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MindMapProps {
  content: string;
}

const MindMap = ({ content }: MindMapProps) => {
  return (
    <div className="prose prose-sm max-w-none">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          ul: ({node, ...props}) => <ul className="space-y-1 ml-4" {...props} />,
          ol: ({node, ...props}) => <ol className="space-y-1 ml-4" {...props} />,
          li: ({node, ...props}) => <li className="text-gray-700" {...props} />,
          h1: ({node, ...props}) => <h1 className="text-lg font-bold text-primary mb-2" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-base font-semibold text-gray-800 mb-1" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-sm font-medium text-gray-700 mb-1" {...props} />,
          p: ({node, ...props}) => <p className="text-gray-600 mb-2" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MindMap;
