using FluentValidation;

namespace CulinaryBlog.Application.Features.Recipes.Commands.UploadRecipeImage;

/// <summary>
/// Validation chạy trong ValidationBehavior (CONS-008). Fail → 400 RFC 7807.
/// Rule bám SRS FR-RCP-008 + CONS-007: size ≤ 5MB, MIME whitelist,
/// extension khớp MIME (magic bytes do IFileStorageService kiểm tra sâu).
/// </summary>
public class UploadRecipeImageCommandValidator : AbstractValidator<UploadRecipeImageCommand>
{
    private const int MaxFileSizeBytes = 5 * 1024 * 1024;

    private static readonly string[] AllowedContentTypes =
    [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/avif"
    ];

    private static readonly string[] AllowedExtensions =
    [
        ".jpg", ".jpeg", ".png", ".webp", ".avif"
    ];

    public UploadRecipeImageCommandValidator()
    {
        RuleFor(v => v.RecipeId)
            .NotEmpty().WithMessage("Recipe Id là bắt buộc.");

        RuleFor(v => v.Content)
            .NotNull().WithMessage("File ảnh là bắt buộc.")
            .Must(c => c is { Length: > 0 }).WithMessage("File ảnh rỗng.")
            .Must(c => c == null || c.Length <= MaxFileSizeBytes)
            .WithMessage("Kích thước file vượt quá giới hạn 5MB.");

        RuleFor(v => v.FileName)
            .NotEmpty().WithMessage("Tên file là bắt buộc.")
            .Must(HaveAllowedExtension).WithMessage("Định dạng file không được hỗ trợ (chỉ jpeg/png/webp/avif).");

        RuleFor(v => v.ContentType)
            .NotEmpty().WithMessage("Content-Type là bắt buộc.")
            .Must(ct => AllowedContentTypes.Contains(ct.ToLowerInvariant()))
            .WithMessage("MIME type không hợp lệ (chỉ image/jpeg, image/png, image/webp, image/avif).");

        RuleFor(v => v.AltText)
            .MaximumLength(500).WithMessage("AltText tối đa 500 ký tự.")
            .When(v => v.AltText != null);
    }

    private static bool HaveAllowedExtension(UploadRecipeImageCommand cmd, string fileName)
    {
        if (string.IsNullOrWhiteSpace(fileName)) return false;
        var ext = Path.GetExtension(fileName).ToLowerInvariant();
        return AllowedExtensions.Contains(ext);
    }
}
