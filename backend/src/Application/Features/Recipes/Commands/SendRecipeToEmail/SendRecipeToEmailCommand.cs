using CulinaryBlog.Application.Common.Exceptions;
using CulinaryBlog.Application.Common.Interfaces;
using CulinaryBlog.Application.Features.Newsletter.Commands.SubscribeNewsletter;
using CulinaryBlog.Domain.Enums;
using CulinaryBlog.Domain.Interfaces;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CulinaryBlog.Application.Features.Recipes.Commands.SendRecipeToEmail;

public sealed record SendRecipeToEmailResponse(
    bool Success,
    string Email,
    int Servings,
    string Message);

public sealed record SendRecipeToEmailCommand(
    Guid RecipeId,
    string Email,
    int? Servings = null,
    bool SubscribeNewsletter = false) : IRequest<SendRecipeToEmailResponse>;

public sealed class SendRecipeToEmailCommandValidator : AbstractValidator<SendRecipeToEmailCommand>
{
    public SendRecipeToEmailCommandValidator()
    {
        RuleFor(x => x.RecipeId)
            .NotEmpty().WithMessage("Id công thức không hợp lệ.");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email người nhận không được để trống.")
            .EmailAddress().WithMessage("Email người nhận không đúng định dạng.")
            .MaximumLength(256);

        RuleFor(x => x.Servings)
            .InclusiveBetween(1, 50).WithMessage("Số khẩu phần phải từ 1 đến 50.")
            .When(x => x.Servings.HasValue);
    }
}

public sealed class SendRecipeToEmailCommandHandler(
    IRecipeRepository recipeRepository,
    ICurrentUser currentUser,
    IRecipeEmailDispatcher recipeEmailDispatcher,
    ISender sender,
    ILogger<SendRecipeToEmailCommandHandler> logger)
    : IRequestHandler<SendRecipeToEmailCommand, SendRecipeToEmailResponse>
{
    public async Task<SendRecipeToEmailResponse> Handle(SendRecipeToEmailCommand request, CancellationToken ct)
    {
        var recipe = await recipeRepository.GetQueryable()
            .AsNoTracking()
            .Where(r => !r.IsDeleted)
            .Select(r => new
            {
                r.Id,
                r.Status,
                r.AuthorId,
                r.Servings,
                CategorySlug = r.Category != null ? r.Category.Slug : null
            })
            .FirstOrDefaultAsync(r => r.Id == request.RecipeId, ct)
            ?? throw new NotFoundException("RECIPE_NOT_FOUND", $"Không tìm thấy công thức với Id {request.RecipeId}.");

        var isOwnerOrAdmin = currentUser.IsAuthenticated &&
            (currentUser.IsAdmin || string.Equals(recipe.AuthorId, currentUser.UserId, StringComparison.Ordinal));

        if (recipe.Status != RecipeStatus.Published && !isOwnerOrAdmin)
        {
            throw new ForbiddenException(
                "RECIPE_FORBIDDEN",
                "Chỉ có thể gửi email đối với công thức đã được xuất bản.");
        }

        var targetServings = request.Servings ?? Math.Max(1, recipe.Servings);
        var email = request.Email.Trim();

        await recipeEmailDispatcher.DispatchRecipeAsync(email, recipe.Id, targetServings, ct);

        if (request.SubscribeNewsletter)
        {
            try
            {
                await sender.Send(new SubscribeNewsletterCommand(
                    Email: email,
                    CustomerName: null,
                    FavoriteCategorySlug: recipe.CategorySlug,
                    Source: "RecipeDetail"), ct);
            }
            catch (Exception ex)
            {
                logger.LogWarning(ex, "Không thể tự động đăng ký bản tin khi gửi công thức qua email cho {Email}", email);
            }
        }

        return new SendRecipeToEmailResponse(
            Success: true,
            Email: email,
            Servings: targetServings,
            Message: $"Danh sách nguyên liệu ({targetServings} phần) và công thức đã được gửi tới {email}!");
    }
}
