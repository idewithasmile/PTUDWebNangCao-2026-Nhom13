'use client';

import { useState, useRef } from 'react';
import type { RecipeDetailDto, RecipeStepDto } from '@/lib/types/recipe';
import {
  useAddRecipeStep,
  useUpdateRecipeStep,
  useDeleteRecipeStep,
} from '@/features/recipes/hooks';
import { fileService } from '@/lib/services/file-service';
import { toErrorMessage } from '@/features/auth/hooks';
import {
  CheckCircle2,
  Plus,
  Clock,
  Image as ImageIcon,
  Edit2,
  Trash2,
  Save,
  X,
  Loader2,
  AlertCircle,
  Upload,
} from 'lucide-react';

interface StudioStepsTabProps {
  recipe: RecipeDetailDto;
  onRefresh: () => void;
}

export default function StudioStepsTab({ recipe, onRefresh }: StudioStepsTabProps) {
  const steps = recipe.steps ?? [];

  // Form Thêm Bước Mới
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newTimer, setNewTimer] = useState<string>('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isUploadingNewImage, setIsUploadingNewImage] = useState(false);
  const newFileInputRef = useRef<HTMLInputElement>(null);

  // Form Chỉnh Sửa Bước
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editTimer, setEditTimer] = useState<string>('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [isUploadingEditImage, setIsUploadingEditImage] = useState(false);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const addMutation = useAddRecipeStep(recipe.id, recipe.slug);
  const updateMutation = useUpdateRecipeStep(recipe.id, recipe.slug);
  const deleteMutation = useDeleteRecipeStep(recipe.id, recipe.slug);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const resetAddForm = () => {
    setNewTitle('');
    setNewDescription('');
    setNewTimer('');
    setNewImageUrl('');
    setIsAdding(false);
  };

  const handleUploadImage = async (
    file: File,
    setImageUrl: (url: string) => void,
    setLoading: (loading: boolean) => void
  ) => {
    if (file.size > 5 * 1024 * 1024) {
      showToast('error', 'Kích thước ảnh vượt quá giới hạn 5MB.');
      return;
    }
    setLoading(true);
    try {
      const res = await fileService.uploadFile(file, 'steps');
      if (res?.url) {
        setImageUrl(res.url);
        showToast('success', 'Đã tải ảnh minh họa bước nấu lên thành công!');
      }
    } catch (err: unknown) {
      showToast('error', toErrorMessage(err, 'Tải ảnh lên thất bại.'));
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDescription.trim()) {
      showToast('error', 'Nội dung hướng dẫn của bước không được để trống.');
      return;
    }

    try {
      await addMutation.mutateAsync({
        title: newTitle.trim() || null,
        description: newDescription.trim(),
        timerMinutes: newTimer ? parseInt(newTimer, 10) : null,
        imageUrl: newImageUrl.trim() || null,
      });

      showToast('success', 'Đã thêm bước thực hiện mới thành công!');
      resetAddForm();
      onRefresh();
    } catch (err: unknown) {
      showToast('error', toErrorMessage(err, 'Thêm bước thực hiện thất bại.'));
    }
  };

  const startEdit = (step: RecipeStepDto) => {
    setEditingId(step.id);
    setEditTitle(step.title || '');
    setEditDescription(step.description);
    setEditTimer(step.timerMinutes !== null && step.timerMinutes !== undefined ? String(step.timerMinutes) : '');
    setEditImageUrl(step.imageUrl || '');
  };

  const handleUpdateSubmit = async (stepId: string) => {
    if (!editDescription.trim()) {
      showToast('error', 'Nội dung hướng dẫn của bước không được để trống.');
      return;
    }

    try {
      await updateMutation.mutateAsync({
        stepId,
        data: {
          title: editTitle.trim() || null,
          description: editDescription.trim(),
          timerMinutes: editTimer ? parseInt(editTimer, 10) : null,
          imageUrl: editImageUrl.trim() || null,
        },
      });

      showToast('success', 'Đã cập nhật bước thực hiện thành công!');
      setEditingId(null);
      onRefresh();
    } catch (err: unknown) {
      showToast('error', toErrorMessage(err, 'Cập nhật bước thất bại.'));
    }
  };

  const handleDelete = async (step: RecipeStepDto) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa Bước ${step.stepNumber}? Hệ thống sẽ tự động đánh số lại các bước tiếp theo.`)) return;

    try {
      await deleteMutation.mutateAsync(step.id);
      showToast('success', `Đã xóa Bước ${step.stepNumber}.`);
      onRefresh();
    } catch (err: unknown) {
      showToast('error', toErrorMessage(err, 'Xóa bước thất bại.'));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`flex items-center gap-2.5 p-4 rounded-2xl text-xs font-bold animate-fade-in ${
            toastMessage.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2 text-gray-900 font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base">Quy trình các bước nấu ăn (FR-RCP-010)</h2>
            <span className="text-xs text-gray-400 font-normal">({steps.length} bước)</span>
          </div>

          {!isAdding && (
            <button
              type="button"
              onClick={() => {
                setNewTitle(`Bước ${steps.length + 1}`);
                setIsAdding(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm bước thực hiện</span>
            </button>
          )}
        </div>

        {/* Khung Thêm Bước Mới */}
        {isAdding && (
          <form
            onSubmit={handleAddSubmit}
            className="p-5 rounded-3xl bg-emerald-50/50 border border-emerald-200/80 space-y-4 animate-fade-in"
          >
            <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
              <span>Thêm bước thực hiện tiếp theo (Bước {steps.length + 1})</span>
              <button
                type="button"
                onClick={resetAddForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-gray-600 mb-1">
                  Tiêu đề bước (tùy chọn):
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="VD: Sơ chế thịt bò và ướp gia vị"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">
                  Đồng hồ hẹn giờ (phút):
                </label>
                <div className="relative">
                  <Clock className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    min={1}
                    value={newTimer}
                    onChange={(e) => setNewTimer(e.target.value)}
                    placeholder="VD: 15"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1">
                Hướng dẫn chi tiết bước nấu <span className="text-red-500">*</span>:
              </label>
              <textarea
                rows={3}
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Mô tả cụ thể nhiệt độ, thời gian đảo, dấu hiệu nhận biết khi thực phẩm đạt yêu cầu (tối đa 2000 ký tự)..."
                required
                maxLength={2000}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
              />
            </div>

            {/* Ảnh minh họa của bước */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-gray-600">
                Ảnh minh họa cho bước này (tùy chọn):
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Dán link ảnh hoặc tải ảnh lên từ máy..."
                  className="flex-1 w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />

                <input
                  ref={newFileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleUploadImage(f, setNewImageUrl, setIsUploadingNewImage);
                  }}
                />

                <button
                  type="button"
                  onClick={() => newFileInputRef.current?.click()}
                  disabled={isUploadingNewImage}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition shrink-0"
                >
                  {isUploadingNewImage ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5 text-gray-500" />
                  )}
                  <span>Chọn ảnh tải lên</span>
                </button>
              </div>

              {newImageUrl && (
                <div className="w-24 h-24 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 relative mt-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={newImageUrl} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setNewImageUrl('')}
                    className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white hover:bg-black"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-emerald-100">
              <button
                type="button"
                onClick={resetAddForm}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={addMutation.isPending}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition disabled:opacity-50"
              >
                {addMutation.isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>Lưu bước thực hiện</span>
              </button>
            </div>
          </form>
        )}

        {/* Danh sách Timeline các bước */}
        {steps.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 mx-auto text-gray-300" />
            <p className="text-xs font-bold text-gray-600">Chưa có bước thực hiện nào</p>
            <p className="text-[11px] text-gray-400 max-w-sm mx-auto">
              Nhấn &quot;Thêm bước thực hiện&quot; để hướng dẫn người đọc cách chế biến từng công đoạn chuẩn mực.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {steps.map((step) => {
              const isEditingThis = editingId === step.id;

              if (isEditingThis) {
                return (
                  <div
                    key={step.id}
                    className="p-5 rounded-3xl bg-emerald-50/40 border border-emerald-200 space-y-3 animate-fade-in"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                      <span>Chỉnh sửa Bước {step.stepNumber}</span>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          placeholder="Tiêu đề bước..."
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                        />
                      </div>

                      <div className="relative">
                        <Clock className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="number"
                          min={1}
                          value={editTimer}
                          onChange={(e) => setEditTimer(e.target.value)}
                          placeholder="Thời gian (phút)"
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                        />
                      </div>
                    </div>

                    <textarea
                      rows={3}
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Nội dung bước..."
                      required
                      maxLength={2000}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                    />

                    {/* Ảnh minh họa của bước */}
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <input
                        type="text"
                        value={editImageUrl}
                        onChange={(e) => setEditImageUrl(e.target.value)}
                        placeholder="Link ảnh minh họa..."
                        className="flex-1 w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />

                      <input
                        ref={editFileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleUploadImage(f, setEditImageUrl, setIsUploadingEditImage);
                        }}
                      />

                      <button
                        type="button"
                        onClick={() => editFileInputRef.current?.click()}
                        disabled={isUploadingEditImage}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition shrink-0"
                      >
                        {isUploadingEditImage ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Upload className="w-3.5 h-3.5 text-gray-500" />
                        )}
                        <span>Đổi ảnh</span>
                      </button>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-emerald-100">
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                      >
                        Hủy
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateSubmit(step.id)}
                        disabled={updateMutation.isPending}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 disabled:opacity-50"
                      >
                        {updateMutation.isPending ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Save className="w-3.5 h-3.5" />
                        )}
                        <span>Lưu thay đổi</span>
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={step.id}
                  className="p-5 rounded-3xl border border-gray-100 bg-white hover:border-gray-200 transition shadow-2xs flex flex-col md:flex-row items-start gap-4 group"
                >
                  {/* Step Number Circle */}
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 font-black text-sm flex items-center justify-center shrink-0 border border-emerald-100">
                    {step.stepNumber}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xs font-bold text-gray-900">
                        {step.title || `Bước ${step.stepNumber}`}
                      </h3>

                      {step.timerMinutes && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50 text-amber-700 text-[11px] font-bold border border-amber-200">
                          <Clock className="w-3 h-3" />
                          <span>{step.timerMinutes} phút</span>
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                      {step.description}
                    </p>

                    {/* Step Image if available */}
                    {step.imageUrl && (
                      <div className="w-36 h-28 rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 mt-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={step.imageUrl}
                          alt={step.title || `Bước ${step.stepNumber}`}
                          className="w-full h-full object-cover hover:scale-105 transition"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 self-end md:self-start shrink-0">
                    <button
                      type="button"
                      onClick={() => startEdit(step)}
                      className="p-2 rounded-xl text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition"
                      title="Sửa bước này"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(step)}
                      disabled={deleteMutation.isPending}
                      className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                      title="Xóa bước này (Tự động đánh số lại)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
