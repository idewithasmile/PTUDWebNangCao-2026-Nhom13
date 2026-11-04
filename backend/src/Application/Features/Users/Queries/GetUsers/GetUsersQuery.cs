using CulinaryBlog.Application.Features.Users.DTOs;
using MediatR;

namespace CulinaryBlog.Application.Features.Users.Queries.GetUsers;

public record GetUsersQuery(
    string? SearchTerm = null,
    string? Role = null,
    bool? IsActive = null,
    int Page = 1,
    int PageSize = 10
) : IRequest<PagedUsersResultDto>;
