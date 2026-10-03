import { z } from 'zod';

// Mirror backend FluentValidation (FR-AUTH-001/007) để báo lỗi sớm phía client.
// Backend vẫn là nguồn sự thật (ValidationBehavior).
export const passwordSchema = z
  .string()
  .min(8, 'Mật khẩu tối thiểu 8 ký tự.')
  .regex(/[A-Z]/, 'Mật khẩu cần ít nhất 1 chữ hoa.')
  .regex(/[a-z]/, 'Mật khẩu cần ít nhất 1 chữ thường.')
  .regex(/[0-9]/, 'Mật khẩu cần ít nhất 1 chữ số.')
  .regex(/[^a-zA-Z0-9]/, 'Mật khẩu cần ít nhất 1 ký tự đặc biệt.');

export const userNameSchema = z
  .string()
  .min(3, 'Tên đăng nhập tối thiểu 3 ký tự.')
  .max(256)
  .regex(
    /^[a-zA-Z0-9_.-]+$/,
    'Tên đăng nhập không được chứa ký tự đặc biệt (chỉ chữ, số, _, ., -).',
  );

export const displayNameSchema = z
  .string()
  .min(2, 'Tên hiển thị tối thiểu 2 ký tự.')
  .max(100, 'Tên hiển thị tối đa 100 ký tự.');

export const registerSchema = z.object({
  email: z.string().min(1, 'Email bắt buộc.').email('Email không hợp lệ.'),
  userName: userNameSchema,
  displayName: displayNameSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: z.string().min(1, 'Email bắt buộc.').email('Email không hợp lệ.'),
  password: z.string().min(1, 'Mật khẩu bắt buộc.'),
});

export const updateProfileSchema = z.object({
  displayName: displayNameSchema.optional(),
  avatarUrl: z.string().url('Avatar phải là URL http(s) hợp lệ.').max(500).optional().or(z.literal('')),
  bio: z.string().max(2000, 'Bio tối đa 2000 ký tự.').optional(),
});

export type RegisterForm = z.infer<typeof registerSchema>;
export type LoginForm = z.infer<typeof loginSchema>;
export type UpdateProfileForm = z.infer<typeof updateProfileSchema>;
