namespace CulinaryBlog.Application.Common.Models;

public class StorageQuotaOptions
{
    public const string SectionName = "StorageQuota";

    public int MaxImagesPerRecipe { get; set; } = 10;
    public int MaxTotalStorageMbPerUser { get; set; } = 500;
}
