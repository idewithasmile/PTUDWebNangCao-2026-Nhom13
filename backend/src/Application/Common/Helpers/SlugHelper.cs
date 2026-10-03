using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;

namespace CulinaryBlog.Application.Common.Helpers;

public static partial class SlugHelper
{
    [GeneratedRegex(@"[^a-z0-9\s-]", RegexOptions.Compiled)]
    private static partial Regex InvalidCharsRegex();

    [GeneratedRegex(@"[\s-]+", RegexOptions.Compiled)]
    private static partial Regex MultipleWhitespaceOrHyphensRegex();

    public static string GenerateSlug(string text)
    {
        if (string.IsNullOrWhiteSpace(text)) return string.Empty;

        // Xử lý ký tự đặc thù tiếng Việt đ/Đ
        var normalized = text.Replace("đ", "d").Replace("Đ", "d");

        // Phân tách các ký tự có dấu (FormD) để loại bỏ dấu thanh
        var decomposed = normalized.Normalize(NormalizationForm.FormD);
        var sb = new StringBuilder();

        foreach (var c in decomposed)
        {
            var unicodeCategory = CharUnicodeInfo.GetUnicodeCategory(c);
            if (unicodeCategory != UnicodeCategory.NonSpacingMark)
            {
                sb.Append(c);
            }
        }

        var clean = sb.ToString().Normalize(NormalizationForm.FormC).ToLowerInvariant();

        // Xóa các ký tự không phải chữ cái số hoặc dấu gạch
        clean = InvalidCharsRegex().Replace(clean, "");

        // Rút gọn nhiều dấu gạch/khoảng trắng thành 1 dấu gạch nối và cắt bỏ 2 đầu
        clean = MultipleWhitespaceOrHyphensRegex().Replace(clean, "-").Trim('-');

        return clean;
    }
}
