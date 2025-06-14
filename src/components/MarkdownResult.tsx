
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

interface MarkdownResultProps {
  markdownContent: string;
}

const MarkdownResult = ({ markdownContent }: MarkdownResultProps) => {
  return (
    <Card className="shadow-xl border-blue-100 bg-white w-full">
      <CardHeader className="pb-3 sm:pb-4 bg-gradient-to-r from-blue-50 to-slate-50 rounded-t-lg px-3 sm:px-6 py-3 sm:py-6">
        <CardTitle className="text-lg sm:text-2xl text-center gradient-text flex items-center justify-center">
          <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-green-500 flex-shrink-0" />
          <span>智能批改结果</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 sm:p-4 lg:p-6">
        <ReactMarkdown
          className="prose prose-slate max-w-none w-full text-left prose-sm sm:prose-base"
          rehypePlugins={[rehypeRaw]}
          components={{
            // 自定义组件样式
            h1: ({ children, ...props }) => (
              <h1 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-4 mt-3 sm:mt-6 text-slate-900 border-b-2 border-slate-200 pb-1 sm:pb-2 text-left break-words" {...props}>
                {children}
              </h1>
            ),
            h2: ({ children, ...props }) => (
              <h2 className="text-base sm:text-xl font-bold mb-1.5 sm:mb-3 mt-3 sm:mt-6 text-blue-800 border-b border-blue-100 pb-1 text-left break-words" {...props}>
                <span className="inline-block w-0.5 sm:w-1 h-3 sm:h-5 bg-blue-500 mr-1 sm:mr-2 rounded-full align-middle"></span>
                {children}
              </h2>
            ),
            h3: ({ children, ...props }) => (
              <h3 className="text-sm sm:text-lg font-semibold mb-1 sm:mb-2 mt-2 sm:mt-4 text-blue-700 text-left break-words" {...props}>
                <span className="inline-block w-1 h-1 bg-blue-400 mr-1 rounded-full align-middle"></span>
                {children}
              </h3>
            ),
            strong: ({ children, ...props }) => (
              <strong className="font-semibold text-blue-800 bg-blue-50 px-0.5 py-0.5 rounded text-xs sm:text-base break-words" {...props}>
                {children}
              </strong>
            ),
            ul: ({ children, ...props }) => (
              <ul className="list-none pl-0 mb-2 sm:mb-4 space-y-1 bg-gray-50 rounded-lg p-1.5 sm:p-3 border border-gray-100" {...props}>
                {children}
              </ul>
            ),
            li: ({ children, ...props }) => (
              <li className="text-gray-700 text-xs sm:text-base leading-relaxed mb-0.5 sm:mb-1 pl-1 sm:pl-2 text-left break-words border-l-2 border-transparent hover:border-blue-200 transition-colors" {...props}>
                {children}
              </li>
            ),
            p: ({ children, ...props }) => (
              <p className="my-1 sm:my-2 text-gray-800 leading-relaxed text-xs sm:text-base text-left break-words" {...props}>
                {children}
              </p>
            )
          }}
        >
          {markdownContent}
        </ReactMarkdown>
      </CardContent>
    </Card>
  );
};

export default MarkdownResult;
