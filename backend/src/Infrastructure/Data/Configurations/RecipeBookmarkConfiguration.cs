using CulinaryBlog.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CulinaryBlog.Infrastructure.Data.Configurations;

public class RecipeBookmarkConfiguration : IEntityTypeConfiguration<RecipeBookmark>
{
    public void Configure(EntityTypeBuilder<RecipeBookmark> builder)
    {
        builder.ToTable("RecipeBookmarks");

        builder.HasKey(b => b.Id);

        builder.HasIndex(b => new { b.UserId, b.RecipeId })
            .IsUnique();

        builder.HasOne(b => b.User)
            .WithMany()
            .HasForeignKey(b => b.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(b => b.Recipe)
            .WithMany()
            .HasForeignKey(b => b.RecipeId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
