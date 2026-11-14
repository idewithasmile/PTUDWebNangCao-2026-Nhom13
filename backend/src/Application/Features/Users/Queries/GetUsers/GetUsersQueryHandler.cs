using CulinaryBlog.Application.Features.Users.DTOs;
using CulinaryBlog.Domain.Common.Interfaces;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Enums;
using CulinaryBlog.Domain.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.Application.Features.Users.Queries.GetUsers;

public class GetUsersQueryHandler(
    UserManager<ApplicationUser> userManager,
    IRecipeRepository recipeRepository,
    ICurrentUser currentUser)
    : IRequestHandler<GetUsersQuery, PagedUsersResultDto>
{
    public async Task<PagedUsersResultDto> Handle(GetUsersQuery request, CancellationToken ct)
    {
        var isAdmin = currentUser.IsAdmin;
        var query = userManager.Users.AsNoTracking();

        // 1. Phân quyền hiển thị:
        // Nếu không phải Admin, chỉ hiển thị danh bạ các tác giả / quản trị viên công khai và đang hoạt động
        if (!isAdmin)
        {
            var authorUsers = await userManager.GetUsersInRoleAsync("Author");
            var adminUsers = await userManager.GetUsersInRoleAsync("Admin");
            var publicUserIds = authorUsers.Select(u => u.Id)
                .Concat(adminUsers.Select(u => u.Id))
                .Distinct()
                .ToHashSet();

            query = query.Where(u => u.IsActive && publicUserIds.Contains(u.Id));
        }

        // 2. Lọc theo Role cụ thể nếu được yêu cầu
        if (!string.IsNullOrWhiteSpace(request.Role))
        {
            var usersInTargetRole = await userManager.GetUsersInRoleAsync(request.Role.Trim());
            var targetIds = usersInTargetRole.Select(u => u.Id).ToHashSet();
            query = query.Where(u => targetIds.Contains(u.Id));
        }

        // 3. Lọc theo trạng thái IsActive
        if (request.IsActive.HasValue)
        {
            query = query.Where(u => u.IsActive == request.IsActive.Value);
        }

        // 4. Tìm kiếm từ khóa theo Tên hiển thị, Username hoặc Email
        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            var term = request.SearchTerm.Trim().ToLower();
            query = query.Where(u =>
                (u.DisplayName != null && u.DisplayName.ToLower().Contains(term)) ||
                (u.UserName != null && u.UserName.ToLower().Contains(term)) ||
                (u.Email != null && u.Email.ToLower().Contains(term)));
        }

        // 5. Tính toán phân trang
        var totalCount = await query.CountAsync(ct);
        var page = Math.Max(1, request.Page);
        var pageSize = request.PageSize is > 0 and <= 100 ? request.PageSize : 10;

        var pagedUsers = await query
            .OrderByDescending(u => u.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        // 6. Tính toán số lượng bài viết của từng user trong trang hiện tại
        var userIds = pagedUsers.Select(u => u.Id).ToList();
        var recipeStats = await recipeRepository.GetQueryable().AsNoTracking()
            .Where(r => userIds.Contains(r.AuthorId))
            .GroupBy(r => r.AuthorId)
            .Select(g => new
            {
                AuthorId = g.Key,
                Total = g.Count(),
                Published = g.Count(r => r.Status == RecipeStatus.Published)
            })
            .ToDictionaryAsync(x => x.AuthorId, ct);

        // 7. Chuyển đổi sang danh sách DTO
        var items = new List<UserSummaryDto>();
        foreach (var u in pagedUsers)
        {
            var roles = await userManager.GetRolesAsync(u);
            recipeStats.TryGetValue(u.Id, out var stats);

            items.Add(new UserSummaryDto(
                Id: u.Id,
                UserName: u.UserName ?? string.Empty,
                Email: isAdmin ? (u.Email ?? string.Empty) : MaskEmail(u.Email),
                DisplayName: string.IsNullOrWhiteSpace(u.DisplayName) ? (u.UserName ?? "Tác giả") : u.DisplayName,
                AvatarUrl: u.AvatarUrl,
                Bio: u.Bio,
                Roles: roles,
                IsActive: u.IsActive,
                CreatedAt: u.CreatedAt,
                TotalRecipes: stats?.Total ?? 0,
                PublishedRecipes: stats?.Published ?? 0
            ));
        }

        // 8. Tính toán các chỉ số thống kê tổng thể
        var allUsersQuery = userManager.Users.AsNoTracking();
        var totalUsers = await allUsersQuery.CountAsync(ct);
        var totalActive = await allUsersQuery.CountAsync(u => u.IsActive, ct);
        var admins = await userManager.GetUsersInRoleAsync("Admin");
        var authors = await userManager.GetUsersInRoleAsync("Author");

        var statsSummary = new UserStatsSummaryDto(
            TotalUsers: totalUsers,
            TotalAdmins: admins.Count,
            TotalAuthors: authors.Count,
            TotalActive: totalActive
        );

        return new PagedUsersResultDto(
            Items: items,
            TotalCount: totalCount,
            Page: page,
            PageSize: pageSize,
            Stats: statsSummary
        );
    }

    private static string MaskEmail(string? email)
    {
        if (string.IsNullOrWhiteSpace(email)) return string.Empty;
        var parts = email.Split('@');
        if (parts.Length != 2) return email;
        var name = parts[0];
        var maskedName = name.Length <= 2 ? name : $"{name[..2]}***";
        return $"{maskedName}@{parts[1]}";
    }
}
