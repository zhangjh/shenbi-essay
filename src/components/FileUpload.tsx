
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, File, X } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  selectedFiles?: File[];
  onFilesSelect?: (files: File[]) => void;
  onFileRemove?: (index: number) => void;
  multiple?: boolean;
  maxFiles?: number;
}

const FileUpload = ({ 
  onFileSelect, 
  selectedFile, 
  selectedFiles = [], 
  onFilesSelect, 
  onFileRemove, 
  multiple = false,
  maxFiles = 5 
}: FileUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (multiple && onFilesSelect) {
      const validFiles = files.filter(isValidFile);
      const remainingSlots = maxFiles - selectedFiles.length;
      const filesToAdd = validFiles.slice(0, remainingSlots);
      if (filesToAdd.length > 0) {
        onFilesSelect([...selectedFiles, ...filesToAdd]);
      }
    } else if (files.length > 0) {
      const file = files[0];
      if (isValidFile(file)) {
        onFileSelect(file);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      if (multiple && onFilesSelect) {
        const fileArray = Array.from(files);
        const validFiles = fileArray.filter(isValidFile);
        const remainingSlots = maxFiles - selectedFiles.length;
        const filesToAdd = validFiles.slice(0, remainingSlots);
        if (filesToAdd.length > 0) {
          onFilesSelect([...selectedFiles, ...filesToAdd]);
        }
      } else {
        const file = files[0];
        if (isValidFile(file)) {
          onFileSelect(file);
        }
      }
    }
  };

  const isValidFile = (file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf', 'text/plain'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (!validTypes.includes(file.type)) {
      alert('请上传图片文件(JPG/PNG)或PDF、TXT文档');
      return false;
    }
    
    if (file.size > maxSize) {
      alert('文件大小不能超过10MB');
      return false;
    }
    
    return true;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const clearFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    // Note: We don't have a clear callback, so we'll just trigger with null
  };

  const showUploadArea = multiple ? selectedFiles.length < maxFiles : !selectedFile;
  const hasFiles = multiple ? selectedFiles.length > 0 : !!selectedFile;

  return (
    <div className="space-y-4">
      {showUploadArea && (
        <Card 
          className={`border-2 border-dashed transition-colors cursor-pointer ${
            isDragOver 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Upload className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {multiple ? '拖拽图片到此处或点击上传' : '拖拽文件到此处或点击上传'}
            </h3>
            <p className="text-gray-500 text-center">
              {multiple 
                ? `支持 JPG、PNG 图片格式，最多${maxFiles}张图片\n文件大小不超过 10MB`
                : '支持 JPG、PNG 图片格式，以及 PDF、TXT 文档\n文件大小不超过 10MB'
              }
            </p>
            <Button variant="outline" className="mt-4">
              {multiple ? `选择图片 (${selectedFiles.length}/${maxFiles})` : '选择文件'}
            </Button>
          </CardContent>
        </Card>
      )}
      
      {/* 多图预览 */}
      {multiple && selectedFiles.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {selectedFiles.map((file, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                {file.type.startsWith('image/') ? (
                  <img 
                    src={URL.createObjectURL(file)} 
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <File className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
              <button
                onClick={() => onFileRemove?.(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
              <p className="text-xs text-gray-600 mt-1 truncate">{file.name}</p>
            </div>
          ))}
        </div>
      )}
      
      {/* 单文件显示 */}
      {!multiple && selectedFile && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="flex items-center py-4">
            <File className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="font-medium text-green-800">{selectedFile.name}</p>
              <p className="text-sm text-green-600">{formatFileSize(selectedFile.size)}</p>
            </div>
          </CardContent>
        </Card>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept={multiple ? "image/*" : "image/*,.pdf,.txt"}
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default FileUpload;
