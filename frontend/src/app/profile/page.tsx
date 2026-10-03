'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  toErrorMessage,
  useLogout,
  useMe,
  useUpdateProfile,
} from '@/features/auth/hooks';
import { updateProfileSchema, type UpdateProfileForm } from '@/features/auth/schemas';
import { hasSession } from '@/features/auth/api';

// FR-AUTH-006 (GET /auth/me) + FR-AUTH-007 (PATCH /auth/me).
// email/userName là input DISABLED read-only — backend cấm đổi 2 field này,
// payload PATCH chỉ gồm { displayName, bio, avatarUrl }.
export default function ProfilePage() {
  const router = useRouter();
  const logout = useLogout();
  const update = useUpdateProfile();
  const [serverError, setServerError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  // Chỉ fetch khi đã có access token in-memory (tránh 401 thừa sau reload).
  const [canFetch, setCanFetch] = useState(false);
  useEffect(() => {
    setCanFetch(hasSession());
  }, []);
  const me = useMe(canFetch);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<UpdateProfileForm>();

  useEffect(() => {
    if (me.data) {
      reset({
        displayName: me.data.displayName,
        avatarUrl: me.data.avatarUrl ?? '',
        bio: me.data.bio ?? '',
      });
    }
  }, [me.data, reset]);

  const onSubmit = (values: UpdateProfileForm) => {
    setServerError(null);
    setSaved(false);
    // Validate client bằng Zod (mirror backend FluentValidation), map lỗi
    // vào từng field thay vì nuốt im như trước.
    const parsed = updateProfileSchema.safeParse(values);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof UpdateProfileForm | undefined;
        if (field) setError(field, { message: issue.message });
      }
      return;
    }
    update.mutate(parsed.data, {
      onSuccess: () => setSaved(true),
      onError: (e) => setServerError(toErrorMessage(e, 'Cập nhật thất bại.')),
    });
  };

  const onLogout = () => {
    // FR-AUTH-005: dù API lỗi vẫn về /login (đừng kẹt lại trang profile).
    logout.mutate(undefined, {
      onSuccess: () => router.push('/login'),
      onError: () => router.push('/login'),
    });
  };

  if (!canFetch) {
    return (
      <main className="mx-auto max-w-md py-8">
        <h1 className="text-2xl font-bold">Hồ sơ</h1>
        <p className="mt-4 text-sm">Bạn chưa đăng nhập.</p>
        <button
          type="button"
          onClick={() => router.push('/login')}
          className="mt-4 w-full rounded bg-black p-2 text-white"
        >
          Đến trang đăng nhập
        </button>
      </main>
    );
  }

  if (me.isPending) return <main className="mx-auto max-w-md py-8"><p>Đang tải hồ sơ…</p></main>;
  if (me.isError || !me.data) {
    return (
      <main className="mx-auto max-w-md py-8">
        <h1 className="text-2xl font-bold">Hồ sơ</h1>
        <p role="alert" className="mt-4 text-sm text-red-600">
          {toErrorMessage(me.error, 'Không tải được hồ sơ. Vui lòng đăng nhập lại.')}
        </p>
        <button
          type="button"
          onClick={() => router.push('/login')}
          className="mt-4 w-full rounded bg-black p-2 text-white"
        >
          Đến trang đăng nhập
        </button>
      </main>
    );
  }

  const user = me.data;

  return (
    <main className="mx-auto max-w-md py-8">
      <h1 className="text-2xl font-bold">Hồ sơ cá nhân</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4" noValidate>
        <div>
          <label htmlFor="email" className="block text-sm font-medium">Email (không thể thay đổi)</label>
          <input
            id="email"
            type="email"
            value={user.email}
            disabled
            readOnly
            aria-disabled="true"
            title="Email không thể thay đổi"
            className="mt-1 w-full cursor-not-allowed rounded border bg-gray-100 p-2 text-gray-600"
          />
        </div>
        <div>
          <label htmlFor="userName" className="block text-sm font-medium">Tên đăng nhập (không thể thay đổi)</label>
          <input
            id="userName"
            type="text"
            value={user.userName}
            disabled
            readOnly
            aria-disabled="true"
            title="Tên đăng nhập không thể thay đổi"
            className="mt-1 w-full cursor-not-allowed rounded border bg-gray-100 p-2 text-gray-600"
          />
        </div>
        <div>
          <label htmlFor="displayName" className="block text-sm font-medium">Tên hiển thị</label>
          <input
            id="displayName"
            type="text"
            autoComplete="nickname"
            className="mt-1 w-full rounded border p-2"
            {...register('displayName')}
          />
          {errors.displayName && <p className="text-sm text-red-600">{errors.displayName.message}</p>}
        </div>
        <div>
          <label htmlFor="avatarUrl" className="block text-sm font-medium">Avatar URL</label>
          <input
            id="avatarUrl"
            type="url"
            className="mt-1 w-full rounded border p-2"
            placeholder="https://…"
            {...register('avatarUrl')}
          />
          {errors.avatarUrl && <p className="text-sm text-red-600">{errors.avatarUrl.message}</p>}
        </div>
        <div>
          <label htmlFor="bio" className="block text-sm font-medium">Tiểu sử</label>
          <textarea
            id="bio"
            rows={4}
            className="mt-1 w-full rounded border p-2"
            {...register('bio')}
          />
          {errors.bio && <p className="text-sm text-red-600">{errors.bio.message}</p>}
        </div>
        {serverError && <p role="alert" className="text-sm text-red-600">{serverError}</p>}
        {saved && <p role="status" className="text-sm text-green-600">Đã lưu thay đổi.</p>}
        <button
          type="submit"
          disabled={update.isPending}
          className="w-full rounded bg-black p-2 text-white disabled:opacity-50"
        >
          {update.isPending ? 'Đang lưu…' : 'Lưu thay đổi'}
        </button>
      </form>

      <button
        type="button"
        onClick={onLogout}
        disabled={logout.isPending}
        className="mt-4 w-full rounded border p-2 disabled:opacity-50"
      >
        {logout.isPending ? 'Đang đăng xuất…' : 'Đăng xuất'}
      </button>
    </main>
  );
}
