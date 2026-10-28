import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Tiện ích kết hợp class Tailwind CSS chuẩn shadcn/ui.
 * Giúp merge linh hoạt các class điều kiện và giải quyết xung đột Tailwind utility.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Định dạng thời gian nấu (phút -> x giờ y phút hoặc x phút)
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} phút`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours} giờ ${remainingMinutes} phút` : `${hours} giờ`;
}

/**
 * Định dạng ngày giờ chuẩn hiển thị tiếng Việt
 */
export function formatDate(dateString: string | Date): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

/**
 * Chuẩn hóa URL hình ảnh (hỗ trợ cả đường dẫn MinIO cục bộ lẫn URL tuyệt đối bên ngoài)
 */
export function resolveMediaUrl(url?: string | null): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:') || url.startsWith('data:')) {
    return url;
  }
  // Chuẩn hóa đường dẫn tương đối MinIO S3 bucket (/culinary-blog/...)
  if (url.startsWith('/culinary-blog/')) {
    const minioHost = typeof window !== 'undefined' && process.env.NEXT_PUBLIC_MINIO_URL
      ? process.env.NEXT_PUBLIC_MINIO_URL
      : 'http://localhost:9000';
    return `${minioHost}${url}`;
  }
  return url;
}

