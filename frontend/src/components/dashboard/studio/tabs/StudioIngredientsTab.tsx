'use client';

import { useState } from 'react';
import type { RecipeDetailDto, RecipeIngredientDto } from '@/lib/types/recipe';
import {
  useAddRecipeIngredient,
  useUpdateRecipeIngredient,
  useDeleteRecipeIngredient,
} from '@/features/recipes/hooks';
import { toErrorMessage } from '@/features/auth/hooks';
import {
  Utensils,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowUpDown,
} from 'lucide-react';

interface StudioIngredientsTabProps {
  recipe: RecipeDetailDto;
  onRefresh: () => void;
}

export default function StudioIngredientsTab({ recipe, onRefresh }: StudioIngredientsTabProps) {
  const ingredients = recipe.ingredients ?? [];

  // Form thêm mới
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newQuantity, setNewQuantity] = useState<string>('');
  const [newUnit, setNewUnit] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newSortOrder, setNewSortOrder] = useState<string>('0');

  // Đang chỉnh sửa dòng nào
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editQuantity, setEditQuantity] = useState<string>('');
  const [editUnit, setEditUnit] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editSortOrder, setEditSortOrder] = useState<string>('0');

  // Toast
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const addMutation = useAddRecipeIngredient(recipe.id, recipe.slug);
  const updateMutation = useUpdateRecipeIngredient(recipe.id, recipe.slug);
  const deleteMutation = useDeleteRecipeIngredient(recipe.id, recipe.slug);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const resetAddForm = () => {
    setNewName('');
    setNewQuantity('');
    setNewUnit('');
    setNewNotes('');
    setNewSortOrder('0');
    setIsAdding(false);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      showToast('error', 'Tên nguyên liệu không được để trống.');
      return;
    }

    try {
      await addMutation.mutateAsync({
        name: newName.trim(),
        quantity: newQuantity ? parseFloat(newQuantity) : null,
        unit: newUnit.trim() || null,
        notes: newNotes.trim() || null,
        sortOrder: newSortOrder ? parseInt(newSortOrder, 10) : 0,
      });

      showToast('success', `Đã thêm nguyên liệu "${newName}" thành công!`);
      resetAddForm();
      onRefresh();
    } catch (err: unknown) {
      showToast('error', toErrorMessage(err, 'Thêm nguyên liệu thất bại.'));
    }
  };

  const startEdit = (item: RecipeIngredientDto) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditQuantity(item.quantity !== null && item.quantity !== undefined ? String(item.quantity) : '');
    setEditUnit(item.unit || '');
    setEditNotes(item.notes || '');
    setEditSortOrder(String(item.orderIndex ?? 0));
  };

  const handleUpdateSubmit = async (ingredientId: string) => {
    if (!editName.trim()) {
      showToast('error', 'Tên nguyên liệu không được để trống.');
      return;
    }

    try {
      await updateMutation.mutateAsync({
        ingredientId,
        data: {
          name: editName.trim(),
          quantity: editQuantity ? parseFloat(editQuantity) : null,
          unit: editUnit.trim() || null,
          notes: editNotes.trim() || null,
          sortOrder: editSortOrder ? parseInt(editSortOrder, 10) : 0,
        },
      });

      showToast('success', 'Đã cập nhật nguyên liệu thành công!');
      setEditingId(null);
      onRefresh();
    } catch (err: unknown) {
      showToast('error', toErrorMessage(err, 'Cập nhật nguyên liệu thất bại.'));
    }
  };

  const handleDelete = async (item: RecipeIngredientDto) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa nguyên liệu "${item.name}"?`)) return;

    try {
      await deleteMutation.mutateAsync(item.id);
      showToast('success', `Đã xóa nguyên liệu "${item.name}".`);
      onRefresh();
    } catch (err: unknown) {
      showToast('error', toErrorMessage(err, 'Xóa nguyên liệu thất bại.'));
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
            <Utensils className="w-5 h-5 text-orange-500" />
            <h2 className="text-base">Quản lý Nguyên liệu chuẩn bị (FR-RCP-009)</h2>
            <span className="text-xs text-gray-400 font-normal">({ingredients.length} nguyên liệu)</span>
          </div>

          {!isAdding && (
            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-xs transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm nguyên liệu mới</span>
            </button>
          )}
        </div>

        {/* Khung Thêm Nguyên Liệu Mới */}
        {isAdding && (
          <form
            onSubmit={handleAddSubmit}
            className="p-4 rounded-2xl bg-orange-50/50 border border-orange-200/80 space-y-3 animate-fade-in"
          >
            <div className="flex items-center justify-between text-xs font-bold text-orange-900">
              <span>Điền thông tin nguyên liệu mới</span>
              <button
                type="button"
                onClick={resetAddForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-4">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Tên nguyên liệu (VD: Thịt thăn bò) *"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              <div className="sm:col-span-2">
                <input
                  type="number"
                  step="any"
                  min={0.01}
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(e.target.value)}
                  placeholder="Số lượng (VD: 500)"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              <div className="sm:col-span-2">
                <input
                  type="text"
                  value={newUnit}
                  onChange={(e) => setNewUnit(e.target.value)}
                  placeholder="Đơn vị (g, ml, muỗng...)"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              <div className="sm:col-span-3">
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Ghi chú (VD: thái lát mỏng)"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              <div className="sm:col-span-1">
                <input
                  type="number"
                  value={newSortOrder}
                  onChange={(e) => setNewSortOrder(e.target.value)}
                  placeholder="Thứ tự"
                  title="Thứ tự hiển thị"
                  className="w-full px-2 py-2 rounded-xl border border-gray-200 text-xs text-center bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={resetAddForm}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={addMutation.isPending}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-orange-600 text-white font-bold text-xs hover:bg-orange-700 transition disabled:opacity-50"
              >
                {addMutation.isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>Lưu nguyên liệu</span>
              </button>
            </div>
          </form>
        )}

        {/* Bảng Danh Sách Nguyên Liệu */}
        {ingredients.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <Utensils className="w-10 h-10 mx-auto text-gray-300" />
            <p className="text-xs font-bold text-gray-600">Chưa có nguyên liệu nào</p>
            <p className="text-[11px] text-gray-400">
              Nhấn &quot;Thêm nguyên liệu mới&quot; ở trên để bắt đầu thêm gia vị, thực phẩm cho món ăn.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-gray-100 rounded-2xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100 text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4 w-14 text-center">Thứ tự</th>
                  <th className="py-3 px-4 min-w-[160px]">Tên nguyên liệu</th>
                  <th className="py-3 px-4 w-28">Số lượng</th>
                  <th className="py-3 px-4 w-28">Đơn vị</th>
                  <th className="py-3 px-4 min-w-[160px]">Ghi chú</th>
                  <th className="py-3 px-4 text-right w-24">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ingredients.map((item) => {
                  const isEditingThis = editingId === item.id;

                  if (isEditingThis) {
                    return (
                      <tr key={item.id} className="bg-orange-50/40">
                        <td className="py-2.5 px-3">
                          <input
                            type="number"
                            value={editSortOrder}
                            onChange={(e) => setEditSortOrder(e.target.value)}
                            className="w-12 px-1 py-1 rounded border border-gray-300 text-center text-xs"
                          />
                        </td>
                        <td className="py-2.5 px-3">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full px-2 py-1 rounded border border-gray-300 text-xs"
                            required
                          />
                        </td>
                        <td className="py-2.5 px-3">
                          <input
                            type="number"
                            step="any"
                            value={editQuantity}
                            onChange={(e) => setEditQuantity(e.target.value)}
                            className="w-full px-2 py-1 rounded border border-gray-300 text-xs"
                          />
                        </td>
                        <td className="py-2.5 px-3">
                          <input
                            type="text"
                            value={editUnit}
                            onChange={(e) => setEditUnit(e.target.value)}
                            className="w-full px-2 py-1 rounded border border-gray-300 text-xs"
                          />
                        </td>
                        <td className="py-2.5 px-3">
                          <input
                            type="text"
                            value={editNotes}
                            onChange={(e) => setEditNotes(e.target.value)}
                            className="w-full px-2 py-1 rounded border border-gray-300 text-xs"
                          />
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleUpdateSubmit(item.id)}
                              disabled={updateMutation.isPending}
                              className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
                              title="Lưu thay đổi"
                            >
                              <Save className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="p-1.5 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                              title="Hủy sửa"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={item.id} className="hover:bg-gray-50/60 transition group">
                      <td className="py-3 px-4 text-center font-mono text-gray-400 text-[11px]">
                        {item.orderIndex ?? '-'}
                      </td>
                      <td className="py-3 px-4 font-bold text-gray-900">
                        {item.name}
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-700">
                        {item.quantity !== null && item.quantity !== undefined ? item.quantity : '-'}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {item.unit || '-'}
                      </td>
                      <td className="py-3 px-4 text-gray-500 italic">
                        {item.notes || '-'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 opacity-90 group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={() => startEdit(item)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition"
                            title="Chỉnh sửa nguyên liệu này"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item)}
                            disabled={deleteMutation.isPending}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                            title="Xóa nguyên liệu"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
