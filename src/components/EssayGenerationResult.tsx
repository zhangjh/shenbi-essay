
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Download, RotateCcw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

interface EssayGenerationResultProps {
  result: string;
  onNewGeneration: () => void;
  imageUrl?: string;
}

const EssayGenerationResult = ({ result, onNewGeneration, imageUrl }: EssayGenerationResultProps) => {
  const exportResult = () => {
    const blob = new Blob([result], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AI生成范文_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 lg:px-6 space-y-4 sm:space-y-6">
      {/* 图片预览区 */}
      {imageUrl && (
        <Card className="shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg text-center">题目图片</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <img
              src={imageUrl}
              alt="作文题目图片"
              className="max-w-full max-h-80 object-contain rounded-lg border"
            />
          </CardContent>
        </Card>
      )}

      {/* 范文结果显示 */}
      <Card className="shadow-xl border-blue-100 bg-white">
        <CardHeader className="pb-3 sm:pb-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-t-lg">
          <CardTitle className="text-lg sm:text-2xl text-center gradient-text flex items-center justify-center">
            <BookOpen className="w-4 h-4 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-green-500 flex-shrink-0" />
            <span>AI生成范文</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2 sm:p-4 lg:p-6">
          <ReactMarkdown
            className="prose prose-slate max-w-none w-full text-left prose-sm sm:prose-base"
            rehypePlugins={[rehypeRaw]}
            components={{
              h1: ({ children, ...props }) => (
                <h1 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-4 mt-3 sm:mt-6 text-slate-900 border-b-2 border-slate-200 pb-1 sm:pb-2 text-left break-words" {...props}>
                  {children}
                </h1>
              ),
              h2: ({ children, ...props }) => (
                <h2 className="text-base sm:text-xl font-bold mb-1.5 sm:mb-3 mt-3 sm:mt-6 text-green-800 border-b border-green-100 pb-1 text-left break-words" {...props}>
                  <span className="inline-block w-0.5 sm:w-1 h-3 sm:h-5 bg-green-500 mr-1 sm:mr-2 rounded-full align-middle"></span>
                  {children}
                </h2>
              ),
              h3: ({ children, ...props }) => (
                <h3 className="text-sm sm:text-lg font-semibold mb-1 sm:mb-2 mt-2 sm:mt-4 text-green-700 text-left break-words" {...props}>
                  <span className="inline-block w-1 h-1 bg-green-400 mr-1 rounded-full align-middle"></span>
                  {children}
                </h3>
              ),
              p: ({ children, ...props }) => (
                <p className="my-1 sm:my-2 text-gray-800 leading-relaxed text-xs sm:text-base text-left break-words" {...props}>
                  {children}
                </p>
              ),
              strong: ({ children, ...props }) => (
                <strong className="font-semibold text-green-800 bg-green-50 px-0.5 py-0.5 rounded text-xs sm:text-base break-words" {...props}>
                  {children}
                </strong>
              ),
            }}
          >
            {result}
          </ReactMarkdown>
        </CardContent>
      </Card>

      {/* 操作按钮 */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button variant="outline" onClick={onNewGeneration} size="sm">
          <RotateCcw className="w-4 h-4 mr-2" />
          重新生成
        </Button>
        <Button onClick={exportResult} className="gradient-bg text-white" size="sm">
          <Download className="w-4 h-4 mr-2" />
          导出范文
        </Button>
      </div>
    </div>
  );
};

export default EssayGenerationResult;
