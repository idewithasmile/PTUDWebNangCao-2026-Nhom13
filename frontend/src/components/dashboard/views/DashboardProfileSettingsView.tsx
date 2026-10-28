'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  toErrorMessage,
  useLogout,
  useMe,
  useUpdateProfile,
} from '@/features/auth/hooks';
import { updateProfileSchema, type UpdateProfileForm } from '@/features/auth/schemas';
import { hasSession } from '@/features/auth/api';
import { useRouter } from 'next/navigation';
import type { UserProfile } from '@/types/auth';
import {
  User,
  Mail,
  AtSign,
  Image as ImageIcon,
  FileText,
  Save,
  CheckCircle2,
  AlertCircle,
  Shield,
  LogOut,
  Calendar,
  Lock,
  Loader2,
} from 'lucide-react';

interface DashboardProfileSettingsViewProps {
  currentUser: UserProfile;
}

export default function DashboardProfileSettingsView({
  currentUser,
}: DashboardProfileSettingsViewProps) {
  const router = useRouter();
  const logout = useLogout();
  const update = useUpdateProfile();
  const [serverError, setServerError] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Chỉ fetch dữ liệu mới khi đã có token
  const [canFetch, setCanFetch] = useState(false);
  useEffect(() => {
    setCanFetch(hasSession());
  }, []);
  const me = useMe(canFetch);
  const user = me.data || currentUser;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setError,
    formState: { errors },
  } = useForm<UpdateProfileForm>({
    defaultValues: {
      displayName: user.displayName || '',
      avatarUrl: user.avatarUrl || '',
      bio: user.bio || '',
    },
  });

  const watchedAvatarUrl = watch('avatarUrl');

  useEffect(() => {
    if (me.data) {
      reset({
        displayName: me.data.displayName || '',
        avatarUrl: me.data.avatarUrl ?? '',
        bio: me.data.bio ?? '',
      });
    }
  }, [me.data, reset]);

  const onSubmit = (values: UpdateProfileForm) => {
    setServerError(null);
    setSavedSuccess(false);

    const parsed = updateProfileSchema.safeParse(values);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof UpdateProfileForm | undefined;
        if (field) setError(field, { message: issue.message });
      }
      return;
    }

    update.mutate(parsed.data, {
      onSuccess: () => {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 4000);
      },
      onError: (e) => setServerError(toErrorMessage(e, 'Cập nhật hồ sơ thất bại.')),
    });
  };

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => router.push('/login'),
      onError: () => router.push('/login'),
    });
  };

  const isAdmin = user.roles?.includes('Admin');

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      {/* 1. Header Bar */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
            <User className="w-5 h-5 text-blue-600" />
            <span>Hồ sơ & Cài đặt tài khoản</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Quản lý thông tin định danh tác giả, tiểu sử, ảnh đại diện và tùy chọn cá nhân
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          disabled={logout.isPending}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-red-200 text-red-600 bg-red-50/50 hover:bg-red-100 text-xs font-bold transition disabled:opacity-50 shrink-0"
        >
          <LogOut className="w-4 h-4" />
          <span>{logout.isPending ? 'Đang đăng xuất...' : 'Đăng xuất tài khoản'}</span>
        </button>
      </div>

      {/* Thông báo Thành công / Thất bại */}
      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 text-xs font-semibold animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Hồ sơ cá nhân đã được lưu thành công trên toàn hệ thống!</span>
        </div>
      )}

      {serverError && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 flex items-center gap-3 text-xs font-semibold animate-fade-in">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      {/* 2. Nội dung chính: 2 Cột */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cột trái: Thẻ Tổng quan User */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-2xs text-center space-y-4">
            <div className="relative mx-auto w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-md">
              {watchedAvatarUrl || user.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={watchedAvatarUrl || user.avatarUrl || ''}
                  alt={user.displayName || 'Avatar'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white font-extrabold text-2xl">
                  {(user.displayName || user.userName || 'U')[0].toUpperCase()}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-base font-bold text-gray-900">{user.displayName || user.userName}</h3>
              <p className="text-xs text-gray-400 mt-0.5">@{user.userName}</p>
              <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                <Shield className="w-3.5 h-3.5" />
                <span>{isAdmin ? 'Quản Trị Viên (Admin)' : 'Tác Giả Ẩm Thực (Author)'}</span>
              </div>
            </div>

            <p className="text-xs text-gray-500 italic bg-gray-50/80 p-3 rounded-2xl border border-gray-100/80 line-clamp-3">
              &quot;{user.bio || 'Chưa có tiểu sử giới thiệu. Hãy thêm tiểu sử để độc giả biết thêm về phong cách ẩm thực của bạn.'}&quot;
            </p>

            <div className="pt-3 border-t border-gray-100 text-left space-y-2 text-xs text-gray-500">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Trạng thái:</span>
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Đang hoạt động
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Quyền hạn:</span>
                <span className="font-semibold text-gray-700">
                  {isAdmin ? 'Toàn quyền quản trị' : 'Đăng & Quản lý bài'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Cột phải: 2 Phần rõ ràng theo yêu cầu SRS (1. Hồ sơ tác giả, 2. Tài khoản & Xác thực Google) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Hồ sơ tác giả (GET/PATCH /api/v1/auth/me - FR-AUTH-006, FR-AUTH-007) */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-2xs space-y-5"
            noValidate
          >
            <div className="pb-3 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  <span>Hồ sơ tác giả</span>
                </h3>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Chỉnh sửa tên hiển thị công khai, ảnh đại diện và tiểu sử ẩm thực (FR-AUTH-006, FR-AUTH-007)
                </p>
              </div>
            </div>

            {/* Tên hiển thị */}
            <div>
              <label htmlFor="displayName" className="block text-xs font-bold text-gray-700 mb-1.5">
                Tên hiển thị công khai (DisplayName) <span className="text-rose-500">*</span>
              </label>
              <input
                id="displayName"
                type="text"
                placeholder="Ví dụ: Chef Gordon Ramsay"
                className={`w-full px-4 py-2.5 rounded-2xl border text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition ${
                  errors.displayName ? 'border-red-400 bg-red-50/20' : 'border-gray-200 bg-white'
                }`}
                {...register('displayName')}
              />
              {errors.displayName && (
                <p className="text-[11px] text-red-600 mt-1">{errors.displayName.message}</p>
              )}
            </div>

            {/* Avatar URL */}
            <div>
              <label htmlFor="avatarUrl" className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-gray-400" />
                <span>Đường dẫn ảnh đại diện (Avatar URL)</span>
              </label>
              <input
                id="avatarUrl"
                type="url"
                placeholder="https://images.unsplash.com/... hoặc link ảnh MinIO"
                className={`w-full px-4 py-2.5 rounded-2xl border text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition ${
                  errors.avatarUrl ? 'border-red-400 bg-red-50/20' : 'border-gray-200 bg-white'
                }`}
                {...register('avatarUrl')}
              />
              {errors.avatarUrl && (
                <p className="text-[11px] text-red-600 mt-1">{errors.avatarUrl.message}</p>
              )}
            </div>

            {/* Tiểu sử (Bio) */}
            <div>
              <label htmlFor="bio" className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-gray-400" />
                <span>Tiểu sử tác giả (Bio)</span>
              </label>
              <textarea
                id="bio"
                rows={4}
                placeholder="Chia sẻ đôi nét về bạn, sở thích nấu ăn và kinh nghiệm làm bếp..."
                className={`w-full px-4 py-3 rounded-2xl border text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition resize-none ${
                  errors.bio ? 'border-red-400 bg-red-50/20' : 'border-gray-200 bg-white'
                }`}
                {...register('bio')}
              />
              {errors.bio && <p className="text-[11px] text-red-600 mt-1">{errors.bio.message}</p>}
            </div>

            {/* Nút Submit */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                type="submit"
                disabled={update.isPending}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition disabled:opacity-50"
              >
                {update.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang lưu thay đổi...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Lưu thông tin tác giả</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Card 2: Tài khoản & Liên kết Google (FR-AUTH-003, Policy VerifiedAuthor) */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-2xs space-y-4">
            <div className="pb-3 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>Tài khoản & Xác thực (FR-AUTH-003)</span>
              </h3>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Thông tin định danh hệ thống, trạng thái xác thực tác giả và liên kết tài khoản
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-500">Địa chỉ Email</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    VerifiedAuthor
                  </span>
                </div>
                <p className="text-xs font-semibold text-gray-900">{user.email}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                <span className="text-[11px] font-bold text-gray-500">Tên đăng nhập hệ thống</span>
                <p className="text-xs font-semibold text-gray-900">@{user.userName}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                <span className="text-[11px] font-bold text-gray-500">Liên kết Google OAuth (FR-AUTH-003)</span>
                <p className="text-xs font-semibold text-gray-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  Sẵn sàng xác thực (PKCE Flow)
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                <span className="text-[11px] font-bold text-gray-500">Vai trò phân quyền (Role)</span>
                <p className="text-xs font-semibold text-blue-700">
                  {isAdmin ? 'Quản Trị Viên (Admin)' : 'Tác Giả Ẩm Thực (Author)'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
