// Bổ sung kiểu cho Google id_token đi qua Auth.js session (FR-AUTH-003).
import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    /** Google id_token thô — chỉ dùng một lần để POST về backend /api/v1/auth/google. */
    idToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    idToken?: string;
  }
}
