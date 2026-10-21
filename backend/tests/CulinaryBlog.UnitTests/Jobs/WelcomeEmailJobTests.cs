using CulinaryBlog.Application.Common.Interfaces;
using CulinaryBlog.Infrastructure.Jobs;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;

namespace CulinaryBlog.UnitTests.Jobs;

public class WelcomeEmailJobTests
{
    private readonly Mock<IEmailService> _mockEmailService = new();
    private readonly Mock<ILogger<WelcomeEmailJob>> _mockLogger = new();
    private readonly WelcomeEmailJob _job;

    public WelcomeEmailJobTests()
    {
        _job = new WelcomeEmailJob(_mockEmailService.Object, _mockLogger.Object);
    }

    [Fact]
    public async Task ExecuteAsync_ValidParameters_CallsEmailServiceWithCorrectParameters()
    {
        // Arrange
        var email = "chef@example.com";
        var displayName = "Bếp Trưởng Hiếu";

        _mockEmailService
            .Setup(s => s.SendWelcomeEmailAsync(email, displayName, It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);

        // Act
        await _job.ExecuteAsync(email, displayName, CancellationToken.None);

        // Assert
        _mockEmailService.Verify(
            s => s.SendWelcomeEmailAsync(email, displayName, It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Fact]
    public async Task ExecuteAsync_EmailServiceThrowsException_LogsErrorAndRethrowsForHangfireRetry()
    {
        // Arrange
        var email = "invalid-smtp@example.com";
        var displayName = "Chef";

        _mockEmailService
            .Setup(s => s.SendWelcomeEmailAsync(email, displayName, It.IsAny<CancellationToken>()))
            .ThrowsAsync(new InvalidOperationException("SMTP connection failed"));

        // Act
        var act = async () => await _job.ExecuteAsync(email, displayName, CancellationToken.None);

        // Assert
        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("SMTP connection failed");

        _mockLogger.Verify(
            x => x.Log(
                LogLevel.Error,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains(email)),
                It.IsAny<Exception>(),
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
            Times.Once);
    }
}
