
import { useState } from 'react';
import ImageFullscreenPreview from './ImageFullscreenPreview';
import ImagePreviewCard from './ImagePreviewCard';
import MarkdownResult from './MarkdownResult';
import StructuredResult from './StructuredResult';
import ActionButtons from './ActionButtons';

interface GradingResultProps {
  result: {
    // 新的 markdown 格式结果
    markdownContent?: string;
    isMarkdown?: boolean;
    // 旧的结构化结果（向后兼容）
    score?: number;
    totalScore?: number;
    grade?: string;
    strengths?: string[];
    improvements?: string[];
    detailedFeedback?: string;
  };
  onNewGrading: () => void;
  imageUrl?: string;
  imageUrls?: string[];
}

const GradingResult = ({ result, onNewGrading, imageUrl, imageUrls = [] }: GradingResultProps) => {
  // 控制图片全屏预览
  const [showPreview, setShowPreview] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const allImages = imageUrls.length > 0 ? imageUrls : (imageUrl ? [imageUrl] : []);

  const exportResult = () => {
    let content = '';
    if (result.isMarkdown && result.markdownContent) {
      content = result.markdownContent;
    } else {
      content = `
作文批改报告
=============

总分：${result.score}/${result.totalScore} (${result.grade})

优点：
${result.strengths?.map(item => `• ${item}`).join('\n')}

改进建议：
${result.improvements?.map(item => `• ${item}`).join('\n')}

详细评语：
${result.detailedFeedback}

生成时间：${new Date().toLocaleString()}
      `;
    }
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `作文批改报告_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 判断是markdown批改结果
  if (result.isMarkdown && result.markdownContent) {
    return (
      <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 lg:px-6 space-y-4 sm:space-y-6 lg:space-y-8">
        {/* 多图预览区 */}
        {allImages.length > 0 && (
          <>
            {allImages.length === 1 ? (
              <ImagePreviewCard 
                imageUrl={allImages[0]} 
                onImageClick={() => setShowPreview(true)} 
              />
            ) : (
              <div className="space-y-3">
                <div className="text-center text-sm text-gray-600">
                  作文图片 ({allImages.length} 张)
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {allImages.map((url, index) => (
                    <div 
                      key={index}
                      className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => {
                        setCurrentImageIndex(index);
                        setShowPreview(true);
                      }}
                    >
                      <img 
                        src={url} 
                        alt={`作文图片 ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-1 right-1 bg-black/50 text-white text-xs px-1 rounded">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <ImageFullscreenPreview
              src={allImages[currentImageIndex]}
              alt={`上传的作文图片 ${currentImageIndex + 1}`}
              show={showPreview}
              onClose={() => setShowPreview(false)}
            />
          </>
        )}

        {/* Markdown 结果显示 */}
        <MarkdownResult markdownContent={result.markdownContent} />

        {/* 操作按钮 */}
        <ActionButtons onExport={exportResult} onNewGrading={onNewGrading} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 lg:px-6 space-y-4 sm:space-y-6">
      {/* 多图预览区 */}
      {allImages.length > 0 && (
        <>
          {allImages.length === 1 ? (
            <div className="flex justify-center mb-4">
              <div
                tabIndex={0}
                title="点击可放大/全屏查看"
                className="relative rounded-xl overflow-hidden shadow-md border border-blue-100 bg-slate-50 w-full max-w-md aspect-[4/3] group cursor-zoom-in transition hover:scale-[1.02] hover:shadow-xl"
                style={{ outline: 'none' }}
                onClick={() => setShowPreview(true)}
                onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setShowPreview(true)}
              >
                <img
                  src={allImages[0]}
                  alt="上传的作文预览"
                  className="object-contain w-full h-full transition"
                  style={{ maxHeight: 360 }}
                  draggable={false}
                />
                <div className="absolute right-3 bottom-3 bg-white/80 rounded-full p-2 shadow group-hover:bg-white group-hover:scale-110 transition-all">
                  <svg className="w-5 h-5 text-sky-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M9 18a9 9 0 1 1 9-9"/>
                  </svg>
                </div>
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-blue-50/60 via-white/20 to-transparent" />
              </div>
              <div className="text-xs text-gray-400 mt-1">上传图片预览（点击可放大全屏）</div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-center text-sm text-gray-600">
                作文图片 ({allImages.length} 张)
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {allImages.map((url, index) => (
                  <div 
                    key={index}
                    className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => {
                      setCurrentImageIndex(index);
                      setShowPreview(true);
                    }}
                  >
                    <img 
                      src={url} 
                      alt={`作文图片 ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-1 right-1 bg-black/50 text-white text-xs px-1 rounded">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <ImageFullscreenPreview
            src={allImages[currentImageIndex]}
            alt={`上传的作文图片 ${currentImageIndex + 1}`}
            show={showPreview}
            onClose={() => setShowPreview(false)}
          />
        </>
      )}

      {/* 结构化结果显示 */}
      <StructuredResult
        score={result.score}
        totalScore={result.totalScore}
        grade={result.grade}
        strengths={result.strengths}
        improvements={result.improvements}
        detailedFeedback={result.detailedFeedback}
      />

      {/* 操作按钮 */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <ActionButtons onExport={exportResult} onNewGrading={onNewGrading} />
      </div>
    </div>
  );
};

export default GradingResult;
