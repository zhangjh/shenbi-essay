
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import FileUpload from '@/components/FileUpload';
import EssayGenerationResult from '@/components/EssayGenerationResult';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, BookOpen, Sparkles } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { generateEssayByImage, readStreamAsText } from '@/services/essayGenerationService';

const EssayGeneration = () => {
  const navigate = useNavigate();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationResult, setGenerationResult] = useState<string | null>(null);

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    console.log('File uploaded for essay generation:', file.name);
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
    if (!uploadedFile) return;
    
    // 检查是否为图片文件
    if (!uploadedFile.type.startsWith('image/')) {
      toast({
        title: "文件类型错误",
        description: "范文生成功能仅支持图片文件，请上传 JPG 或 PNG 格式的图片。",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      console.log('开始生成范文...');
      
      // 转换图片为 base64
      const base64Data = await convertFileToBase64(uploadedFile);
      
      // 调用生成接口
      const stream = await generateEssayByImage(base64Data);
      const result = await readStreamAsText(stream);
      
      console.log('范文生成完成:', result);
      setGenerationResult(result);
      
      toast({
        title: "范文生成完成",
        description: "AI已根据题目图片生成范文，请查看结果。",
      });

    } catch (error) {
      console.error('范文生成失败:', error);
      toast({
        title: "生成失败",
        description: "范文生成过程中出现错误，请重试。",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setUploadedFile(null);
    setGenerationResult(null);
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
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
            <h1 className="text-lg sm:text-2xl font-bold text-gray-800 truncate flex items-center">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-yellow-500" />
              AI范文生成
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">上传作文题目图片，AI自动生成高质量范文</p>
          </div>
        </div>

        {/* Main Content */}
        {!generationResult ? (
          <Card className="shadow-lg">
            <CardHeader className="pb-3 sm:pb-4 px-3 sm:px-6 py-3 sm:py-4">
              <CardTitle className="flex items-center text-base sm:text-lg">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                <span>上传题目图片</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-4 sm:pb-6">
              <FileUpload 
                onFileSelect={handleFileUpload}
                selectedFile={uploadedFile}
              />

              {/* 提示信息 */}
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  💡 <strong>使用提示：</strong>请上传清晰的作文题目图片，AI将根据题目要求生成相应的范文内容。
                </p>
              </div>

              {/* Action Buttons */}
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
                  disabled={!uploadedFile || isGenerating}
                  className="gradient-bg text-white text-xs sm:text-sm w-full sm:w-auto order-1 sm:order-2"
                  size="sm"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 animate-spin" />
                      AI正在生成中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      开始AI生成范文
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <EssayGenerationResult 
            result={generationResult}
            onNewGeneration={handleReset}
            imageUrl={
              uploadedFile && uploadedFile.type.startsWith('image/')
                ? URL.createObjectURL(uploadedFile)
                : undefined
            }
          />
        )}
      </div>
    </div>
  );
};

export default EssayGeneration;
