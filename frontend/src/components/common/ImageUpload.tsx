'use client';

import { useState, useRef } from 'react';
import { UploadCloud, X, CheckCircle, AlertCircle, Loader2, Image as ImageIcon } from 'lucide-react';
import { fileService } from '@/lib/services/file-service';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  className?: string;
  label?: string;
  disabled?: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

export default function ImageUpload({
  value,
  onChange,
  folder = 'recipes',
  className,
  label = 'Tải ảnh lên (Tối đa 5MB: JPG, PNG, WebP, AVIF)',
  disabled = false,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setErrorMessage(null);

    // Kiểm tra kích thước
    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage('Kích thước ảnh vượt quá 5MB. Vui lòng chọn ảnh nhỏ hơn.');
      return;
    }

    // Kiểm tra định dạng MIME
    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrorMessage('Định dạng ảnh không hỗ trợ. Chỉ chấp nhận JPG, PNG, WebP, AVIF.');
      return;
    }

    try {
      setIsUploading(true);
      const res = await fileService.uploadFile(file, folder);
      onChange(res.url);
    } catch (err: unknown) {
      console.error('Lỗi tải ảnh lên:', err);
      const error = err as { detail?: string; title?: string };
      setErrorMessage(error.detail || error.title || 'Tải ảnh lên thất bại. Vui lòng thử lại.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled || isUploading) return;
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!value || disabled || isUploading) return;
    try {
      setIsUploading(true);
      await fileService.deleteFile(value);
    } catch {
      // Dù API xóa vật lý lỗi vẫn clear URL ở client
    } finally {
      onChange('');
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && <label className="block text-xs font-semibold text-gray-700">{label}</label>}

      {value ? (
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-inner group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Uploaded preview"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemove}
              disabled={disabled || isUploading}
              className="flex items-center gap-1.5"
            >
              <X className="h-4 w-4" />
              <span>Xóa ảnh</span>
            </Button>
          </div>
          <div className="absolute bottom-2 left-2 rounded-lg bg-black/60 px-2 py-1 text-[11px] font-medium text-white flex items-center gap-1 backdrop-blur">
            <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
            <span>Đã lưu MinIO</span>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
          className={cn(
            'flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200',
            isDragOver
              ? 'border-orange-500 bg-orange-50/50'
              : 'border-gray-200 bg-gray-50/40 hover:bg-orange-50/20 hover:border-orange-300',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
            disabled={disabled || isUploading}
          />

          {isUploading ? (
            <div className="flex flex-col items-center gap-2 text-orange-600 py-4">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="text-xs font-semibold">Đang tải ảnh lên MinIO S3...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 mb-1">
                <UploadCloud className="h-6 w-6" />
              </div>
              <p className="text-sm font-bold text-gray-800">
                Kéo thả ảnh vào đây, hoặc <span className="text-orange-600 underline">chọn từ máy tính</span>
              </p>
              <p className="text-xs text-gray-400">
                Chấp nhận JPEG, PNG, WebP, AVIF (Tối đa 5 MB)
              </p>
            </div>
          )}
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-1.5 text-xs font-medium text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-100">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
