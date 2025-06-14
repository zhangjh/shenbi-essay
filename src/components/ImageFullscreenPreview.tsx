
import React from 'react';

interface ImageFullscreenPreviewProps {
  src: string;
  alt?: string;
  show: boolean;
  onClose: () => void;
}

const ImageFullscreenPreview = ({
  src,
  alt,
  show,
  onClose,
}: ImageFullscreenPreviewProps) => {
  if (!show) return null;
  
  return (
    <div
      className="fixed inset-0 z-[120] bg-black/80 flex items-center justify-center transition animate-fade-in"
      onClick={onClose}
      style={{ cursor: 'zoom-out' }}
    >
      <img
        src={src}
        alt={alt}
        className="max-w-full max-h-full rounded-lg shadow-2xl border-4 border-white"
        onClick={e => e.stopPropagation()}
        style={{ objectFit: 'contain' }}
      />
      <button
        className="absolute top-6 right-8 text-white bg-black/60 rounded-full p-3 hover:bg-black/90 transition"
        onClick={onClose}
        aria-label="关闭预览"
      >
        <svg width={26} height={26} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="m18 6-6-6m0 0-6-6m6 6 6 6m-6-6-6 6"/>
        </svg>
      </button>
    </div>
  );
};

export default ImageFullscreenPreview;
