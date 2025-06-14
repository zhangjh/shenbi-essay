
import React from 'react';
import { Maximize } from 'lucide-react';

interface ImagePreviewCardProps {
  imageUrl: string;
  onImageClick: () => void;
}

const ImagePreviewCard = ({ imageUrl, onImageClick }: ImagePreviewCardProps) => {
  return (
    <div className="flex justify-center mb-6 sm:mb-8">
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 w-full max-w-sm sm:max-w-md">
        <div
          tabIndex={0}
          title="点击可放大/全屏查看"
          className="relative rounded-xl overflow-hidden shadow-md border border-blue-100 bg-slate-50 w-full aspect-[4/3] group cursor-zoom-in transition hover:scale-[1.02] hover:shadow-xl"
          style={{ outline: 'none' }}
          onClick={onImageClick}
          onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onImageClick()}
        >
          <img
            src={imageUrl}
            alt="上传的作文预览"
            className="object-contain w-full h-full transition"
            draggable={false}
          />
          {/* 放大icon */}
          <div className="absolute right-2 sm:right-3 bottom-2 sm:bottom-3 bg-white/90 rounded-full p-1.5 sm:p-2 shadow-lg group-hover:bg-white group-hover:scale-110 transition-all">
            <Maximize className="w-4 h-4 sm:w-5 sm:h-5 text-sky-700" />
          </div>
          {/* 蒙版 */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-blue-50/40 via-white/10 to-transparent" />
        </div>
        <div className="text-xs sm:text-sm text-gray-500 mt-2 sm:mt-3 text-center font-medium">
          上传图片预览（点击可放大全屏）
        </div>
      </div>
    </div>
  );
};

export default ImagePreviewCard;
