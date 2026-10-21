/**
 * Các kiểu dữ liệu cơ sở dùng chung cho ứng dụng Frontend Culinary Blog
 * Tuân thủ tiêu chuẩn RFC 7807 Problem Details và chuẩn phân trang PagedResult
 */

export interface ProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  errors?: Record<string, string[]>;
  extensions?: Record<string, unknown>;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export type PaginatedResult<T> = PagedResult<T>;

export interface ApiResponse<T> {
  data?: T;
  error?: ProblemDetails;
  isSuccess: boolean;
}
