using CulinaryBlog.Application.Common.Interfaces;
using Microsoft.Extensions.Configuration;

namespace CulinaryBlog.Infrastructure.Services;

public sealed class AppUrlService(IConfiguration config) : IAppUrlService
{
    public string GetFrontendBaseUrl() =>
        (config["App:BaseUrl"] ?? "http://localhost:3000").TrimEnd('/');
}
