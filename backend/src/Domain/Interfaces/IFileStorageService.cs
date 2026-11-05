namespace CulinaryBlog.Domain.Interfaces;

public interface IFileStorageService
{
    Task<string> UploadAsync(Stream stream, string fileName, string contentType, string? folder = null, CancellationToken ct = default);
    Task DeleteAsync(string fileUrl, CancellationToken ct = default);
    Task<Stream> GetStreamAsync(string fileUrl, CancellationToken ct = default);
    Task EnsureStorageReadyAsync(CancellationToken ct = default) => Task.CompletedTask;
    Task<IReadOnlyList<string>> ListAllFilesAsync(string? folder = null, CancellationToken ct = default);
    Task<DateTimeOffset?> GetLastModifiedAsync(string fileUrl, CancellationToken ct = default) => Task.FromResult<DateTimeOffset?>(null);
}
