import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, RotateCcw, Share2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { shareEssay } from '@/services/essayService';
import { toast } from '@/components/ui/sonner';

interface PhotoEssayResultProps {
  stream: ReadableStream;
  onNewGeneration: () => void;
  imageUrl?: string;
}

const PhotoEssayResult = ({ stream, onNewGeneration, imageUrl }: PhotoEssayResultProps) => {
  const [content, setContent] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [wantToShare, setWantToShare] = useState(false);
  const [essayId, setEssayId] = useState<string | null>(null);

  useEffect(() => {
    const readStream = async () => {
      const reader = stream.getReader();
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) {
            setIsComplete(true);
            // 生成完成后，可以从后端获取essayId（这里模拟生成一个ID）
            setEssayId(`essay_${Date.now()}`);
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

  const handleShare = async () => {
    if (!essayId) {
      toast.error('无法共享', {
        description: '范文ID不存在'
      });
      return;
    }

    setIsSharing(true);
    try {
      const result = await shareEssay(essayId);
      if (result.success) {
        toast.success('共享成功', {
          description: '您的范文已共享到社区'
        });
      } else {
        toast.error('共享失败', {
          description: result.errorMsg || '请稍后重试'
        });
      }
    } catch (error) {
      toast.error('共享失败', {
        description: '网络错误，请稍后重试'
      });
    } finally {
      setIsSharing(false);
    }
  };

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

          {/* 共享选项 */}
          {isComplete && content && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border">
              <div className="flex items-center space-x-3">
                <Checkbox 
                  id="share-essay"
                  checked={wantToShare}
                  onCheckedChange={(checked) => setWantToShare(checked as boolean)}
                />
                <label 
                  htmlFor="share-essay" 
                  className="text-sm font-medium text-gray-700 cursor-pointer"
                >
                  将此范文共享到社区，帮助其他同学学习
                </label>
              </div>
              {wantToShare && (
                <div className="mt-3">
                  <Button 
                    onClick={handleShare}
                    disabled={isSharing}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    {isSharing ? '共享中...' : '立即共享'}
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PhotoEssayResult;
