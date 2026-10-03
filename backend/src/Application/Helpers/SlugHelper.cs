using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;

namespace CulinaryBlog.Application.Helpers;

public static partial class SlugHelper
{
    public static string Generate(string title)
    {
        if (string.IsNullOrWhiteSpace(title))
            return string.Empty;

        // Bỏ dấu tiếng Việt
        var normalizedString = title.Normalize(NormalizationForm.FormD);
        var stringBuilder = new StringBuilder();

        foreach (var c in normalizedString)
        {
            var unicodeCategory = CharUnicodeInfo.GetUnicodeCategory(c);
            if (unicodeCategory != UnicodeCategory.NonSpacingMark)
            {
                stringBuilder.Append(c);
            }
        }

        var slug = stringBuilder.ToString().Normalize(NormalizationForm.FormC).ToLowerInvariant();

        // Xử lý chữ Đ
        slug = slug.Replace('đ', 'd');

        // Chỉ giữ lại a-z, 0-9 và khoảng trắng/gạch nối
        slug = InvalidCharsRegex().Replace(slug, "");
        
        // Thay khoảng trắng thành gạch nối và loại bỏ gạch nối thừa
        slug = MultipleSpacesRegex().Replace(slug, "-").Trim('-');

        return slug;
    }

    [GeneratedRegex(@"[^a-z0-9\s-]")]
    private static partial Regex InvalidCharsRegex();

    [GeneratedRegex(@"\s+")]
    private static partial Regex MultipleSpacesRegex();
}
