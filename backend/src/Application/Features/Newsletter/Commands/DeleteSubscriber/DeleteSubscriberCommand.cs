using CulinaryBlog.Application.Common.Exceptions;
using CulinaryBlog.Domain.Interfaces;
using MediatR;

namespace CulinaryBlog.Application.Features.Newsletter.Commands.DeleteSubscriber;

public sealed record DeleteSubscriberCommand(Guid Id) : IRequest<Unit>;

public sealed class DeleteSubscriberCommandHandler(
    INewsletterSubscriberRepository subscriberRepository,
    IUnitOfWork unitOfWork) : IRequestHandler<DeleteSubscriberCommand, Unit>
{
    public async Task<Unit> Handle(DeleteSubscriberCommand request, CancellationToken ct)
    {
        var subscriber = await subscriberRepository.GetByIdAsync(request.Id, ct)
            ?? throw new NotFoundException(
                "NEWSLETTER_SUBSCRIBER_NOT_FOUND",
                $"Không tìm thấy khách hàng đăng ký bản tin với Id {request.Id}.");

        subscriber.IsDeleted = true;
        subscriber.UpdatedAt = DateTime.UtcNow;

        await unitOfWork.SaveChangesAsync(ct);
        return Unit.Value;
    }
}
