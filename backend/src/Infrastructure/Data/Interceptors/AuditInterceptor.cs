using CulinaryBlog.Domain.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace CulinaryBlog.Infrastructure.Data.Interceptors;

public class AuditInterceptor : SaveChangesInterceptor
{
    public override InterceptionResult<int> SavingChanges(DbContextEventData eventData, InterceptionResult<int> result)
    {
        UpdateEntities(eventData.Context);
        return base.SavingChanges(eventData, result);
    }

    public override ValueTask<InterceptionResult<int>> SavingChangesAsync(DbContextEventData eventData, InterceptionResult<int> result, CancellationToken ct = default)
    {
        UpdateEntities(eventData.Context);
        return base.SavingChangesAsync(eventData, result, ct);
    }

    private static void UpdateEntities(DbContext? context)
    {
        if (context == null) return;
        var now = DateTime.UtcNow;
        foreach (var entry in context.ChangeTracker.Entries<BaseEntity>())
        {
            // Thực thể mới được thêm qua navigation collection (ví dụ recipe.AddImage)
            // nhưng do BaseEntity đã gán sẵn Id != Guid.Empty nên EF Core mặc định gán nhầm State = Modified.
            // Nếu RowVersion chưa từng được gán (rỗng), đây là thực thể mới cần INSERT.
            if (entry.State == EntityState.Modified && (entry.Entity.RowVersion == null || entry.Entity.RowVersion.Length == 0))
            {
                entry.State = EntityState.Added;
            }

            if (entry.State == EntityState.Added)
            {
                entry.Entity.CreatedAt = now;
                if (entry.Entity.RowVersion == null || entry.Entity.RowVersion.Length == 0)
                {
                    entry.Entity.RowVersion = Guid.NewGuid().ToByteArray();
                }
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Property(e => e.UpdatedAt).CurrentValue = now;
                entry.Entity.RowVersion = Guid.NewGuid().ToByteArray();
            }
        }
    }
}
