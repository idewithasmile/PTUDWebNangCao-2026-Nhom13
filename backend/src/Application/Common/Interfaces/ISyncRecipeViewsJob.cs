namespace CulinaryBlog.Application.Common.Interfaces;

public interface ISyncRecipeViewsJob
{
    Task ExecuteAsync(CancellationToken ct = default);
}
