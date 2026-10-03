import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

// FR-AUTH-003: Auth.js v5 dùng Authorization Code Flow + PKCE để đăng nhập Google.
// Auth.js CHỈ làm OAuth client: Google id_token lấy được sẽ được POST về
// POST /api/v1/auth/google để backend .NET cấp access/refresh token của hệ thống
// (refresh qua HttpOnly Cookie). Backend là nguồn sự thật duy nhất cho session.
// Env bắt buộc: AUTH_SECRET, AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET (xem .env.example).
//
// Fix redirect_uri_mismatch (local): Auth.js tự sinh redirect_uri từ host của
// request → Google Console PHẢI allowlist chính xác
// `http://localhost:3000/api/auth/callback/google` (không trailing slash, http).
// LƯU Ý: đây là route handler của Auth.js (/api/auth/...), KHÁC với landing page
// của app (/auth/callback — chỉ là callbackUrl sau OAuth, không đăng ký vào Google).
// Luôn mở app bằng `http://localhost:3000` (không dùng 127.0.0.1) để khớp URI.
export const { handlers, signIn, signOut, auth } = NextAuth({
  // Bắt buộc khai báo secret tường minh: ưu tiên biến môi trường, fallback chuỗi dự phòng để không crash
  secret: process.env.AUTH_SECRET || 'culinary_blog_dev_secret_key_change_me_later_123456',

  // Local dev / proxy: tin host của request
  trustHost: true,

  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID || '',
      clientSecret: process.env.AUTH_GOOGLE_SECRET || '',
    }),
  ],

  callbacks: {
    async jwt({ token, account }) {
      // Giữ Google id_token trong JWT mã hóa của Auth.js để callback page
      // đổi lấy token backend. Không expose secret nào khác.
      if (account?.id_token) {
        token.idToken = account.id_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (typeof token.idToken === 'string') {
        session.idToken = token.idToken;
      }
      return session;
    },
  },
});