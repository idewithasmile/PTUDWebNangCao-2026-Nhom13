using CulinaryBlog.Application.Features.Auth.Common;
using CulinaryBlog.Application.Features.Auth.Dtos;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using CulinaryBlog.Domain.Entities;
using AppEx = CulinaryBlog.Application.Common.Exceptions;

namespace CulinaryBlog.Application.Features.Auth.Queries.GetMe;

// FR-AUTH-006: GET /api/v1/auth/me — Require Auth. UserId từ Claims.
// Trả { id, email, displayName, avatarUrl, bio, roles, createdAt }. Chưa login → 401 (middleware).
public sealed record GetMeQuery(string UserId) : IRequest<UserProfileDto>;

public sealed class GetMeQueryValidator : AbstractValidator<GetMeQuery>
{
    public GetMeQueryValidator()
    {
        RuleFor(x => x.UserId).NotEmpty();
    }
}

public sealed class GetMeQueryHandler(UserManager<ApplicationUser> users)
    : IRequestHandler<GetMeQuery, UserProfileDto>
{
    public async Task<UserProfileDto> Handle(GetMeQuery request, CancellationToken ct)
    {
        var user = await users.FindByIdAsync(request.UserId);
        if (user is null)
            throw new AppEx.NotFoundException(AuthErrors.UserNotFound, "User not found.");

        var roles = await users.GetRolesAsync(user);
        return AuthMapping.ToProfileDto(user, roles);
    }
}
