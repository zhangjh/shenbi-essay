
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import FileUpload from '@/components/FileUpload';
import CameraCapture from '@/components/CameraCapture';
import GradingResult from '@/components/GradingResult';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileText } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from '@/components/ui/use-toast';

interface GradingRequest {
  title: string;
  desc: string;
  level: string;
  weight: number;
  essay?: string;
  fileImg?: string;
}

const EssayGrading = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [gradingResult, setGradingResult] = useState<any>(null);
  const [uploadMode, setUploadMode] = useState<'file' | 'camera' | null>(null);

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setCapturedImage(null);
    setUploadMode('file');
    console.log('File uploaded:', file.name);
  };

  const handleImageCapture = (imageData: string) => {
    setCapturedImage(imageData);
    setUploadedFile(null);
    setUploadMode('camera');
    console.log('Image captured');
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
    if (!uploadedFile && !capturedImage) return;
    
    setIsAnalyzing(true);
    
    try {
      const requestData: GradingRequest = {
        title: '',
        desc: '',
        level: '',
        weight: 100
      };

      if (uploadedFile) {
        if (uploadedFile.type === 'text/plain') {
          // 文本文件，提取内容作为essay参数
          const essayContent = await extractTextFromFile(uploadedFile);
          requestData.essay = essayContent;
        } else {
          // 图片或PDF文件，转换为base64作为fileImg参数
          const base64Data = await convertFileToBase64(uploadedFile);
          requestData.fileImg = base64Data;
        }
      } else if (capturedImage) {
        // 拍照的图片，移除data:image/jpeg;base64,前缀
        const base64Data = capturedImage.split(',')[1];
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
    setCapturedImage(null);
    setGradingResult(null);
    setIsAnalyzing(false);
    setUploadMode(null);
  };

  const handleSelectUploadMode = (mode: 'file' | 'camera') => {
    setUploadMode(mode);
  };

  // 重新选择上传方式
  const handleReselect = () => {
    setUploadedFile(null);
    setCapturedImage(null);
    setUploadMode(null);
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
              {uploadMode === null ? (
                <UploadModeSelector 
                  onSelectMode={handleSelectUploadMode}
                  isMobile={isMobile}
                />
              ) : uploadMode === 'file' ? (
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h3 className="text-sm sm:text-base font-semibold">文件上传</h3>
                    <Button variant="outline" size="sm" onClick={handleReselect} className="text-xs sm:text-sm">
                      重新选择
                    </Button>
                  </div>
                  <FileUpload 
                    onFileSelect={handleFileUpload}
                    selectedFile={uploadedFile}
                  />
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h3 className="text-sm sm:text-base font-semibold">拍照上传</h3>
                    <Button variant="outline" size="sm" onClick={handleReselect} className="text-xs sm:text-sm">
                      重新选择
                    </Button>
                  </div>
                  <CameraCapture 
                    onImageCapture={handleImageCapture}
                    capturedImage={capturedImage}
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-between mt-4 sm:mt-6 gap-3 sm:gap-4">
                <Button 
                  variant="outline" 
                  onClick={handleReset}
                  disabled={!uploadedFile && !capturedImage}
                  size="sm"
                  className="text-xs sm:text-sm w-full sm:w-auto order-2 sm:order-1"
                >
                  重新选择
                </Button>
                <Button 
                  onClick={handleStartGrading}
                  disabled={(!uploadedFile && !capturedImage) || isAnalyzing}
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
              // 如果有上传图片则优先展示对应的base64图片
              uploadedFile && uploadedFile.type.startsWith('image/')
                ? (uploadedFile ? URL.createObjectURL(uploadedFile) : undefined)
                : capturedImage
                  ? capturedImage
                  : undefined
            }
          />
        )}
      </div>
    </div>
  );
};

// 上传方式选择组件
const UploadModeSelector = ({ 
  onSelectMode, 
  isMobile 
}: { 
  onSelectMode: (mode: 'file' | 'camera') => void;
  isMobile: boolean;
}) => {
  return (
    <div className="text-center py-6 sm:py-8">
      <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4 sm:mb-6" />
      <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2 sm:mb-4">
        选择上传方式
      </h3>
      <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6 px-4">
        请选择您希望使用的上传方式
      </p>
      
      <div className="flex flex-col gap-3 max-w-xs mx-auto">
        <Button 
          onClick={() => onSelectMode('file')}
          className="gradient-bg text-white w-full py-3 text-sm sm:text-base"
        >
          文件上传
        </Button>
        {isMobile && (
          <Button 
            onClick={() => onSelectMode('camera')}
            variant="outline"
            className="w-full py-3 text-sm sm:text-base"
          >
            拍照上传
          </Button>
        )}
      </div>
    </div>
  );
};

export default EssayGrading;
