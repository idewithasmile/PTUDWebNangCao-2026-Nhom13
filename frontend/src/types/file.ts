/**
 * Kiểu dữ liệu Quản lý tệp tin & tải ảnh (FR-FILE)
 */

export interface FileUploadResponse {
  url: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
}
