using CulinaryBlog.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CulinaryBlog.Infrastructure.Data.Configurations;

public class NewsletterSubscriberConfiguration : IEntityTypeConfiguration<NewsletterSubscriber>
{
    public void Configure(EntityTypeBuilder<NewsletterSubscriber> builder)
    {
        builder.ToTable("NewsletterSubscribers");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Email)
            .IsRequired()
            .HasMaxLength(256);

        builder.Property(x => x.NormalizedEmail)
            .IsRequired()
            .HasMaxLength(256);

        builder.Property(x => x.CustomerName)
            .HasMaxLength(100);

        builder.Property(x => x.FavoriteCategorySlug)
            .HasMaxLength(120);

        builder.Property(x => x.Source)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(x => x.UnsubscribeToken)
            .IsRequired()
            .HasMaxLength(64);

        builder.HasIndex(x => x.NormalizedEmail)
            .IsUnique();

        builder.HasIndex(x => x.UnsubscribeToken)
            .IsUnique();
    }
}
