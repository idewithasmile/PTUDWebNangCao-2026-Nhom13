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
