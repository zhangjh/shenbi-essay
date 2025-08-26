
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, RotateCcw, Check, X } from 'lucide-react';

interface CameraCaptureProps {
  onImageCapture: (imageData: string) => void;
  capturedImage: string | null;
  capturedImages?: string[];
  onImagesCapture?: (images: string[]) => void;
  onImageRemove?: (index: number) => void;
  multiple?: boolean;
  maxImages?: number;
}

const CameraCapture = ({ 
  onImageCapture = () => {}, 
  capturedImage, 
  capturedImages = [], 
  onImagesCapture, 
  onImageRemove, 
  multiple = false,
  maxImages = 5 
}: CameraCaptureProps) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // 检测是否为移动设备
    const checkMobile = () => {
      const userAgent = navigator.userAgent;
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      setIsMobile(isMobileDevice);
      console.log('Is mobile device:', isMobileDevice);
    };
    
    checkMobile();
  }, []);

  useEffect(() => {
    if (isStreaming && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(err => {
        console.error('Error playing video:', err);
        setError('无法播放摄像头画面');
      });
    }
  }, [isStreaming]);

  const startCamera = async () => {
    try {
      setError(null);
      console.log('Starting camera for mobile:', isMobile);
      
      // 移动端使用较低帧率和分辨率以减少卡顿
      const constraints = {
        video: {
          facingMode: isMobile ? { ideal: 'environment' } : 'user',
          width: { ideal: isMobile ? 640 : 1280 },
          height: { ideal: isMobile ? 480 : 720 },
          frameRate: { ideal: isMobile ? 15 : 30 }
        },
        audio: false
      };

      console.log('Camera constraints:', constraints);

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      setIsStreaming(true);
      console.log('Camera started successfully');
    } catch (error) {
      console.error('Error accessing camera:', error);
      let errorMessage = '无法访问摄像头';
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          errorMessage = '摄像头权限被拒绝，请在浏览器设置中允许访问摄像头';
        } else if (error.name === 'NotFoundError') {
          errorMessage = '未找到摄像头设备';
        } else if (error.name === 'NotSupportedError') {
          errorMessage = '浏览器不支持摄像头功能';
        } else if (error.name === 'OverconstrainedError') {
          errorMessage = '摄像头不支持所需的分辨率';
        }
      }
      
      setError(errorMessage);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log('Camera track stopped:', track.kind);
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
    setError(null);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      // 确保视频有内容
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        setError('摄像头画面未准备好，请稍后再试');
        return;
      }
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.6);
        
        // 清理canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (multiple && onImagesCapture) {
          const newImages = [...capturedImages, imageData];
          onImagesCapture(newImages);
          // 多图模式下继续拍照
          if (newImages.length >= maxImages) {
            stopCamera();
          }
        } else {
          onImageCapture(imageData);
          stopCamera();
        }
        console.log('Photo captured successfully');
      }
    }
  };

  const retakePhoto = () => {
    // 清理旧图片URL
    if (multiple) {
      capturedImages.forEach(img => {
        if (img.startsWith('blob:')) {
          URL.revokeObjectURL(img);
        }
      });
      onImagesCapture?.([]);
    } else {
      if (capturedImage && capturedImage.startsWith('blob:')) {
        URL.revokeObjectURL(capturedImage);
      }
      onImageCapture('');
    }
    startCamera();
  };

  const canTakeMore = multiple ? capturedImages.length < maxImages : false;
  const hasImages = multiple ? capturedImages.length > 0 : !!capturedImage;

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* 多图已拍摄预览 */}
      {multiple && capturedImages.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-blue-800">
                已拍摄 {capturedImages.length}/{maxImages} 张
              </h4>
              <Button variant="outline" onClick={retakePhoto} size="sm">
                <RotateCcw className="w-3 h-3 mr-1" />
                <span className="text-xs">重新拍照</span>
              </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {capturedImages.map((image, index) => (
                <div key={index} className="relative group aspect-square">
                  <img 
                    src={image} 
                    alt={`拍摄 ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    onClick={() => onImageRemove?.(index)}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* 单图已拍摄预览 */}
      {!multiple && capturedImage && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="relative bg-black rounded-lg overflow-hidden">
                <img 
                  src={capturedImage} 
                  alt="Captured" 
                  className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover"
                />
              </div>
              <div className="flex justify-center space-x-3 sm:space-x-4">
                <Button variant="outline" onClick={retakePhoto} size="sm">
                  <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="text-xs sm:text-sm">重新拍照</span>
                </Button>
                <Button className="gradient-bg text-white" size="sm">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="text-xs sm:text-sm">确认使用</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* 拍照界面 */}
      {((!multiple && !capturedImage) || (multiple && canTakeMore)) && (
        <Card>
          <CardContent className="p-3 sm:p-4 lg:p-6">
            {!isStreaming ? (
              <div className="text-center py-6 sm:py-8 lg:py-12">
                <Camera className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
                  {multiple ? `拍摄作文照片 (${capturedImages.length}/${maxImages})` : '使用摄像头拍照'}
                </h3>
                <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6 px-2">
                  {isMobile ? '点击下方按钮开启摄像头拍照' : '需要摄像头权限来拍摄作文'}
                </p>
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
                <Button onClick={startCamera} className="gradient-bg text-white text-sm sm:text-base">
                  <Camera className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  开启摄像头
                </Button>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                <div className="relative bg-black rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    className={`w-full object-cover ${isMobile ? 'h-96 sm:h-[32rem]' : 'h-48 sm:h-64 md:h-80 lg:h-96'}`}
                    autoPlay
                    playsInline
                    muted
                    style={{ 
                      transform: !isMobile ? 'scaleX(-1)' : 'none',
                      aspectRatio: isMobile ? '3/4' : 'auto'
                    }}
                  />
                  {error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
                      <p className="text-white text-sm text-center px-4">{error}</p>
                    </div>
                  )}
                </div>
                <div className="flex justify-center space-x-3 sm:space-x-4">
                  <Button variant="outline" onClick={stopCamera} size="sm">
                    <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="text-xs sm:text-sm">取消</span>
                  </Button>
                  <Button onClick={capturePhoto} className="gradient-bg text-white" size="sm">
                    <Camera className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="text-xs sm:text-sm">
                      {multiple ? `拍照 (${capturedImages.length + 1}/${maxImages})` : '拍照'}
                    </span>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraCapture;
