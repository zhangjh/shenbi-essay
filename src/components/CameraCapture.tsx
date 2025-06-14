
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, RotateCcw, Check, X } from 'lucide-react';

interface CameraCaptureProps {
  onImageCapture: (imageData: string) => void;
  capturedImage: string | null;
}

const CameraCapture = ({ onImageCapture, capturedImage }: CameraCaptureProps) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // 检测是否为移动设备
    const checkMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    
    checkMobile();
  }, []);

  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: isMobile ? { ideal: 'environment' } : 'user',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      setIsStreaming(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('无法访问摄像头，请检查权限设置');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsStreaming(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        onImageCapture(imageData);
        stopCamera();
      }
    }
  };

  const retakePhoto = () => {
    onImageCapture('');
    startCamera();
  };

  return (
    <div className="space-y-4">
      {!capturedImage ? (
        <Card>
          <CardContent className="p-6">
            {!isStreaming ? (
              <div className="text-center py-12">
                <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  使用摄像头拍照
                </h3>
                <p className="text-gray-500 mb-6">
                  {isMobile ? '点击下方按钮开启摄像头' : '需要摄像头权限来拍摄作文'}
                </p>
                <Button onClick={startCamera} className="gradient-bg text-white">
                  <Camera className="w-4 h-4 mr-2" />
                  开启摄像头
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative bg-black rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    className="w-full h-64 md:h-96 object-cover"
                    autoPlay
                    playsInline
                    muted
                  />
                </div>
                <div className="flex justify-center space-x-4">
                  <Button variant="outline" onClick={stopCamera}>
                    <X className="w-4 h-4 mr-2" />
                    取消
                  </Button>
                  <Button onClick={capturePhoto} className="gradient-bg text-white">
                    <Camera className="w-4 h-4 mr-2" />
                    拍照
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="relative bg-black rounded-lg overflow-hidden">
                <img 
                  src={capturedImage} 
                  alt="Captured" 
                  className="w-full h-64 md:h-96 object-cover"
                />
              </div>
              <div className="flex justify-center space-x-4">
                <Button variant="outline" onClick={retakePhoto}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  重新拍照
                </Button>
                <Button className="gradient-bg text-white">
                  <Check className="w-4 h-4 mr-2" />
                  确认使用
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraCapture;
