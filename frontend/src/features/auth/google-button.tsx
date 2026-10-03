'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';

// Nút "Tiếp tục với Google" (FR-AUTH-003).
// Dùng Auth.js v5 (Authorization Code Flow + PKCE): redirect sang Google,
// quay về /auth/callback để đổi idToken lấy token backend (POST /api/v1/auth/google).
// Cần env server-side AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET (xem .env.example).
// Lỗi cấu hình provider sẽ hiện ở Auth.js error page — KHÔNG fail ngầm ở backend.
export default function GoogleButton() {
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onClick = async () => {
    setError(null);
    setStarting(true);
    try {
      // Redirect flow (OAuth bắt buộc redirect): không return về đây khi thành công.
      await signIn('google', { callbackUrl: '/auth/callback' });
    } catch {
      setError('Không khởi tạo được đăng nhập Google. Kiểm tra cấu hình AUTH_GOOGLE_ID.');
    } finally {
      setStarting(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={onClick}
        disabled={starting}
        className="w-full rounded border p-2 disabled:opacity-50"
      >
        {starting ? 'Đang chuyển sang Google…' : 'Tiếp tục với Google'}
      </button>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
