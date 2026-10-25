'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRecipes, usePublishRecipe, useUnpublishRecipe, useArchiveRecipe, useDeleteRecipe } from '@/features/recipes/hooks';
import type { RecipeSummaryDto, RecipeStatus } from '@/lib/types/category';
import type { UserProfile } from '@/types/auth';
import DeleteRecipeModal from '@/components/recipes/DeleteRecipeModal';
import Toast, { ToastMessage } from '@/components/common/Toast';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  CheckCircle2,
  FileEdit,
  Archive,
  Clock,
  Users,
  ChefHat,
  Loader2,
  Sparkles,
  ArrowUpRight,
  RefreshCw,
  FolderOpen,
} from 'lucide-react';

interface AuthorDashboardViewProps {
  user: UserProfile;
}

export default function AuthorDashboardView({ user }: AuthorDashboardViewProps) {
  // State tìm kiếm, tab trạng thái
  const [activeTab, setActiveTab] = useState<'ALL' | RecipeStatus>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  
  // State Modal xóa
  const [recipeToDelete, setRecipeToDelete] = useState<{ id: string; title: string } | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // State Toasts thông báo
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'warning', title: string, message?: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // 1. Fetch toàn bộ bài viết của tác giả (onlyMine = true)
  const {
    data: recipesData,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useRecipes({ onlyMine: true, pageSize: 100 });

  const myRecipes = useMemo(() => recipesData?.items ?? [], [recipesData]);

  // 2. Thống kê bài viết
  const stats = useMemo(() => {
    const total = myRecipes.length;
    const published = myRecipes.filter((r) => r.status === 'Published').length;
    const draft = myRecipes.filter((r) => r.status === 'Draft').length;
    const archived = myRecipes.filter((r) => r.status === 'Archived').length;
    return { total, published, draft, archived };
  }, [myRecipes]);

  // 3. Lọc theo tab và tìm kiếm
  const filteredRecipes = useMemo(() => {
    return myRecipes.filter((recipe) => {
      const matchTab = activeTab === 'ALL' || recipe.status === activeTab;
      const matchSearch =
        !searchTerm.trim() ||
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        recipe.categoryName?.toLowerCase().includes(searchTerm.toLowerCase().trim());
      return matchTab && matchSearch;
    });
  }, [myRecipes, activeTab, searchTerm]);

  // 4. Mutations
  const publishMutation = usePublishRecipe();
  const unpublishMutation = useUnpublishRecipe();
  const archiveMutation = useArchiveRecipe();
  const deleteMutation = useDeleteRecipe();

  // Handlers
  const handlePublish = async (recipe: RecipeSummaryDto) => {
    try {
      await publishMutation.mutateAsync(recipe.id);
      addToast('success', 'Xuất bản thành công', `Công thức "${recipe.title}" đã được công khai trên hệ thống.`);
      refetch();
    } catch {
      addToast('error', 'Xuất bản thất bại', 'Công thức cần có ít nhất 1 bước thực hiện trước khi xuất bản.');
    }
  };

  const handleUnpublish = async (recipe: RecipeSummaryDto) => {
    try {
      await unpublishMutation.mutateAsync(recipe.id);
      addToast('success', 'Chuyển về bản nháp', `Công thức "${recipe.title}" đã được chuyển về trạng thái Draft.`);
      refetch();
    } catch {
      addToast('error', 'Thao tác thất bại', 'Không thể chuyển trạng thái lúc này.');
    }
  };

  const handleArchive = async (recipe: RecipeSummaryDto) => {
    try {
      await archiveMutation.mutateAsync(recipe.id);
      addToast('success', 'Đã lưu trữ công thức', `Công thức "${recipe.title}" đã được đưa vào kho lưu trữ.`);
      refetch();
    } catch {
      addToast('error', 'Lưu trữ thất bại', 'Không thể lưu trữ công thức lúc này.');
    }
  };

  const handleConfirmDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id);
    addToast('success', 'Xóa thành công', 'Công thức đã được xóa mềm an toàn.');
    refetch();
  };
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <Toast toast={t} onClose={removeToast} />
          </div>
        ))}
      </div>

      {/* Header Chào Mừng Tác Giả */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white rounded-3xl p-6 sm:p-8 shadow-lg shadow-orange-600/10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>Không Gian Sáng Tạo Tác Giả</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Xin chào, {user.displayName || user.userName}! 🍳
          </h1>
          <p className="mt-1 text-sm text-orange-100 max-w-2xl">
            Quản lý toàn diện các bí quyết nấu ăn, kiểm soát trạng thái bài viết và sáng tạo các công thức mới cho cộng đồng Culinary Blog.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition backdrop-blur-md"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className={`w-5 h-5 ${isFetching ? 'animate-spin' : ''}`} />
          </button>
          <Link
            href="/recipes/create"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-orange-700 font-bold text-sm shadow-md hover:bg-orange-50 transition transform active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span>Tạo Công Thức Mới</span>
          </Link>
        </div>
      </div>

      {/* 4 Thẻ Thống Kê Nhanh */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-blue-50 text-blue-600">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng công thức</p>
            <p className="text-2xl font-black text-gray-900 mt-0.5">{stats.total}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Đã xuất bản</p>
            <p className="text-2xl font-black text-emerald-600 mt-0.5">{stats.published}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-amber-50 text-amber-600">
            <FileEdit className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Bản nháp</p>
            <p className="text-2xl font-black text-amber-600 mt-0.5">{stats.draft}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-slate-50 text-slate-600">
            <Archive className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Đã lưu trữ</p>
            <p className="text-2xl font-black text-slate-600 mt-0.5">{stats.archived}</p>
          </div>
        </div>
      </div>

      {/* Bộ Lọc & Tìm Kiếm */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
          {/* Tabs Trạng Thái */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveTab('ALL')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                activeTab === 'ALL'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Tất cả ({stats.total})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('Published')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                activeTab === 'Published'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              Đã xuất bản ({stats.published})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('Draft')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                activeTab === 'Draft'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
            >
              Bản nháp ({stats.draft})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('Archived')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                activeTab === 'Archived'
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Đã lưu trữ ({stats.archived})
            </button>
          </div>

          {/* Ô Tìm Kiếm */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo tên món, danh mục..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
            />
          </div>
        </div>

        {/* Nội Dung Danh Sách / Bảng Dữ Liệu */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-gray-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            <p className="text-xs">Đang tải danh sách bài viết...</p>
          </div>
        ) : isError ? (
          <div className="py-12 text-center text-red-500 text-sm">
            Không thể tải danh sách bài viết lúc này. Vui lòng thử lại.
          </div>
        ) : filteredRecipes.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-orange-50 text-orange-500 flex items-center justify-center">
              <FolderOpen className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-gray-800">Không tìm thấy công thức nào</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              {searchTerm
                ? 'Không có bài viết nào khớp với từ khóa tìm kiếm của bạn.'
                : 'Bạn chưa có bài viết nào trong mục này. Hãy bắt đầu chia sẻ món ngon ngay!'}
            </p>
            {!searchTerm && (
              <Link
                href="/recipes/create"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold hover:bg-orange-700 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Tạo công thức đầu tiên</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="pb-3 px-3">Món ăn</th>
                  <th className="pb-3 px-3">Danh mục</th>
                  <th className="pb-3 px-3">Trạng thái</th>
                  <th className="pb-3 px-3">Thời gian</th>
                  <th className="pb-3 px-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs">
                {filteredRecipes.map((recipe) => (
                  <tr key={recipe.id} className="hover:bg-orange-50/40 transition group">
                    {/* Tên & Thumbnail */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                          {recipe.thumbnailUrl ? (
                            <Image
                              src={recipe.thumbnailUrl}
                              alt={recipe.title}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <ChefHat className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                        <div>
                          <Link
                            href={`/recipes/${recipe.slug}`}
                            className="font-bold text-gray-900 group-hover:text-orange-600 transition line-clamp-1"
                          >
                            {recipe.title}
                          </Link>
                          <span className="text-[11px] text-gray-400 font-mono">/{recipe.slug}</span>
                        </div>
                      </div>
                    </td>

                    {/* Danh mục */}
                    <td className="py-3.5 px-3 text-gray-600">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-[11px] font-medium">
                        {recipe.categoryName || 'Chung'}
                      </span>
                    </td>

                    {/* Trạng thái */}
                    <td className="py-3.5 px-3">
                      {recipe.status === 'Published' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200/60">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Xuất bản</span>
                        </span>
                      )}
                      {recipe.status === 'Draft' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 text-[11px] font-bold border border-amber-200/60">
                          <FileEdit className="w-3 h-3" />
                          <span>Bản nháp</span>
                        </span>
                      )}
                      {recipe.status === 'Archived' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-bold border border-slate-200">
                          <Archive className="w-3 h-3" />
                          <span>Lưu trữ</span>
                        </span>
                      )}
                    </td>

                    {/* Thời gian */}
                    <td className="py-3.5 px-3 text-gray-500 text-[11px]">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span>{recipe.totalTimeMinutes} phút</span>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Users className="w-3.5 h-3.5 text-gray-400" />
                        <span>{recipe.servings} người</span>
                      </div>
                    </td>

                    {/* Thao tác */}
                    <td className="py-3.5 px-3 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {/* Xem */}
                        <Link
                          href={`/recipes/${recipe.slug}`}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"
                          title="Xem bài viết"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        {/* Sửa */}
                        <Link
                          href={`/recipes/${recipe.slug}/edit`}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-orange-600 hover:bg-orange-50 transition"
                          title="Chỉnh sửa công thức"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>

                        {/* Chuyển đổi trạng thái nhanh */}
                        {recipe.status === 'Draft' && (
                          <button
                            type="button"
                            onClick={() => handlePublish(recipe)}
                            disabled={publishMutation.isPending}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition"
                            title="Xuất bản ngay"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}

                        {recipe.status === 'Published' && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleUnpublish(recipe)}
                              disabled={unpublishMutation.isPending}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition"
                              title="Hủy xuất bản (chuyển về Draft)"
                            >
                              <FileEdit className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleArchive(recipe)}
                              disabled={archiveMutation.isPending}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-slate-600 hover:bg-slate-100 transition"
                              title="Lưu trữ bài viết"
                            >
                              <Archive className="w-4 h-4" />
                            </button>
                          </>
                        )}

                        {recipe.status === 'Archived' && (
                          <button
                            type="button"
                            onClick={() => handleUnpublish(recipe)}
                            disabled={unpublishMutation.isPending}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition"
                            title="Mở lại bản nháp"
                          >
                            <FileEdit className="w-4 h-4" />
                          </button>
                        )}

                        {/* Xóa mềm */}
                        <button
                          type="button"
                          onClick={() => {
                            setRecipeToDelete({ id: recipe.id, title: recipe.title });
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Xóa công thức"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Xác Nhận Xóa */}
      <DeleteRecipeModal
        isOpen={isDeleteModalOpen}
        recipe={recipeToDelete}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setRecipeToDelete(null);
        }}
        onConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
}
