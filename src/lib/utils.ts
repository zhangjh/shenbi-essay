import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 通用canvas图片压缩
 * @param img HTMLImageElement
 * @param maxWidth 最大宽度
 * @param quality jpeg质量
 * @returns 压缩后的base64字符串（不带data:image头）
 */
function compressImageElementToBase64(img: HTMLImageElement, maxWidth = 800, quality = 0.7): string {
  let { width, height } = img;
  if (width > maxWidth) {
    height = Math.round((maxWidth / width) * height);
    width = maxWidth;
  }
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, width, height);
  const dataUrl = canvas.toDataURL('image/jpeg', quality);
  return dataUrl.split(',')[1];
}

/**
 * 压缩图片文件为base64字符串
 * @param file 原始图片文件
 * @param maxWidth 最大宽度，默认800px
 * @param quality jpeg质量，0-1，默认0.7
 * @returns 压缩后的base64字符串（不带data:image头）
 */
export async function compressImageFileToBase64(file: File, maxWidth = 800, quality = 0.7): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const reader = new FileReader();
    reader.onload = (e) => {
      img.onload = () => {
        try {
          resolve(compressImageElementToBase64(img, maxWidth, quality));
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = reject;
      img.src = e.target.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * 压缩base64图片字符串
 * @param base64 原始base64字符串（不带data:image头）
 * @param maxWidth 最大宽度，默认800px
 * @param quality jpeg质量，0-1，默认0.7
 * @returns 压缩后的base64字符串（不带data:image头）
 */
export async function compressBase64ToBase64(base64: string, maxWidth = 800, quality = 0.7): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      try {
        resolve(compressImageElementToBase64(img, maxWidth, quality));
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = reject;
    img.src = 'data:image/jpeg;base64,' + base64;
  });
}
