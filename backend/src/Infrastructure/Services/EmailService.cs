using System.Net;
using CulinaryBlog.Application.Common.Interfaces;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MimeKit;

namespace CulinaryBlog.Infrastructure.Services;

/// <summary>
/// Dịch vụ gửi Email qua giao thức SMTP sử dụng MailKit (FR-JOB-001).
/// Kết nối MailHog tại cổng 1025 ở môi trường Dev / Docker.
/// </summary>
public class EmailService : IEmailService
{
    private readonly IConfiguration _config;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration config, ILogger<EmailService> logger)
    {
        _config = config;
        _logger = logger;
    }

    public async Task SendEmailAsync(string toEmail, string subject, string htmlBody, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(toEmail))
            throw new ArgumentException("Email người nhận không được để trống.", nameof(toEmail));

        var host = _config["Smtp:Host"] ?? "localhost";
        var port = int.TryParse(_config["Smtp:Port"], out var p) ? p : 1025;
        var senderEmail = _config["Smtp:SenderEmail"] ?? "no-reply@culinaryblog.com";
        var senderName = _config["Smtp:SenderName"] ?? "Culinary Blog";
        var username = _config["Smtp:Username"];
        var password = _config["Smtp:Password"];

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(senderName, senderEmail));
        message.To.Add(new MailboxAddress(toEmail, toEmail));
        message.Subject = subject;

        var bodyBuilder = new BodyBuilder
        {
            HtmlBody = htmlBody
        };
        message.Body = bodyBuilder.ToMessageBody();

        using var client = new SmtpClient();
        try
        {
            // MailHog chạy port 1025 không cần SSL
            var secureOption = port == 1025 ? SecureSocketOptions.None : SecureSocketOptions.Auto;
            await client.ConnectAsync(host, port, secureOption, ct);

            if (!string.IsNullOrWhiteSpace(username) && !string.IsNullOrWhiteSpace(password))
            {
                await client.AuthenticateAsync(username, password, ct);
            }

            await client.SendAsync(message, ct);
            await client.DisconnectAsync(true, ct);

            _logger.LogInformation("Đã gửi email thành công tới {Email} với tiêu đề '{Subject}'", toEmail, subject);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi gửi email qua SMTP tới {Email}: {Message}", toEmail, ex.Message);
            throw;
        }
    }

    public async Task SendWelcomeEmailAsync(string toEmail, string displayName, CancellationToken ct = default)
    {
        var appUrl = (_config["App:BaseUrl"] ?? "http://localhost:3000").TrimEnd('/');
        var safeDisplayName = WebUtility.HtmlEncode(string.IsNullOrWhiteSpace(displayName) ? toEmail.Split('@')[0] : displayName);

        var subject = "Chào mừng bạn đến với Culinary Blog! 🍳";
        var htmlBody = $$"""
        <!DOCTYPE html>
        <html lang="vi">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>{{subject}}</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background-color: #f8f9fa;
                    margin: 0;
                    padding: 20px;
                    color: #333333;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background: #ffffff;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.07);
                    border: 1px solid #e9ecef;
                }
                .header {
                    background: linear-gradient(135deg, #e63946, #f77f00);
                    padding: 30px;
                    text-align: center;
                    color: #ffffff;
                }
                .header h1 {
                    margin: 0;
                    font-size: 26px;
                    font-weight: 700;
                    letter-spacing: 0.5px;
                }
                .content {
                    padding: 30px;
                    line-height: 1.6;
                }
                .content h2 {
                    color: #1d3557;
                    margin-top: 0;
                }
                .feature-list {
                    background-color: #f1faee;
                    border-left: 4px solid #e63946;
                    padding: 15px 20px;
                    margin: 20px 0;
                    border-radius: 0 6px 6px 0;
                }
                .feature-list ul {
                    margin: 0;
                    padding-left: 20px;
                }
                .feature-list li {
                    margin-bottom: 8px;
                }
                .btn-container {
                    text-align: center;
                    margin: 30px 0 20px;
                }
                .btn {
                    display: inline-block;
                    background-color: #e63946;
                    color: #ffffff !important;
                    padding: 14px 32px;
                    border-radius: 6px;
                    text-decoration: none;
                    font-weight: bold;
                    font-size: 16px;
                    transition: background-color 0.2s ease;
                }
                .footer {
                    background-color: #f8f9fa;
                    padding: 20px;
                    text-align: center;
                    font-size: 13px;
                    color: #6c757d;
                    border-top: 1px solid #dee2e6;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Culinary Blog 🍳</h1>
                </div>
                <div class="content">
                    <h2>Xin chào {{safeDisplayName}},</h2>
                    <p>Chào mừng bạn đã chính thức gia nhập cộng đồng những người đam mê ẩm thực tại <strong>Culinary Blog</strong>!</p>
                    <p>Chúng tôi rất vui mừng được đồng hành cùng bạn trên hành trình sáng tạo và khám phá thế giới ẩm thực phong phú.</p>
                    
                    <div class="feature-list">
                        <ul>
                            <li><strong>Khám phá công thức:</strong> Hàng trăm món ăn ngon từ truyền thống đến hiện đại.</li>
                            <li><strong>Chia sẻ niềm đam mê:</strong> Đăng tải và quản lý công thức nấu ăn của chính bạn.</li>
                            <li><strong>Tương tác cộng đồng:</strong> Kết nối, học hỏi kinh nghiệm cùng các đầu bếp tại gia.</li>
                        </ul>
                    </div>

                    <p>Hãy bắt đầu ngay bằng cách truy cập vào trang cá nhân và khám phá những công thức mới nhất:</p>
                    
                    <div class="btn-container">
                        <a href="{{appUrl}}" class="btn" target="_blank">Truy cập Culinary Blog</a>
                    </div>

                    <p style="font-size: 13px; color: #6c757d; margin-top: 25px;">
                        Nếu nút bấm trên không hoạt động, bạn có thể sao chép và dán liên kết sau vào trình duyệt:<br>
                        <a href="{{appUrl}}" style="color: #e63946; word-break: break-all;">{{appUrl}}</a>
                    </p>
                </div>
                <div class="footer">
                    <p>© {{DateTime.UtcNow.Year}} Culinary Blog (Nhóm 13). All rights reserved.</p>
                    <p>Email này được gửi tự động từ hệ thống background job.</p>
                </div>
            </div>
        </body>
        </html>
        """;

        await SendEmailAsync(toEmail, subject, htmlBody, ct);
    }
}
