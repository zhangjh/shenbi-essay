
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import FileUpload from '@/components/FileUpload';
import GradingResult from '@/components/GradingResult';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileText } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface GradingRequest {
  title: string;
  description: string;
  level: string;
  weight: number;
  essay?: string;
  fileImg?: string;
}

const EssayGrading = () => {
  const navigate = useNavigate();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [gradingResult, setGradingResult] = useState<any>(null);

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    console.log('File uploaded:', file.name);
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

  const extractTextFromFile = async (file: File): Promise<string> => {
    if (file.type === 'text/plain') {
      return await file.text();
    }
    // 对于图片和PDF，返回空字符串，使用fileImg参数
    return '';
  };

  const handleStartGrading = async () => {
    if (!uploadedFile) return;
    
    setIsAnalyzing(true);
    
    try {
      const requestData: GradingRequest = {
        title: '',
        description: '',
        level: '',
        weight: 100
      };

      if (uploadedFile.type === 'text/plain') {
        // 文本文件，提取内容作为essay参数
        const essayContent = await extractTextFromFile(uploadedFile);
        requestData.essay = essayContent;
      } else {
        // 图片或PDF文件，转换为base64作为fileImg参数
        const base64Data = await convertFileToBase64(uploadedFile);
        requestData.fileImg = base64Data;
      }

      console.log('Sending grading request:', requestData);

      const response = await fetch('https://tx.zhangjh.cn/shenbi/essay/grading', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.text();
      console.log('Grading result:', result);
      
      setGradingResult({
        markdownContent: result,
        isMarkdown: true
      });
      
      toast({
        title: "批改完成",
        description: "作文批改已完成，请查看详细结果。",
      });

    } catch (error) {
      console.error('Grading error:', error);
      toast({
        title: "批改失败",
        description: "批改过程中出现错误，请重试。",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setUploadedFile(null);
    setGradingResult(null);
    setIsAnalyzing(false);
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
            <h1 className="text-lg sm:text-2xl font-bold text-gray-800 truncate">智能作文批改</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">上传您的作文，获得专业的AI批改建议</p>
          </div>
        </div>

        {/* Main Content */}
        {!gradingResult ? (
          <Card className="shadow-lg">
            <CardHeader className="pb-3 sm:pb-4 px-3 sm:px-6 py-3 sm:py-4">
              <CardTitle className="flex items-center text-base sm:text-lg">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                <span>上传作文</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-4 sm:pb-6">
              <FileUpload 
                onFileSelect={handleFileUpload}
                selectedFile={uploadedFile}
              />

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
                  onClick={handleStartGrading}
                  disabled={!uploadedFile || isAnalyzing}
                  className="gradient-bg text-white text-xs sm:text-sm w-full sm:w-auto order-1 sm:order-2"
                  size="sm"
                >
                  {isAnalyzing ? '正在批改中...' : '开始智能批改'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <GradingResult 
            result={gradingResult}
            onNewGrading={handleReset}
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

export default EssayGrading;
