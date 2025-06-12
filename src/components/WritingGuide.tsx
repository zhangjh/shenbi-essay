
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface WritingGuideProps {
  content: string;
}

const WritingGuide = ({ content }: WritingGuideProps) => {
  return (
    <div className="prose prose-sm max-w-none">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({node, ...props}) => <h1 className="text-xl font-bold text-gray-800 mb-3" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-lg font-semibold text-gray-700 mb-2" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-base font-medium text-gray-600 mb-2" {...props} />,
          p: ({node, ...props}) => <p className="text-gray-600 mb-3 leading-relaxed" {...props} />,
          ul: ({node, ...props}) => <ul className="space-y-2 mb-3" {...props} />,
          ol: ({node, ...props}) => <ol className="space-y-2 mb-3" {...props} />,
          li: ({node, ...props}) => (
            <li className="flex items-start text-gray-600" {...props}>
              <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>{props.children}</span>
            </li>
          ),
          strong: ({node, ...props}) => <strong className="font-semibold text-gray-800" {...props} />,
          em: ({node, ...props}) => <em className="italic text-gray-700" {...props} />,
          blockquote: ({node, ...props}) => (
            <blockquote className="border-l-4 border-primary bg-blue-50 pl-4 py-2 mb-3 italic text-gray-700" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default WritingGuide;
