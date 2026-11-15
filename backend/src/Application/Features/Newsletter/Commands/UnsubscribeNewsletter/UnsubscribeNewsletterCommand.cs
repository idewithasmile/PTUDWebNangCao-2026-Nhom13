using CulinaryBlog.Application.Common.Exceptions;
using CulinaryBlog.Domain.Interfaces;
using FluentValidation;
using MediatR;

namespace CulinaryBlog.Application.Features.Newsletter.Commands.UnsubscribeNewsletter;

public sealed record UnsubscribeNewsletterCommand(string Token) : IRequest<Unit>;

public sealed class UnsubscribeNewsletterCommandValidator : AbstractValidator<UnsubscribeNewsletterCommand>
{
    public UnsubscribeNewsletterCommandValidator()
    {
        RuleFor(x => x.Token)
            .NotEmpty().WithMessage("Token hủy đăng ký không được để trống.");
    }
}

public sealed class UnsubscribeNewsletterCommandHandler(
    INewsletterSubscriberRepository subscriberRepository,
    IUnitOfWork unitOfWork) : IRequestHandler<UnsubscribeNewsletterCommand, Unit>
{
    public async Task<Unit> Handle(UnsubscribeNewsletterCommand request, CancellationToken ct)
    {
        var subscriber = await subscriberRepository.GetByUnsubscribeTokenAsync(request.Token.Trim(), ct)
            ?? throw new NotFoundException(
                "NEWSLETTER_TOKEN_NOT_FOUND",
                "Liên kết hủy đăng ký không hợp lệ hoặc đã hết hạn.");

        if (subscriber.IsActive)
        {
            subscriber.Unsubscribe();
            await unitOfWork.SaveChangesAsync(ct);
        }

        return Unit.Value;
    }
}
