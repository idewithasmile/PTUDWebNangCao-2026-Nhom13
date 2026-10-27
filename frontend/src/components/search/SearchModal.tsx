'use client';

import { useEffect, useState, useRef, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  X,
  Clock,
  ChefHat,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Tag,
  Loader2,
  BookOpen,
} from 'lucide-react';
import { useUIStore } from '@/stores/ui-store';
import { recipeService } from '@/lib/services/recipe-service';
import { categoryService } from '@/lib/services/category-service';
import type { RecipeSummaryDto, CategoryDto } from '@/lib/types/category';

const POPULAR_SEARCHES = [
  'Phở bò',
  'Bánh mì',
  'Sườn nướng',
  'Canh chua',
  'Món chay',
  'Salad',
  'Trứng cuộn',
];

export default function SearchModal() {
  const router = useRouter();
  const { isSearchModalOpen, setSearchModalOpen, activeSearchQuery, setActiveSearchQuery } =
    useUIStore();

  const [query, setQuery] = useState(activeSearchQuery || '');
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [recipes, setRecipes] = useState<RecipeSummaryDto[]>([]);
  const [matchedCategories, setMatchedCategories] = useState<CategoryDto[]>([]);
  const [allCategories, setAllCategories] = useState<CategoryDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const inputRef = useRef<HTMLInputElement>(null);

  // 1. Phím tắt toàn cục Ctrl+K hoặc Cmd+K để mở modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen(!isSearchModalOpen);
      } else if (e.key === 'Escape' && isSearchModalOpen) {
        setSearchModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchModalOpen, setSearchModalOpen]);

  // Tự động focus ô input khi mở modal
  useEffect(() => {
    if (isSearchModalOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      // Nạp danh mục nếu chưa có
      if (allCategories.length === 0) {
        categoryService
          .getCategories()
          .then((cats) => setAllCategories(cats))
          .catch(() => {});
      }
    }
  }, [isSearchModalOpen, allCategories.length]);

  // 2. Debounce truy vấn tìm kiếm 250ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 250);
    return () => clearTimeout(handler);
  }, [query]);

  // 3. Thực thi tìm kiếm động qua Backend API (Full-Text Search)
  useEffect(() => {
    if (!debouncedQuery) {
      setRecipes([]);
      setMatchedCategories([]);
      setIsLoading(false);
      return;
    }

    let isSubscribed = true;
    setIsLoading(true);

    // Lọc danh mục tương thích ở client
    const lower = debouncedQuery.toLowerCase();
    const filteredCats = allCategories.filter(
      (c) =>
        c.name.toLowerCase().includes(lower) ||
        (c.description && c.description.toLowerCase().includes(lower))
    );
    setMatchedCategories(filteredCats.slice(0, 4));

    // Gọi API Backend: Ưu tiên searchRecipes FTS (nếu >= 2 ký tự), hoặc getRecipes fallback
    const fetchPromise =
      debouncedQuery.length >= 2
        ? recipeService
            .searchRecipes({ searchTerm: debouncedQuery, pageSize: 6 })
            .then((res) => res.items)
            .catch(() => {
              // Fallback qua getRecipes nếu FTS gặp sự cố
              return recipeService
                .getRecipes({ searchTerm: debouncedQuery, pageSize: 6 })
                .then((r) => r.items);
            })
        : recipeService
            .getRecipes({ searchTerm: debouncedQuery, pageSize: 6 })
            .then((res) => res.items);

    fetchPromise
      .then((items) => {
        if (isSubscribed) {
          setRecipes(items || []);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isSubscribed) {
          console.error('Lỗi tìm kiếm:', err);
          setRecipes([]);
          setIsLoading(false);
        }
      });

    return () => {
      isSubscribed = false;
    };
  }, [debouncedQuery, allCategories]);

  const handleSelectQuery = (term: string) => {
    setQuery(term);
    setActiveSearchQuery(term);
  };

  const handleFullSearch = (searchTermToUse?: string) => {
    const term = searchTermToUse ?? query;
    if (!term.trim()) return;
    setActiveSearchQuery(term.trim());
    setSearchModalOpen(false);
    startTransition(() => {
      router.push(`/recipes?searchTerm=${encodeURIComponent(term.trim())}`);
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleFullSearch();
  };

  const getDifficultyBadge = (diff: number) => {
    switch (diff) {
      case 1:
        return <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-xs font-semibold">Dễ</span>;
      case 2:
        return <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-xs font-semibold">Trung bình</span>;
      case 3:
        return <span className="text-orange-700 bg-orange-50 px-2 py-0.5 rounded text-xs font-semibold">Khó</span>;
      default:
        return <span className="text-purple-700 bg-purple-50 px-2 py-0.5 rounded text-xs font-semibold">Chuyên gia</span>;
    }
  };

  if (!isSearchModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 md:p-20 overflow-y-auto">
      {/* Backdrop mờ */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => setSearchModalOpen(false)}
        aria-hidden="true"
      />

      {/* Modal Dialog Content */}
      <div className="relative w-full max-w-2xl transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all border border-slate-100 z-10 my-auto">
        {/* Form Ô Nhập Liệu */}
        <form onSubmit={handleFormSubmit} className="relative border-b border-slate-100">
          <div className="flex items-center px-5 py-4">
            <Search className="h-5 w-5 text-orange-500 mr-3 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm kiếm công thức nấu ăn, món ngon, nguyên liệu..."
              className="w-full text-base sm:text-lg text-slate-800 placeholder-slate-400 bg-transparent outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition mr-2"
                title="Xóa từ khóa"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            {isLoading && (
              <Loader2 className="h-5 w-5 text-orange-500 animate-spin mr-2 shrink-0" />
            )}
            <button
              type="button"
              onClick={() => setSearchModalOpen(false)}
              className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-600 transition"
            >
              ESC
            </button>
          </div>
        </form>

        {/* Nội dung kết quả tìm kiếm hoặc gợi ý */}
        <div className="max-h-[60vh] overflow-y-auto p-5 space-y-6">
          {/* Trường hợp: Chưa nhập từ khóa -> Hiển thị Gợi ý & Danh mục phổ biến */}
          {!debouncedQuery && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  <TrendingUp className="h-4 w-4 text-orange-500" />
                  <span>Tìm kiếm phổ biến</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => handleSelectQuery(term)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50/70 hover:bg-orange-100 text-orange-800 text-xs sm:text-sm font-medium transition"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-orange-500" />
                      <span>{term}</span>
                    </button>
                  ))}
                </div>
              </div>

              {allCategories.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    <Tag className="h-4 w-4 text-amber-500" />
                    <span>Khám phá theo danh mục</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {allCategories.slice(0, 6).map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/categories/${cat.slug}`}
                        onClick={() => setSearchModalOpen(false)}
                        className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-orange-200 hover:bg-orange-50/40 text-left transition group"
                      >
                        <span className="text-xs sm:text-sm font-medium text-slate-700 group-hover:text-orange-600 truncate">
                          {cat.name}
                        </span>
                        <span className="text-[11px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-md">
                          {cat.recipeCount}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Trường hợp: Đã nhập từ khóa */}
          {debouncedQuery && (
            <div className="space-y-5">
              {/* Danh mục khớp */}
              {matchedCategories.length > 0 && (
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Danh mục phù hợp
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {matchedCategories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/categories/${cat.slug}`}
                        onClick={() => setSearchModalOpen(false)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm font-semibold hover:bg-amber-100 transition"
                      >
                        <BookOpen className="h-3.5 w-3.5 text-amber-600" />
                        <span>{cat.name}</span>
                        <span className="text-[10px] bg-amber-200/60 px-1 rounded text-amber-800">
                          {cat.recipeCount}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Danh sách món ăn khớp */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  <span>Công thức món ăn ({recipes.length})</span>
                  {recipes.length > 0 && (
                    <button
                      type="button"
                      onClick={() => handleFullSearch()}
                      className="text-orange-600 hover:text-orange-700 text-xs font-semibold lowercase inline-flex items-center gap-1"
                    >
                      <span>Xem tất cả</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  )}
                </div>

                {recipes.length === 0 && !isLoading ? (
                  <div className="py-8 text-center text-slate-500 space-y-2">
                    <ChefHat className="h-10 w-10 text-slate-300 mx-auto" />
                    <p className="text-sm font-medium text-slate-700">
                      Chưa tìm thấy công thức nào cho &ldquo;{debouncedQuery}&rdquo;
                    </p>
                    <p className="text-xs text-slate-400">
                      Thử tìm kiếm với từ khóa không dấu hoặc nhấn Enter để tìm trong toàn bộ kho lưu trữ.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {recipes.map((item) => (
                      <Link
                        key={item.id}
                        href={`/recipes/${item.slug}`}
                        onClick={() => setSearchModalOpen(false)}
                        className="flex items-center gap-3.5 py-3 px-2 rounded-xl hover:bg-orange-50/50 transition group"
                      >
                        {/* Thumbnail */}
                        <div className="h-12 w-12 rounded-xl bg-orange-100 overflow-hidden shrink-0 flex items-center justify-center border border-slate-100">
                          {item.thumbnailUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.thumbnailUrl}
                              alt={item.title}
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <ChefHat className="h-6 w-6 text-orange-400" />
                          )}
                        </div>

                        {/* Thông tin món ăn */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors truncate">
                            {item.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                            <span className="font-medium text-slate-600">{item.categoryName}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-slate-400" />
                              {item.totalTimeMinutes} phút
                            </span>
                            <span>•</span>
                            {getDifficultyBadge(item.difficulty)}
                          </div>
                        </div>

                        <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Modal: Phím tắt & Nút tìm kiếm toàn diện */}
        <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-3 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span>
              Nhấn <kbd className="font-mono bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-sm font-semibold">↵ Enter</kbd> để tìm kiếm đầy đủ
            </span>
          </div>
          {debouncedQuery && (
            <button
              type="button"
              onClick={() => handleFullSearch()}
              className="font-semibold text-orange-600 hover:text-orange-700 inline-flex items-center gap-1"
            >
              <span>Xem kết quả tại Kho công thức</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
