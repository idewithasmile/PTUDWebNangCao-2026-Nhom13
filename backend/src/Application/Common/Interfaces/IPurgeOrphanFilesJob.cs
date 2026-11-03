namespace CulinaryBlog.Application.Common.Interfaces;

public interface IPurgeOrphanFilesJob
{
    Task ExecuteAsync(CancellationToken ct = default);
}
