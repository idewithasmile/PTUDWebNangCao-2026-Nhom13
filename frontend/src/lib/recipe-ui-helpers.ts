import { resolveMediaUrl } from '@/lib/utils';
import type { RecipeSummaryDto } from '@/lib/types/category';

export const FALLBACK_RECIPE_IMAGES = [
  'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80', // Bò xào lúc lắc / bít tết bốc khói
  'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80', // Phở bò
  'https://images.unsplash.com/photo-1505253758473-96b3015f21c9?auto=format&fit=crop&w=800&q=80', // Bánh mì kẹp thịt sườn
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80', // Thịt nướng bún chả
  'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=800&q=80', // Cà ri gà nước cốt dừa
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80', // Thịt kho tàu
  'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80', // Cơm chiên ngọc bích
  'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80', // Bánh xèo miền Nam
];

/**
 * Xóa các đuôi timestamp kiểm thử tự động khỏi tiêu đề (ví dụ 1793072944913, E2E Test)
 */
export function cleanRecipeTitle(title?: string): string {
  if (!title) return '';
  return title
    .replace(/\s+\d{6,}$/, '')
    .replace(/\s+\(E2E Test\)$/i, '')
    .replace(/\s+E2E\s+\d{6,}$/i, '')
    .replace(/\s+E2E$/i, '')
    .trim();
}

/**
 * Lấy URL ảnh đại diện hấp dẫn, trực quan theo tên món ăn và lọc bỏ các ảnh dummy kiểm thử
 */
export function getRecipeDisplayImage(recipe: { title?: string; thumbnailUrl?: string | null }, fallbackIndex = 0): string {
  if (recipe.thumbnailUrl) {
    const resolved = resolveMediaUrl(recipe.thumbnailUrl);
    // Bỏ qua ảnh dummy đỏ tạo bởi test MinIO
    if (!resolved.includes('06995e54-6ea6-48ef-8f84-d711d87a2fab.png')) {
      return resolved;
    }
  }

  const title = (recipe.title || '').toLowerCase();
  if (title.includes('bò') && (title.includes('lúc lắc') || title.includes('xào'))) {
    return 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80';
  }
  if (title.includes('bít tết') || title.includes('steak')) {
    return 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1200&q=80';
  }
  if (title.includes('phở')) {
    return 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=1200&q=80';
  }
  if (title.includes('bánh mì')) {
    return 'https://images.unsplash.com/photo-1505253758473-96b3015f21c9?auto=format&fit=crop&w=1200&q=80';
  }
  if (title.includes('kho tàu') || title.includes('thịt heo') || title.includes('thịt kho')) {
    return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80';
  }
  if (title.includes('bún chả') || title.includes('nướng')) {
    return 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80';
  }
  if (title.includes('cà ri') || title.includes('súp') || title.includes('canh')) {
    return 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=1200&q=80';
  }
  if (title.includes('cơm')) {
    return 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80';
  }
  if (title.includes('bánh xèo') || title.includes('chiên')) {
    return 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=1200&q=80';
  }

  return FALLBACK_RECIPE_IMAGES[fallbackIndex % FALLBACK_RECIPE_IMAGES.length];
}

/**
 * Định dạng ngày tạo/xuất bản chuẩn Việt Nam (DD/MM/YYYY)
 */
export function formatRecipeDate(dateStr?: string | null): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return '';
  }
}

/**
 * Trả về thông tin hiển thị avatar, màu nhận diện và chữ cái đầu của tác giả
 */
export function getAuthorAvatarInfo(name?: string | null) {
  const trimmed = name?.trim() || 'Tác giả';
  const initial = trimmed.charAt(0).toUpperCase();

  // Bảng màu gradient cao cấp xác định theo mã màu hex để luôn hiển thị chuẩn 100%
  const gradientMap: Record<string, string> = {
    A: 'linear-gradient(135deg, #f97316 0%, #f59e0b 100%)',
    B: 'linear-gradient(135deg, #3b82f6 0%, #4f46e5 100%)',
    C: 'linear-gradient(135deg, #10b981 0%, #0d9488 100%)',
    D: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
    Đ: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
    H: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
    K: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
    L: 'linear-gradient(135deg, #d946ef 0%, #c026d3 100%)',
    M: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    N: 'linear-gradient(135deg, #10b981 0%, #15803d 100%)',
    P: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
    Q: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)',
    T: 'linear-gradient(135deg, #ea580c 0%, #d97706 100%)',
    V: 'linear-gradient(135deg, #14b8a6 0%, #059669 100%)',
  };

  const gradient =
    gradientMap[initial] || 'linear-gradient(135deg, #f97316 0%, #f59e0b 100%)';

  return {
    name: trimmed,
    initial,
    gradient,
  };
}
