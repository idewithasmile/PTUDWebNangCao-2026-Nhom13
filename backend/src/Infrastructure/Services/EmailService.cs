using System.Net;
using System.Text;
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

    public async Task SendPasswordResetEmailAsync(string toEmail, string displayName, string resetUrl, CancellationToken ct = default)
    {
        var safeName = WebUtility.HtmlEncode(string.IsNullOrWhiteSpace(displayName) ? toEmail.Split('@')[0] : displayName);
        var encodedUrl = WebUtility.HtmlEncode(resetUrl);
        var subject = "Đặt lại mật khẩu tài khoản Culinary Blog 🔐";

        var htmlBody = $$"""
        <!DOCTYPE html>
        <html lang="vi">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>{{subject}}</title>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa; margin: 0; padding: 20px; color: #333333; }
                .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.06); border: 1px solid #e9ecef; }
                .header { background: linear-gradient(135deg, #ea580c, #f97316); padding: 28px; text-align: center; color: #ffffff; }
                .header h1 { margin: 0; font-size: 24px; font-weight: 700; }
                .content { padding: 30px; line-height: 1.65; }
                .alert-box { background-color: #fff7ed; border-left: 4px solid #ea580c; padding: 14px 18px; margin: 20px 0; border-radius: 0 6px 6px 0; font-size: 13px; color: #7c2d12; }
                .btn-container { text-align: center; margin: 28px 0; }
                .btn { display: inline-block; background-color: #ea580c; color: #ffffff !important; padding: 14px 30px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 15px; }
                .footer { background-color: #f8f9fa; padding: 18px; text-align: center; font-size: 12px; color: #6c757d; border-top: 1px solid #dee2e6; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Culinary Blog 🔐</h1>
                </div>
                <div class="content">
                    <h2 style="margin-top:0; color:#1f2937;">Xin chào {{safeName}},</h2>
                    <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản <strong>Culinary Blog</strong> liên kết với địa chỉ email này.</p>
                    <p>Nhấn vào nút bên dưới để tạo mật khẩu mới:</p>
                    <div class="btn-container">
                        <a href="{{encodedUrl}}" class="btn" target="_blank">Đặt lại mật khẩu</a>
                    </div>
                    <div class="alert-box">
                        <strong>Lưu ý bảo mật:</strong> Liên kết này chỉ sử dụng một lần và sẽ hết hạn theo chính sách bảo mật của hệ thống. Nếu bạn không yêu cầu thay đổi mật khẩu, hãy bỏ qua email này — tài khoản của bạn vẫn an toàn.
                    </div>
                    <p style="font-size: 12px; color: #6c757d; margin-top: 20px;">
                        Nếu nút bấm không hoạt động, hãy sao chép liên kết sau vào trình duyệt:<br>
                        <a href="{{encodedUrl}}" style="color: #ea580c; word-break: break-all;">{{encodedUrl}}</a>
                    </p>
                </div>
                <div class="footer">
                    <p>© {{DateTime.UtcNow.Year}} Culinary Blog (Nhóm 13). All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """;

        await SendEmailAsync(toEmail, subject, htmlBody, ct);
    }

    public async Task SendNewsletterWelcomeEmailAsync(
        string toEmail,
        string? customerName,
        string? favoriteCategoryName,
        IReadOnlyList<NewsletterFeaturedRecipeEmailItem> featuredRecipes,
        string unsubscribeUrl,
        CancellationToken ct = default)
    {
        var appUrl = (_config["App:BaseUrl"] ?? "http://localhost:3000").TrimEnd('/');
        var greetingName = string.IsNullOrWhiteSpace(customerName) ? toEmail.Split('@')[0] : customerName;
        var safeName = WebUtility.HtmlEncode(greetingName);
        var safeCategory = string.IsNullOrWhiteSpace(favoriteCategoryName)
            ? "Ẩm thực đa dạng"
            : WebUtility.HtmlEncode(favoriteCategoryName);
        var safeUnsubscribeUrl = WebUtility.HtmlEncode(unsubscribeUrl);

        var recipesHtml = new StringBuilder();
        foreach (var item in featuredRecipes)
        {
            var safeTitle = WebUtility.HtmlEncode(item.Title);
            var safeCat = WebUtility.HtmlEncode(item.CategoryName);
            var recipeUrl = WebUtility.HtmlEncode($"{appUrl}/recipes/{Uri.EscapeDataString(item.Slug)}");
            recipesHtml.Append($"""
                <li style="margin-bottom: 12px; padding: 12px; background: #fffbf5; border: 1px solid #fed7aa; border-radius: 8px; list-style: none;">
                    <a href="{recipeUrl}" style="font-weight: 700; color: #c2410c; text-decoration: none; font-size: 15px;">{safeTitle}</a>
                    <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">
                        Danh mục: <strong>{safeCat}</strong> • Thời gian nấu: <strong>{item.TotalTimeMinutes} phút</strong>
                    </div>
                </li>
                """);
        }

        var featuredSection = featuredRecipes.Count > 0
            ? $"""
              <h3 style="color: #1f2937; margin-top: 24px; margin-bottom: 12px;">✨ Gợi ý công thức nổi bật dành cho bạn</h3>
              <ul style="padding: 0; margin: 0;">{recipesHtml}</ul>
              """
            : string.Empty;

        var subject = "Cảm ơn bạn đã đăng ký Bản tin Ẩm thực Culinary Blog! 🍲";
        var htmlBody = $$"""
        <!DOCTYPE html>
        <html lang="vi">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>{{subject}}</title>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa; margin: 0; padding: 20px; color: #333333; }
                .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.06); border: 1px solid #e9ecef; }
                .header { background: linear-gradient(135deg, #ea580c, #f59e0b); padding: 28px; text-align: center; color: #ffffff; }
                .header h1 { margin: 0; font-size: 24px; font-weight: 700; }
                .content { padding: 30px; line-height: 1.65; }
                .badge { display: inline-block; background: #ffedd5; color: #9a3412; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 700; }
                .btn-container { text-align: center; margin: 26px 0; }
                .btn { display: inline-block; background-color: #ea580c; color: #ffffff !important; padding: 13px 28px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 15px; }
                .footer { background-color: #f8f9fa; padding: 18px; text-align: center; font-size: 12px; color: #6c757d; border-top: 1px solid #dee2e6; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Culinary Blog Newsletter 🍲</h1>
                </div>
                <div class="content">
                    <h2 style="margin-top:0; color:#1f2937;">Xin chào {{safeName}},</h2>
                    <p>Cảm ơn bạn đã để lại email để đồng hành cùng <strong>Culinary Blog</strong>! Hàng tuần, chúng tôi sẽ gửi tới bạn những công thức nấu ăn tuyển chọn, mẹo bếp núc hữu ích và thực đơn theo mùa.</p>
                    <p>Chủ đề bạn quan tâm: <span class="badge">{{safeCategory}}</span></p>
                    {{featuredSection}}
                    <div class="btn-container">
                        <a href="{{WebUtility.HtmlEncode(appUrl)}}/recipes" class="btn" target="_blank">Khám phá thêm công thức</a>
                    </div>
                </div>
                <div class="footer">
                    <p>© {{DateTime.UtcNow.Year}} Culinary Blog (Nhóm 13). All rights reserved.</p>
                    <p>Không muốn nhận bản tin nữa? <a href="{{safeUnsubscribeUrl}}" style="color: #ea580c;">Hủy đăng ký tại đây</a>.</p>
                </div>
            </div>
        </body>
        </html>
        """;

        await SendEmailAsync(toEmail, subject, htmlBody, ct);
    }

    public async Task SendRecipeIngredientsEmailAsync(
        string toEmail,
        string recipeTitle,
        string recipeSlug,
        int servings,
        int totalTimeMinutes,
        IReadOnlyList<RecipeEmailIngredientItem> ingredients,
        IReadOnlyList<RecipeEmailStepItem> steps,
        CancellationToken ct = default)
    {
        var appUrl = (_config["App:BaseUrl"] ?? "http://localhost:3000").TrimEnd('/');
        var safeTitle = WebUtility.HtmlEncode(recipeTitle);
        var recipeUrl = WebUtility.HtmlEncode($"{appUrl}/recipes/{Uri.EscapeDataString(recipeSlug)}");

        var ingredientsHtml = new StringBuilder();
        foreach (var ing in ingredients)
        {
            var qtyPart = string.IsNullOrWhiteSpace(ing.QuantityDisplay)
                ? string.Empty
                : $"<strong>{WebUtility.HtmlEncode(ing.QuantityDisplay)}</strong> ";
            var unitPart = string.IsNullOrWhiteSpace(ing.Unit)
                ? string.Empty
                : $"<strong>{WebUtility.HtmlEncode(ing.Unit)}</strong> ";
            var notesPart = string.IsNullOrWhiteSpace(ing.Notes)
                ? string.Empty
                : $" <span style=\"color:#6b7280;font-style:italic;\">({WebUtility.HtmlEncode(ing.Notes)})</span>";

            ingredientsHtml.Append($"""
                <li style="margin-bottom: 6px;">
                    ☐ {qtyPart}{unitPart}{WebUtility.HtmlEncode(ing.Name)}{notesPart}
                </li>
                """);
        }

        var stepsHtml = new StringBuilder();
        foreach (var step in steps)
        {
            var stepTitle = string.IsNullOrWhiteSpace(step.Title)
                ? $"Bước {step.StepNumber}"
                : $"Bước {step.StepNumber}: {WebUtility.HtmlEncode(step.Title)}";
            var stepDesc = WebUtility.HtmlEncode(step.Description).Replace("\n", "<br>");
            stepsHtml.Append($"""
                <div style="margin-bottom: 14px; padding: 12px; background: #f9fafb; border-radius: 8px; border-left: 3px solid #ea580c;">
                    <div style="font-weight: 700; color: #1f2937; margin-bottom: 4px;">{stepTitle}</div>
                    <div style="font-size: 13px; color: #374151; line-height: 1.55;">{stepDesc}</div>
                </div>
                """);
        }

        var subject = $"🛒 Danh sách nguyên liệu & Công thức: {recipeTitle}";
        var htmlBody = $$"""
        <!DOCTYPE html>
        <html lang="vi">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>{{WebUtility.HtmlEncode(subject)}}</title>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa; margin: 0; padding: 20px; color: #333333; }
                .container { max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.06); border: 1px solid #e9ecef; }
                .header { background: linear-gradient(135deg, #ea580c, #f97316); padding: 26px; text-align: center; color: #ffffff; }
                .header h1 { margin: 0; font-size: 22px; font-weight: 700; }
                .content { padding: 28px; line-height: 1.6; }
                .meta { background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 12px 16px; margin-bottom: 20px; font-size: 13px; color: #9a3412; }
                .btn-container { text-align: center; margin: 24px 0 10px; }
                .btn { display: inline-block; background-color: #ea580c; color: #ffffff !important; padding: 12px 26px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px; }
                .footer { background-color: #f8f9fa; padding: 18px; text-align: center; font-size: 12px; color: #6c757d; border-top: 1px solid #dee2e6; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>{{safeTitle}}</h1>
                </div>
                <div class="content">
                    <div class="meta">
                        🍽️ Khẩu phần: <strong>{{servings}} người</strong> &nbsp;|&nbsp; ⏱️ Tổng thời gian: <strong>{{totalTimeMinutes}} phút</strong>
                    </div>

                    <h3 style="color: #1f2937; border-bottom: 2px solid #fed7aa; padding-bottom: 6px;">🛒 Danh sách nguyên liệu cần chuẩn bị</h3>
                    <ul style="padding-left: 4px; list-style: none; font-size: 14px;">
                        {{ingredientsHtml}}
                    </ul>

                    <h3 style="color: #1f2937; border-bottom: 2px solid #fed7aa; padding-bottom: 6px; margin-top: 26px;">👨‍🍳 Các bước thực hiện</h3>
                    {{stepsHtml}}

                    <div class="btn-container">
                        <a href="{{recipeUrl}}" class="btn" target="_blank">Xem bài viết gốc trên Culinary Blog</a>
                    </div>
                </div>
                <div class="footer">
                    <p>© {{DateTime.UtcNow.Year}} Culinary Blog (Nhóm 13). Chúc bạn nấu ăn thật ngon miệng!</p>
                </div>
            </div>
        </body>
        </html>
        """;

        await SendEmailAsync(toEmail, subject, htmlBody, ct);
    }
}
