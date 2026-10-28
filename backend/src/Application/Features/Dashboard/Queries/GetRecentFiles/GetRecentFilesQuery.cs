using CulinaryBlog.Application.Features.Dashboard.DTOs;
using MediatR;

namespace CulinaryBlog.Application.Features.Dashboard.Queries.GetRecentFiles;

public record GetRecentFilesQuery(int Limit = 6) : IRequest<List<RecentFileDto>>;
