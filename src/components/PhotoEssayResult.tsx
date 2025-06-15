
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, RotateCcw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface PhotoEssayResultProps {
  stream: ReadableStream;
  onNewGeneration: () => void;
  imageUrl?: string;
}

const PhotoEssayResult = ({ stream, onNewGeneration, imageUrl }: PhotoEssayResultProps) => {
  const [content, setContent] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const readStream = async () => {
      const reader = stream.getReader();
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) {
            setIsComplete(true);
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          setContent(prev => prev + chunk);
        }
      } catch (error) {
        console.error('Stream reading error:', error);
        setIsComplete(true);
      }
    };

    readStream();
  }, [stream]);

  return (
    <div className="space-y-4">
      {/* 原图预览 */}
      {imageUrl && (
        <Card className="bg-gray-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              题目图片
            </CardTitle>
          </CardHeader>
          <CardContent>
            <img 
              src={imageUrl} 
              alt="上传的题目图片" 
              className="max-w-full h-auto rounded-lg border"
            />
          </CardContent>
        </Card>
      )}

      {/* 生成的范文 */}
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center text-lg">
            <FileText className="w-5 h-5 mr-2" />
            AI生成范文
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onNewGeneration}
            disabled={!isComplete}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            重新生成
          </Button>
        </CardHeader>
        <CardContent>
          {content ? (
            <div className="prose max-w-none prose-sm sm:prose-base">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                className="text-gray-800 leading-relaxed"
                components={{
                  p: ({ children }) => (
                    <p className="mb-4 text-justify leading-7 text-gray-800">
                      {children}
                    </p>
                  ),
                  h1: ({ children }) => (
                    <h1 className="text-xl font-bold mb-4 text-gray-900 text-center">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-lg font-semibold mb-3 text-gray-900">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-base font-medium mb-2 text-gray-900">
                      {children}
                    </h3>
                  ),
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">正在生成范文...</p>
              </div>
            </div>
          )}
          
          {!isComplete && content && (
            <div className="mt-4 flex items-center text-sm text-blue-600">
              <div className="animate-pulse w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              正在生成中...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PhotoEssayResult;
