using CulinaryBlog.Application.Features.Auth.Common;
using CulinaryBlog.Application.Features.Auth.Dtos;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using CulinaryBlog.Domain.Entities;
using AppEx = CulinaryBlog.Application.Common.Exceptions;

namespace CulinaryBlog.Application.Features.Auth.Commands.UpdateProfile;

// FR-AUTH-007: PATCH /api/v1/auth/me — Require Auth.
// Body { displayName?, avatarUrl?, bio? } — chỉ update field được gửi. Cấm đổi email/userName
// (thiết kế: command không hề có 2 field này).
public sealed record UpdateProfileCommand(
    string UserId,
    string? DisplayName = null,
    string? AvatarUrl = null,
    string? Bio = null) : IRequest<UserProfileDto>;

public sealed class UpdateProfileCommandValidator : AbstractValidator<UpdateProfileCommand>
{
    public UpdateProfileCommandValidator()
    {
        RuleFor(x => x.UserId).NotEmpty();
        RuleFor(x => x.DisplayName)
            .Length(2, 100).When(x => x.DisplayName is not null);
        RuleFor(x => x.AvatarUrl)
            .Must(u => Uri.TryCreate(u, UriKind.Absolute, out var uri)
                && (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps))
            .When(x => x.AvatarUrl is not null)
            .WithMessage("AvatarUrl must be a valid absolute http(s) URL.")
            .MaximumLength(500);
        RuleFor(x => x.Bio)
            .MaximumLength(2000).When(x => x.Bio is not null);
    }
}

public sealed class UpdateProfileCommandHandler(UserManager<ApplicationUser> users)
    : IRequestHandler<UpdateProfileCommand, UserProfileDto>
{
    public async Task<UserProfileDto> Handle(UpdateProfileCommand request, CancellationToken ct)
    {
        var user = await users.FindByIdAsync(request.UserId);
        if (user is null)
            throw new AppEx.NotFoundException(AuthErrors.UserNotFound, "User not found.");

        if (request.DisplayName is not null) user.DisplayName = request.DisplayName.Trim();
        if (request.AvatarUrl is not null) user.AvatarUrl = request.AvatarUrl;
        if (request.Bio is not null) user.Bio = request.Bio;

        var updated = await users.UpdateAsync(user);
        if (!updated.Succeeded)
            throw new AppEx.ValidationException(
                updated.Errors.GroupBy(e => e.Code, e => e.Description)
                    .ToDictionary(g => g.Key, g => g.ToArray()));

        var roles = await users.GetRolesAsync(user);
        return AuthMapping.ToProfileDto(user, roles);
    }
}
