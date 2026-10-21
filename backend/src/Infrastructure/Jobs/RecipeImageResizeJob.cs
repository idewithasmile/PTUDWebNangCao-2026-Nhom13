using CulinaryBlog.Application.Common.Interfaces;
using CulinaryBlog.Domain.Interfaces;
using Hangfire;
using Microsoft.Extensions.Logging;

namespace CulinaryBlog.Infrastructure.Jobs;

/// <summary>
/// FR-JOB-002: Image Resize & Thumbnail Generation Job (Fire-and-forget).
/// Tải ảnh gốc từ MinIO, dùng ImageSharp sinh Thumbnail (300x300) và Medium (800x600),
/// upload lên MinIO theo quy ước và cập nhật URL vào database.
/// Retry policy: Tự động thử lại 3 lần nếu có sự cố MinIO / I/O.
/// </summary>
public class RecipeImageResizeJob : IRecipeImageResizeJob
{
    private readonly IFileStorageService _fileStorage;
    private readonly IImageProcessingService _imageProcessing;
    private readonly IRecipeRepository _recipeRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICacheService _cacheService;
    private readonly ILogger<RecipeImageResizeJob> _logger;

    public RecipeImageResizeJob(
        IFileStorageService fileStorage,
        IImageProcessingService imageProcessing,
        IRecipeRepository recipeRepository,
        IUnitOfWork unitOfWork,
        ICacheService cacheService,
        ILogger<RecipeImageResizeJob> logger)
    {
        _fileStorage = fileStorage;
        _imageProcessing = imageProcessing;
        _recipeRepository = recipeRepository;
        _unitOfWork = unitOfWork;
        _cacheService = cacheService;
        _logger = logger;
    }

    [AutomaticRetry(Attempts = 3, OnAttemptsExceeded = AttemptsExceededAction.Fail)]
    public async Task ExecuteAsync(Guid recipeId, Guid imageId, string originalUrl, CancellationToken ct = default)
    {
        _logger.LogInformation("FR-JOB-002: Bắt đầu xử lý resize ảnh cho RecipeId: {RecipeId}, ImageId: {ImageId}, OriginalUrl: {OriginalUrl}",
            recipeId, imageId, originalUrl);

        try
        {
            // 1. Tải stream ảnh gốc từ MinIO
            using var originalStream = await _fileStorage.GetStreamAsync(originalUrl, ct);

            var ext = Path.GetExtension(originalUrl);
            if (string.IsNullOrWhiteSpace(ext))
            {
                ext = ".jpg";
            }

            // 2. Tạo Thumbnail (300x300 px crop)
            var thumbResult = await _imageProcessing.CreateThumbnailAsync(originalStream, 300, 300, ct);
            var thumbKey = $"recipes/{recipeId}/{Guid.NewGuid()}-thumb{ext}";
            using var thumbStream = new MemoryStream(thumbResult.Data);
            var thumbUrl = await _fileStorage.UploadAsync(thumbStream, thumbKey, thumbResult.ContentType, folder: null, ct);

            // 3. Tạo Medium (800x600 px fit aspect ratio)
            if (originalStream.CanSeek)
            {
                originalStream.Position = 0;
            }
            var mediumResult = await _imageProcessing.CreateMediumAsync(originalStream, 800, 600, ct);
            var mediumKey = $"recipes/{recipeId}/{Guid.NewGuid()}-medium{ext}";
            using var mediumStream = new MemoryStream(mediumResult.Data);
            var mediumUrl = await _fileStorage.UploadAsync(mediumStream, mediumKey, mediumResult.ContentType, folder: null, ct);

            // 4. Cập nhật bản ghi RecipeImage trong cơ sở dữ liệu
            var recipe = await _recipeRepository.GetByIdWithImagesAsync(recipeId, ct);
            if (recipe == null)
            {
                _logger.LogWarning("FR-JOB-002: Không tìm thấy Recipe với Id: {RecipeId}. Bỏ qua cập nhật URL ảnh.", recipeId);
                return;
            }

            var image = recipe.Images.FirstOrDefault(i => i.Id == imageId);
            if (image == null)
            {
                _logger.LogWarning("FR-JOB-002: Không tìm thấy RecipeImage với Id: {ImageId} trong Recipe {RecipeId}.", imageId, recipeId);
                return;
            }

            image.SetProcessedUrls(mediumUrl, thumbUrl);
            await _unitOfWork.SaveChangesAsync(ct);

            // Evict cache cho Recipe
            await _cacheService.RemoveAsync($"recipe:{recipe.Slug}", ct);

            _logger.LogInformation("FR-JOB-002: Đã resize ảnh thành công cho Recipe {RecipeId}, Image {ImageId}. Thumb: {ThumbUrl}, Medium: {MediumUrl}",
                recipeId, imageId, thumbUrl, mediumUrl);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "FR-JOB-002: Lỗi khi resize ảnh cho RecipeId: {RecipeId}, ImageId: {ImageId}. Ảnh gốc vẫn được hiển thị bình thường.",
                recipeId, imageId);
            throw; // Ném ngoại lệ để Hangfire kích hoạt AutomaticRetry
        }
    }
}
