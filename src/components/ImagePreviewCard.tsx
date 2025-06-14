
import React from 'react';
import { Maximize } from 'lucide-react';

interface ImagePreviewCardProps {
  imageUrl: string;
  onImageClick: () => void;
}

const ImagePreviewCard = ({ imageUrl, onImageClick }: ImagePreviewCardProps) => {
  return (
    <div className="flex justify-center mb-4 sm:mb-6 lg:mb-8">
      <div className="bg-white rounded-xl sm:rounded-2xl p-2 sm:p-4 lg:p-6 shadow-lg border border-gray-100 w-full max-w-xs sm:max-w-sm lg:max-w-md">
        <div
          tabIndex={0}
          title="点击可放大/全屏查看"
          className="relative rounded-lg sm:rounded-xl overflow-hidden shadow-md border border-blue-100 bg-slate-50 w-full aspect-[4/3] group cursor-zoom-in transition hover:scale-[1.02] hover:shadow-xl"
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
          <div className="absolute right-1.5 sm:right-2 lg:right-3 bottom-1.5 sm:bottom-2 lg:bottom-3 bg-white/90 rounded-full p-1 sm:p-1.5 lg:p-2 shadow-lg group-hover:bg-white group-hover:scale-110 transition-all">
            <Maximize className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-sky-700" />
          </div>
          {/* 蒙版 */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-blue-50/40 via-white/10 to-transparent" />
        </div>
        <div className="text-xs sm:text-sm text-gray-500 mt-1.5 sm:mt-2 lg:mt-3 text-center font-medium">
          上传图片预览（点击可放大全屏）
        </div>
      </div>
    </div>
  );
};

export default ImagePreviewCard;
