using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace CulinaryBlog.Infrastructure.Services;

/// <summary>
/// Dịch vụ xử lý JSON Web Token (JWT) và Refresh Token.
/// Đảm nhận: Sinh Access Token, sinh chuỗi ngẫu nhiên Refresh Token và băm Token an toàn.
/// </summary>
public class JwtService(IConfiguration config) : IJwtService
{
    /// <summary>
    /// CẤP MỚI ACCESS TOKEN (JWT):
    /// - Đóng gói các thông tin định danh (Claims) của người dùng vào token.
    /// - Ký số bảo mật bằng thuật toán HMAC-SHA256 với SecretKey.
    /// - Thời hạn sống ngắn (15 phút) nhằm giảm thiểu rủi ro khi token bị lộ.
    /// </summary>
    /// <param name="user">Thực thể người dùng từ CSDL</param>
    /// <param name="roles">Danh sách vai trò (Admin, Author, Reader...)</param>
    /// <returns>Chuỗi JWT Token hoàn chỉnh dạng Base64URL gồm 3 phần: Header.Payload.Signature</returns>
    public string GenerateAccessToken(ApplicationUser user, IList<string> roles)
    {
        // 1. Khởi tạo danh sách Claims (Payload của JWT)
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id),                    // Subject: Định danh duy nhất của người dùng (UserId)
            new(JwtRegisteredClaimNames.Email, user.Email ?? ""),         // Email người dùng
            new("displayName", user.DisplayName),                         // Tên hiển thị công khai trên giao diện
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())   // JWT ID: Mã định danh ngẫu nhiên cho mỗi token để chống replay
        };

        // Bổ sung các Roles của người dùng vào Claims để Middleware Authorization kiểm tra quyền hạn
        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

        // 2. Tạo khóa ký đối xứng (Symmetric Security Key) từ SecretKey trong cấu hình appsettings.json
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:SecretKey"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        // 3. Khởi tạo đối tượng JWT với đầy đủ thông tin: Người cấp (Issuer), Người nhận (Audience), Thời hạn và Chữ ký
        var token = new JwtSecurityToken(
            issuer: config["Jwt:Issuer"],                                 // Bên phát hành token
            audience: config["Jwt:Audience"],                             // Bên tiếp nhận và sử dụng token
            claims: claims,                                               // Danh sách thông tin payload
            expires: DateTime.UtcNow.AddMinutes(15),                      // Thời gian hết hạn: 15 phút (theo quy chuẩn bảo mật CONS-004)
            signingCredentials: creds);                                   // Chữ ký bảo mật HMAC-SHA256

        // 4. Tuần tự hóa đối tượng JWT thành chuỗi string Base64URL
        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    /// <summary>
    /// CẤP MỚI CHUỖI REFRESH TOKEN:
    /// Sinh chuỗi ngẫu nhiên 64 byte an toàn bảo mật mật mã (Cryptographically Strong Random Number Generator).
    /// Chuỗi này sẽ được gửi về cho Client lưu trong HttpOnly Cookie để dùng xin cấp lại Access Token mới.
    /// </summary>
    public string GenerateRefreshToken()
    {
        var randomBytes = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomBytes);
        return Convert.ToBase64String(randomBytes);
    }

    /// <summary>
    /// BĂM REFRESH TOKEN (SHA-256):
    /// Nguyên tắc bảo mật: KHÔNG BAO GIỜ lưu trực tiếp chuỗi Refresh Token thô vào CSDL.
    /// Chỉ lưu giá trị băm (Hash) để phòng trường hợp CSDL bị tấn công thì kẻ xấu cũng không lấy được token thật để giả mạo.
    /// </summary>
    public string HashToken(string rawToken)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(rawToken));
        return Convert.ToHexString(bytes).ToLower();
    }
}
