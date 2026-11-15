namespace CulinaryBlog.Application.Common.Interfaces;

/// <summary>
/// Cung cấp Base URL của Frontend (Next.js) để tạo liên kết khôi phục mật khẩu, hủy đăng ký bản tin và chi tiết công thức trong Email.
/// </summary>
public interface IAppUrlService
{
    string GetFrontendBaseUrl();
}
