using System.Text;
using CulinaryBlog.Domain.Interfaces;
using MediatR;

namespace CulinaryBlog.Application.Features.Newsletter.Queries.ExportSubscribers;

public sealed record ExportSubscribersQuery(bool? IsActive = null) : IRequest<byte[]>;

public sealed class ExportSubscribersQueryHandler(
    INewsletterSubscriberRepository subscriberRepository)
    : IRequestHandler<ExportSubscribersQuery, byte[]>
{
    public async Task<byte[]> Handle(ExportSubscribersQuery request, CancellationToken ct)
    {
        var subscribers = await subscriberRepository.GetAllAsync(request.IsActive, ct);

        var sb = new StringBuilder();
        sb.AppendLine("Id,Email,CustomerName,FavoriteCategorySlug,Source,IsActive,SubscribedAt,UnsubscribedAt");

        foreach (var s in subscribers)
        {
            sb.Append(EscapeCsv(s.Id.ToString())).Append(',');
            sb.Append(EscapeCsv(s.Email)).Append(',');
            sb.Append(EscapeCsv(s.CustomerName ?? string.Empty)).Append(',');
            sb.Append(EscapeCsv(s.FavoriteCategorySlug ?? string.Empty)).Append(',');
            sb.Append(EscapeCsv(s.Source)).Append(',');
            sb.Append(s.IsActive ? "Active" : "Unsubscribed").Append(',');
            sb.Append(EscapeCsv(s.SubscribedAt.ToString("O"))).Append(',');
            sb.AppendLine(EscapeCsv(s.UnsubscribedAt?.ToString("O") ?? string.Empty));
        }

        var preamble = Encoding.UTF8.GetPreamble();
        var body = Encoding.UTF8.GetBytes(sb.ToString());
        var result = new byte[preamble.Length + body.Length];
        Buffer.BlockCopy(preamble, 0, result, 0, preamble.Length);
        Buffer.BlockCopy(body, 0, result, preamble.Length, body.Length);
        return result;
    }

    private static string EscapeCsv(string value)
    {
        if (value.Contains('"') || value.Contains(',') || value.Contains('\n') || value.Contains('\r'))
        {
            return $"\"{value.Replace("\"", "\"\"")}\"";
        }
        return value;
    }
}
