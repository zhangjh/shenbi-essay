import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-react';
import Header from '@/components/Header';
import FileUpload from '@/components/FileUpload';
import PhotoEssayResult from '@/components/PhotoEssayResult';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Camera, Lock, Loader2 } from 'lucide-react';
import { generateEssayFromImage, generateTopicFromImage } from '@/services/photoEssayService';
import { toast } from '@/components/ui/sonner';

const PhotoEssayGeneration = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultStream, setResultStream] = useState<ReadableStream | null>(null);
  const [topic, setTopic] = useState<string | null>(null);
  const handleFileUpload = async (file: File) => {
    // 只支持图片文件
    if (!file.type.startsWith('image/')) {
      toast.error('仅支持图片文件', {
        description: '请上传JPG、PNG等图片格式的题目图片'
      });
      return;
    }
    setUploadedFile(file);
    console.log('File uploaded:', file.name);
    setIsUploading(true);
    
    try {
      // 调用后端识别内容后生成题目
      const base64Data = await convertFileToBase64(file);
      console.log('Starting essay generation from image...');
      const topic = await generateTopicFromImage(base64Data);
      console.log('Topic generated:', topic);
      setTopic(topic);
    } catch (error) {
      console.error('Topic recognition error:', error);
      toast.error('识别失败', {
        description: '图片识别失败或超时，请重新上传'
      });
      setTopic(null);
    } finally {
      setIsUploading(false);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // 移除 data:image/jpeg;base64, 前缀，只保留 base64 数据
        const base64Data = result.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleStartGeneration = async () => {
    if (!topic) {
      toast.error('生成失败', {
        description: '题目识别失败'
      });
      return;
    }
    setIsGenerating(true);
    try {
      const stream = await generateEssayFromImage(topic, user?.id || '');
      setResultStream(stream);
      
      toast.success('开始生成范文', {
        description: '正在根据题目图片生成范文，请稍候...'
      });

    } catch (error) {
      console.error('Generation error:', error);
      toast.error('生成失败', {
        description: '生成过程中出现错误，请重试'
      });
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setUploadedFile(null);
    setResultStream(null);
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Header */}
        <div className="flex items-center mb-4 sm:mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mr-2 sm:mr-3 p-1 sm:p-2"
            size="sm"
          >
            <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="text-sm">返回首页</span>
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-2xl font-bold text-gray-800 truncate">拍照生成范文</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">上传题目图片，AI智能生成高质量范文</p>
          </div>
        </div>

        <SignedOut>
          <Card className="shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">请先登录</h3>
              <p className="text-gray-600 mb-6">您需要登录后才能使用拍照生成范文功能</p>
              <Button 
                className="gradient-bg text-white px-6 py-2"
                onClick={() => navigate("/signin?redirect_url=/photo-essay")}
              >
                立即登录
              </Button>
            </CardContent>
          </Card>
        </SignedOut>

        <SignedIn>
          {/* Main Content */}
          {!resultStream ? (
            <Card className="shadow-lg">
              <CardHeader className="pb-3 sm:pb-4 px-3 sm:px-6 py-3 sm:py-4">
                <CardTitle className="flex items-center text-base sm:text-lg">
                  <Camera className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                  <span>上传题目图片</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 sm:px-6 pb-4 sm:pb-6">
                <FileUpload 
                  onFileSelect={handleFileUpload}
                  selectedFile={uploadedFile}
                />
                
                {/* Upload Status Indicator */}
                {isUploading && (
                  <div className="flex items-center justify-center mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-600 mr-2" />
                    <span className="text-blue-700 font-medium">正在识别题目图片...</span>
                  </div>
                )}

                {/* Action Buttons */}
                {!isUploading && 
                <div className="flex flex-col sm:flex-row justify-between mt-4 sm:mt-6 gap-3 sm:gap-4">
                  <Button 
                    variant="outline" 
                    onClick={handleReset}
                    disabled={!uploadedFile}
                    size="sm"
                    className="text-xs sm:text-sm w-full sm:w-auto order-2 sm:order-1"
                  >
                    重新选择
                  </Button>
                  <Button 
                    onClick={handleStartGeneration}
                    disabled={!uploadedFile || !topic || isGenerating}
                    className="gradient-bg text-white text-xs sm:text-sm w-full sm:w-auto order-1 sm:order-2"
                    size="sm"
                  >
                    {isGenerating ? '正在生成中...' : '开始生成范文'}
                  </Button>
                </div>
                }
              </CardContent>
            </Card>
          ) : (
            <PhotoEssayResult 
              stream={resultStream}
              onNewGeneration={handleReset}
              imageUrl={
                uploadedFile && uploadedFile.type.startsWith('image/')
                  ? URL.createObjectURL(uploadedFile)
                  : undefined
              }
              topic={topic}
            />
          )}
        </SignedIn>
      </div>
    </div>
  );
};

export default PhotoEssayGeneration;
