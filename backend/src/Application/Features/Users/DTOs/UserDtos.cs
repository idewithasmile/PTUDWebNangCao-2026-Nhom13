namespace CulinaryBlog.Application.Features.Users.DTOs;

public record UserSummaryDto(
    string Id,
    string UserName,
    string Email,
    string DisplayName,
    string? AvatarUrl,
    string? Bio,
    IList<string> Roles,
    bool IsActive,
    DateTime CreatedAt,
    int TotalRecipes,
    int PublishedRecipes
);

public record UserStatsSummaryDto(
    int TotalUsers,
    int TotalAdmins,
    int TotalAuthors,
    int TotalActive
);

public record PagedUsersResultDto(
    IReadOnlyList<UserSummaryDto> Items,
    int TotalCount,
    int Page,
    int PageSize,
    UserStatsSummaryDto Stats
)
{
    public int TotalPages => PageSize > 0 ? (int)Math.Ceiling(TotalCount / (double)PageSize) : 0;
    public bool HasNextPage => Page < TotalPages;
    public bool HasPreviousPage => Page > 1;
}
