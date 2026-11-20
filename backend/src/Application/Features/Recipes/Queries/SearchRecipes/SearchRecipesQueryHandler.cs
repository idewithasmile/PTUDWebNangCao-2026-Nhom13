using System.Globalization;
using System.Text;
using CulinaryBlog.Application.Common.Models;
using CulinaryBlog.Application.Features.Recipes.DTOs;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Enums;
using CulinaryBlog.Domain.Interfaces;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.Application.Features.Recipes.Queries.SearchRecipes;

/// <summary>
/// Xử lý truy vấn tìm kiếm toàn văn bản công thức nấu ăn (FR-SRCH-001).
/// Ứng dụng công nghệ PostgreSQL tsvector, unaccent và EF.Functions.PlainToTsQuery("simple", searchTerm).
/// Tích hợp cơ chế phân quyền 3 cấp (Guest / Author / Admin) và phân trang PaginatedResult.
/// </summary>
public class SearchRecipesQueryHandler(IRecipeRepository recipeRepository)
    : IRequestHandler<SearchRecipesQuery, PaginatedResult<RecipeSummaryDto>>
{
    public async Task<PaginatedResult<RecipeSummaryDto>> Handle(
        SearchRecipesQuery request,
        CancellationToken cancellationToken)
    {
        var rawQuery = recipeRepository.GetQueryable().AsNoTracking();

        // 1. Phân quyền hiển thị theo tác nhân (Actor)
        if (request.IsAdmin)
        {
            // Quản trị viên (Admin) được phép xem toàn bộ công thức
        }
        else if (!string.IsNullOrEmpty(request.CurrentUserId))
        {
            // Tác giả thấy công thức đã xuất bản và công thức nháp/lưu trữ của chính mình
            rawQuery = rawQuery.Where(r => r.Status == RecipeStatus.Published || r.AuthorId == request.CurrentUserId);
        }
        else
        {
            // Khách vãng lai (Guest) chỉ xem được công thức đã xuất bản
            rawQuery = rawQuery.Where(r => r.Status == RecipeStatus.Published);
        }

        // 2. Lọc bổ sung theo danh mục và độ khó
        if (request.CategoryId.HasValue)
        {
            rawQuery = rawQuery.Where(r => r.CategoryId == request.CategoryId.Value);
        }

        if (request.Difficulty.HasValue)
        {
            rawQuery = rawQuery.Where(r => r.Difficulty == request.Difficulty.Value);
        }

        var page = request.Page < 1 ? 1 : request.Page;
        var pageSize = request.PageSize < 1 ? 10 : (request.PageSize > 50 ? 50 : request.PageSize);
        var searchTerm = request.SearchTerm?.Trim() ?? string.Empty;

        // 3. Thực thi tìm kiếm toàn văn bản
        var isPostgreSql = recipeRepository.IsPostgreSql;

        if (isPostgreSql)
        {
            try
            {
                // Tìm kiếm tiếng Việt không dấu trên PostgreSQL với tsvector, unaccent và ts_rank
                var unaccentedTerm = RemoveDiacritics(searchTerm);

                var ftsQuery = rawQuery
                    .Where(r => EF.Functions.ToTsVector("simple", EF.Functions.Unaccent(r.Title + " " + (r.Description ?? "")))
                        .Matches(EF.Functions.PlainToTsQuery("simple", unaccentedTerm)))
                    .OrderByDescending(r => EF.Functions.ToTsVector("simple", EF.Functions.Unaccent(r.Title + " " + (r.Description ?? "")))
                        .Rank(EF.Functions.PlainToTsQuery("simple", unaccentedTerm)));

                var ftsTotalCount = await ftsQuery.CountAsync(cancellationToken);

                var ftsItems = await ftsQuery
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ProjectToType<RecipeSummaryDto>()
                    .ToListAsync(cancellationToken);

                return new PaginatedResult<RecipeSummaryDto>(ftsItems, ftsTotalCount, page, pageSize);
            }
            catch
            {
                // Nếu PostgreSQL FTS gặp ký tự đặc biệt hoặc lỗi chuyển đổi, tự động fallback sang cơ chế tìm kiếm token
            }
        }

        // Xử lý tìm kiếm tiếng Việt không dấu cho môi trường In-Memory / Unit Tests hoặc khi FTS fallback
        var normalizedTerm = RemoveDiacritics(searchTerm).ToLowerInvariant();
            var tokens = normalizedTerm.Split(' ', StringSplitOptions.RemoveEmptyEntries);

            var filteredList = await rawQuery.ToListAsync(cancellationToken);

            var matchedList = filteredList
                .Where(r => {
                    var title = RemoveDiacritics(r.Title);
                    var desc = RemoveDiacritics(r.Description ?? string.Empty);
                    return tokens.All(tok => title.Contains(tok, StringComparison.OrdinalIgnoreCase) || desc.Contains(tok, StringComparison.OrdinalIgnoreCase));
                })
                .ToList();

            var totalCount = matchedList.Count;

            var items = matchedList
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .AsQueryable()
                .ProjectToType<RecipeSummaryDto>()
                .ToList();

            return new PaginatedResult<RecipeSummaryDto>(items, totalCount, page, pageSize);
    }

    /// <summary>
    /// Loại bỏ dấu phụ âm tiếng Việt để phục vụ tìm kiếm gần đúng không dấu.
    /// </summary>
    private static string RemoveDiacritics(string text)
    {
        if (string.IsNullOrWhiteSpace(text)) return string.Empty;

        var normalizedString = text.Normalize(NormalizationForm.FormD);
        var stringBuilder = new StringBuilder(normalizedString.Length);

        foreach (var c in normalizedString)
        {
            var unicodeCategory = CharUnicodeInfo.GetUnicodeCategory(c);
            if (unicodeCategory != UnicodeCategory.NonSpacingMark)
            {
                stringBuilder.Append(c);
            }
        }

        return stringBuilder
            .ToString()
            .Normalize(NormalizationForm.FormC)
            .Replace('đ', 'd')
            .Replace('Đ', 'D');
    }
}
