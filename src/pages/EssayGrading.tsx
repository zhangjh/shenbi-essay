
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

  const handleStartGrading = async () => {
    if (!uploadedFile && !capturedImage) return;
    
    setIsAnalyzing(true);
    
    // 模拟AI批改过程
    setTimeout(() => {
      const mockResult = {
        score: 85,
        totalScore: 100,
        strengths: [
          '文章结构清晰，层次分明',
          '语言表达流畅，用词准确',
          '内容丰富，有一定的思想深度'
        ],
        improvements: [
          '开头可以更加吸引人',
          '段落之间的过渡可以更自然',
          '结尾部分可以进一步升华主题'
        ],
        detailedFeedback: '这是一篇较为优秀的作文。文章整体结构合理，内容充实，表达清楚。在语言运用方面表现良好，但在创新性和深度方面还有提升空间。建议多加练习，注重细节的完善。',
        grade: 'B+'
      };
      setGradingResult(mockResult);
      setIsAnalyzing(false);
    }, 3000);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回首页
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">智能作文批改</h1>
            <p className="text-gray-600 mt-2">上传您的作文，获得专业的AI批改建议</p>
          </div>
        </div>

        {/* Main Content */}
        {!gradingResult ? (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                上传作文
              </CardTitle>
            </CardHeader>
            <CardContent>
              {uploadMode === null ? (
                <UploadModeSelector 
                  onSelectMode={handleSelectUploadMode}
                  isMobile={isMobile}
                />
              ) : uploadMode === 'file' ? (
                <FileUpload 
                  onFileSelect={handleFileUpload}
                  selectedFile={uploadedFile}
                />
              ) : (
                <CameraCapture 
                  onImageCapture={handleImageCapture}
                  capturedImage={capturedImage}
                />
              )}

              {/* Action Buttons */}
              <div className="flex justify-between mt-8">
                <Button 
                  variant="outline" 
                  onClick={handleReset}
                  disabled={!uploadedFile && !capturedImage}
                >
                  重新选择
                </Button>
                <Button 
                  onClick={handleStartGrading}
                  disabled={(!uploadedFile && !capturedImage) || isAnalyzing}
                  className="gradient-bg text-white"
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
    <div className="text-center py-12">
      <FileText className="w-16 h-16 text-gray-400 mx-auto mb-6" />
      <h3 className="text-xl font-semibold text-gray-700 mb-4">
        选择上传方式
      </h3>
      <p className="text-gray-500 mb-8">
        请选择您希望使用的上传方式
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
        <Button 
          onClick={() => onSelectMode('file')}
          className="gradient-bg text-white flex-1"
        >
          文件上传
        </Button>
        {isMobile && (
          <Button 
            onClick={() => onSelectMode('camera')}
            variant="outline"
            className="flex-1"
          >
            拍照上传
          </Button>
        )}
      </div>
    </div>
  );
};

export default EssayGrading;
