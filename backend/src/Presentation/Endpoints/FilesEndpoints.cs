using CulinaryBlog.Application.Common.Exceptions;
using CulinaryBlog.Domain.Interfaces;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;

namespace CulinaryBlog.API.Endpoints;

public record FileUploadResponse(string Url, string FileName, long Size, string ContentType);

public record DeleteFileRequest(string Url);

public static class FilesEndpoints
{
    public static RouteGroupBuilder MapFilesEndpoints(this RouteGroupBuilder group)
    {
        group.MapPost("/upload", UploadFile)
            .RequireAuthorization()
            .DisableAntiforgery()
            .WithName("UploadFile")
            .WithSummary("Proxy Upload tệp tin lên MinIO (FR-FILE-001)")
            .WithDescription("Tiếp nhận tệp tin nhị phân, kiểm tra dung lượng tối đa 5MB, xác thực Magic Bytes (JPEG/PNG/WebP/AVIF), sinh đường dẫn định danh duy nhất chống Path Traversal và lưu trữ trên MinIO S3.")
            .Produces<FileUploadResponse>(StatusCodes.Status201Created)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status503ServiceUnavailable);

        group.MapDelete("/", DeleteFile)
            .RequireAuthorization()
            .WithName("DeleteFile")
            .WithSummary("Xóa tệp tin khỏi MinIO (FR-FILE-002)")
            .WithDescription("Trích xuất tên đối tượng và xóa khỏi bucket MinIO với cơ chế Idempotent và tự động thử lại tối đa 3 lần.")
            .Produces(StatusCodes.Status204NoContent)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status401Unauthorized);

        return group;
    }

    private static async Task<IResult> UploadFile(
        IFormFile? file,
        [FromQuery] string? folder,
        IFileStorageService fileStorageService,
        CancellationToken ct)
    {
        if (file == null || file.Length == 0)
        {
            return Results.BadRequest(new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Type = "FILE_EMPTY",
                Title = "Tệp tin rỗng",
                Detail = "Vui lòng chọn một tệp tin hợp lệ để tải lên."
            });
        }

        using var stream = file.OpenReadStream();
        var url = await fileStorageService.UploadAsync(stream, file.FileName, file.ContentType, folder, ct);

        return Results.Created(url, new FileUploadResponse(url, file.FileName, file.Length, file.ContentType));
    }

    private static async Task<IResult> DeleteFile(
        [FromQuery] string? url,
        [FromBody] DeleteFileRequest? body,
        IFileStorageService fileStorageService,
        CancellationToken ct)
    {
        var targetUrl = url ?? body?.Url;
        if (string.IsNullOrWhiteSpace(targetUrl))
        {
            return Results.BadRequest(new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Type = "FILE_URL_REQUIRED",
                Title = "Thiếu tham số URL",
                Detail = "Vui lòng cung cấp đường dẫn url của tệp tin cần xóa."
            });
        }

        await fileStorageService.DeleteAsync(targetUrl, ct);
        return Results.NoContent();
    }
}
