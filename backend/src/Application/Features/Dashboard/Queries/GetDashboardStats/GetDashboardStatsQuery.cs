using CulinaryBlog.Application.Features.Dashboard.DTOs;
using MediatR;

namespace CulinaryBlog.Application.Features.Dashboard.Queries.GetDashboardStats;

public record GetDashboardStatsQuery(bool? OnlyMine = null) : IRequest<DashboardStatsDto>;
