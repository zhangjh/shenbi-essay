import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import Header from '@/components/Header';
import FileUpload from '@/components/FileUpload';
import CameraCapture from '@/components/CameraCapture';
import GradingResult from '@/components/GradingResult';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, FileText, Lock, Upload, Camera } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { compressImageFileToBase64, compressBase64ToBase64 } from '@/lib/utils';

const API_BASE_URL = import.meta.env.VITE_BIZ_DOMAIN + '/shenbi';

interface GradingRequest {
  title: string;
  description: string;
  level: string;
  weight: number;
  essay?: string;
  fileImgs?: string[];
  topicText?: string;
  topicImg?: string;
  userId: string;
}

interface GradingResult {
  markdownContent: string;
  isMarkdown: boolean;
}

const EssayGrading = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  // 作文文件
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  // 作文多图文件
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  // 拍照图片
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  // 题目文件（可选）
  const [topicFile, setTopicFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [gradingResult, setGradingResult] = useState<GradingResult>(null);
  const [activeTab, setActiveTab] = useState('upload');

  // 处理题目上传
  const handleTopicUpload = (file: File) => {
    setTopicFile(file);
    console.log('题目文件已上传:', file.name);
  };

  // 处理作文上传（单文件）
  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    console.log('作文文件已上传:', file.name);
  };

  // 处理多图上传
  const handleFilesUpload = (files: File[]) => {
    setUploadedFiles(files);
    console.log('作文多图已上传:', files.length, '张');
  };

  // 删除上传的图片
  const handleFileRemove = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
  };

  // 处理拍照图片
  const handleImagesCapture = (images: string[]) => {
    setCapturedImages(images);
    console.log('已拍摄:', images.length, '张图片');
  };

  // 删除拍照图片
  const handleImageRemove = (index: number) => {
    const newImages = capturedImages.filter((_, i) => i !== index);
    setCapturedImages(newImages);
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
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
    return '';
  };

  // 将图片文件压缩后转为base64
  const compressFileToBase64 = (file: File): Promise<string> => {
    if (file.type.startsWith('image/')) {
      return compressImageFileToBase64(file, 800, 0.7);
    } else {
      // 非图片文件，走原始base64
      return convertFileToBase64(file);
    }
  };

  // 提取题目信息
  const getTopicFileParams = async () => {
    if (!topicFile) return {};
    if (topicFile.type === 'text/plain') {
      const topicText = await extractTextFromFile(topicFile);
      return { topicText };
    } else {
      // 图片或PDF
      const topicImg = await convertFileToBase64(topicFile);
      return { topicImg };
    }
  };

  // 批改流程
  const handleStartGrading = async () => {
    const hasFiles = uploadedFile || uploadedFiles.length > 0 || capturedImages.length > 0;
    if (!hasFiles) return;
    
    setIsAnalyzing(true);

    try {
      const requestData: GradingRequest = {
        title: '',
        description: '',
        level: '',
        weight: 100,
        userId: user?.id || 'anonymous',
      };

      // 处理作文文件
      const base64Images: string[] = [];
      if (uploadedFile) {
        if (uploadedFile.type === 'text/plain') {
          const essayContent = await extractTextFromFile(uploadedFile);
          requestData.essay = essayContent;
        } else {
          const base64Data = await compressFileToBase64(uploadedFile);
          base64Images.push(base64Data);
        }
      } else if (uploadedFiles.length > 0) {
        for (const file of uploadedFiles) {
          if (file.type.startsWith('image/')) {
            const base64Data = await compressFileToBase64(file);
            base64Images.push(base64Data);
          }
        }
      } else if (capturedImages.length > 0) {
        for (const img of capturedImages) {
          // img为base64字符串
          const compressed = await compressBase64ToBase64(img.split(',')[1], 800, 0.7);
          base64Images.push(compressed);
        }
      }
      
      if (base64Images.length > 0) {
        requestData.fileImgs = base64Images;
      }

      // 处理题目（可选）
      const topicParams = await getTopicFileParams();
      Object.assign(requestData, topicParams);

      console.log('Sending grading request:', requestData);

      const response = await fetch(`${API_BASE_URL}/essay/grading`, {
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
    setUploadedFiles([]);
    setCapturedImages([]);
    setTopicFile(null);
    setGradingResult(null);
    setIsAnalyzing(false);
  };

  // 获取所有图片URL用于结果显示
  const getAllImageUrls = () => {
    const urls: string[] = [];
    
    // 上传的图片文件
    if (uploadedFiles.length > 0) {
      uploadedFiles.forEach(file => {
        if (file.type.startsWith('image/')) {
          urls.push(URL.createObjectURL(file));
        }
      });
    }
    
    // 拍照的图片
    if (capturedImages.length > 0) {
      urls.push(...capturedImages);
    }
    
    // 单文件模式的图片
    if (uploadedFile && uploadedFile.type.startsWith('image/')) {
      urls.push(URL.createObjectURL(uploadedFile));
    }
    
    return urls;
  };

  const hasAnyFiles = uploadedFile || uploadedFiles.length > 0 || capturedImages.length > 0;

  // 批改页面SEO参数
  const seoTitle = "智能作文批改 - 神笔作文 | AI智能批改 专业写作指导";
  const seoDesc = "神笔作文智能批改系统，支持拍照上传、文档上传等多种方式，提供专业的AI作文批改服务。包含详细的评分、修改建议、写作技巧指导，帮助学生快速提升写作水平。";
  const seoKeywords = "作文批改,智能批改,AI批改,作文评分,写作指导,作文修改,拍照批改,作文学习";
  const canonicalUrl = window.location.origin + '/grading';

  return (
    <>
      {/* SEO标签渲染 */}
      <SEO
        title={seoTitle}
        description={seoDesc}
        keywords={seoKeywords}
        canonical={canonicalUrl}
        ogImage={'/assets/logo.png'}
        ogType="website"
      />

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

        <SignedOut>
          <Card className="shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">请先登录</h3>
              <p className="text-gray-600 mb-6">您需要登录后才能使用智能作文批改功能</p>
              <Button 
                className="gradient-bg text-white px-6 py-2"
                onClick={() => navigate("/signin?redirect_url=/grading")}
              >
                立即登录
              </Button>
            </CardContent>
          </Card>
        </SignedOut>

        <SignedIn>
          {!gradingResult ? (
            <Card className="shadow-lg">
              <CardHeader className="pb-3 sm:pb-4 px-3 sm:px-6 py-3 sm:py-4">
                <CardTitle className="flex items-center text-base sm:text-lg">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                  <span>上传作文</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 sm:px-6 pb-4 sm:pb-6">
                {/* 题目上传（可选） */}
                <div className="mb-5">
                  <div className="text-gray-600 text-sm mb-2 font-medium">（可选）上传作文题目文件</div>
                  <FileUpload
                    onFileSelect={handleTopicUpload}
                    selectedFile={topicFile}
                  />
                </div>
                
                {/* 作文上传方式选择 */}
                <div>
                  <div className="text-gray-800 text-sm mb-3 font-medium">上传作文（必填）</div>
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="upload" className="flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        多图上传
                      </TabsTrigger>
                      <TabsTrigger value="camera" className="flex items-center gap-2">
                        <Camera className="w-4 h-4" />
                        拍照上传
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="upload" className="mt-4">
                      <FileUpload
                        onFilesSelect={handleFilesUpload}
                        onFileRemove={handleFileRemove}
                        selectedFiles={uploadedFiles}
                        multiple={true}
                        maxFiles={5}
                      />
                    </TabsContent>
                    
                    <TabsContent value="camera" className="mt-4">
                      <CameraCapture
                        onImagesCapture={handleImagesCapture}
                        onImageRemove={handleImageRemove}
                        capturedImages={capturedImages}
                        multiple={true}
                        maxImages={5}
                      />
                    </TabsContent>
                  </Tabs>
                </div>

                {/* 操作按钮 */}
                <div className="flex flex-col sm:flex-row justify-between mt-4 sm:mt-6 gap-3 sm:gap-4">
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    disabled={!hasAnyFiles && !topicFile}
                    size="sm"
                    className="text-xs sm:text-sm w-full sm:w-auto order-2 sm:order-1"
                  >
                    重新选择
                  </Button>
                  <Button
                    onClick={handleStartGrading}
                    disabled={!hasAnyFiles || isAnalyzing}
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
              imageUrls={getAllImageUrls()}
            />
          )}
        </SignedIn>
      </div>
    </div>
    </>
  );
};

export default EssayGrading;
