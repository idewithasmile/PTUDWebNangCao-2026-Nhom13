using System.Diagnostics;
using System.Diagnostics.Metrics;
using CulinaryBlog.Application.Behaviors;
using CulinaryBlog.Application.Common.Observability;
using CulinaryBlog.Domain.Interfaces;
using FluentAssertions;
using MediatR;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace CulinaryBlog.UnitTests.Behaviors;

// Test request definitions
public record FastTestQuery : IRequest<string>;
public record SlowTestCommand : IRequest<string>;
public record CreateRecipeCommand : IRequest<string>;
public record PublishRecipeCommand : IRequest<string>;
public record FailingTestCommand : IRequest<string>;

/// <summary>
/// Unit tests for LoggingBehavior pipeline behavior (FR-OBS-002, FR-OBS-003, CONS-010).
/// </summary>
public class LoggingBehaviorTests
{
    [Fact]
    public async Task Handle_WhenRequestIsFast_ShouldLogInformationAndNotWarning()
    {
        // Arrange
        var loggerMock = new Mock<ILogger<LoggingBehavior<FastTestQuery, string>>>();
        var currentUserMock = new Mock<ICurrentUser>();
        currentUserMock.Setup(u => u.UserId).Returns("user-123");

        var behavior = new LoggingBehavior<FastTestQuery, string>(loggerMock.Object, currentUserMock.Object);

        // Act
        var result = await behavior.Handle(new FastTestQuery(), () => Task.FromResult("success"), CancellationToken.None);

        // Assert
        result.Should().Be("success");

        // Verify LogInformation was called with Handled
        loggerMock.Verify(
            x => x.Log(
                LogLevel.Information,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("Handled FastTestQuery")),
                null,
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
            Times.Once);

        // Verify LogWarning for Performance Alert was NOT called
        loggerMock.Verify(
            x => x.Log(
                LogLevel.Warning,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("Performance Alert")),
                null,
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
            Times.Never);
    }

    [Fact]
    public async Task Handle_WhenRequestIsSlow_ShouldLogWarningPerformanceAlert()
    {
        // Arrange
        var loggerMock = new Mock<ILogger<LoggingBehavior<SlowTestCommand, string>>>();
        var currentUserMock = new Mock<ICurrentUser>();
        currentUserMock.Setup(u => u.UserId).Returns("user-perf");

        var behavior = new LoggingBehavior<SlowTestCommand, string>(loggerMock.Object, currentUserMock.Object);

        // Act - Simulate a handler that takes > 500ms
        var result = await behavior.Handle(
            new SlowTestCommand(),
            async () =>
            {
                await Task.Delay(550);
                return "slow-done";
            },
            CancellationToken.None);

        // Assert
        result.Should().Be("slow-done");

        // Verify LogWarning was called with Performance Alert
        loggerMock.Verify(
            x => x.Log(
                LogLevel.Warning,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("Performance Alert") && v.ToString()!.Contains("> 500ms")),
                null,
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
            Times.Once);
    }

    [Fact]
    public async Task Handle_WhenRequestIsCommand_ShouldLogAuditTrail()
    {
        // Arrange
        var loggerMock = new Mock<ILogger<LoggingBehavior<SlowTestCommand, string>>>();
        var currentUserMock = new Mock<ICurrentUser>();
        currentUserMock.Setup(u => u.UserId).Returns("chef-john");

        var behavior = new LoggingBehavior<SlowTestCommand, string>(loggerMock.Object, currentUserMock.Object);

        // Act
        await behavior.Handle(new SlowTestCommand(), () => Task.FromResult("ok"), CancellationToken.None);

        // Assert
        loggerMock.Verify(
            x => x.Log(
                LogLevel.Information,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("Audit Trail") && v.ToString()!.Contains("chef-john")),
                null,
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
            Times.Once);
    }

    [Fact]
    public async Task Handle_ShouldStartActivitySpanWithProperTags()
    {
        // Arrange
        var loggerMock = new Mock<ILogger<LoggingBehavior<FastTestQuery, string>>>();
        var currentUserMock = new Mock<ICurrentUser>();
        currentUserMock.Setup(u => u.UserId).Returns("trace-user-42");

        Activity? capturedActivity = null;
        using var listener = new ActivityListener
        {
            ShouldListenTo = s => s.Name == CulinaryBlogDiagnostics.ServiceName,
            Sample = (ref ActivityCreationOptions<ActivityContext> _) => ActivitySamplingResult.AllData,
            ActivityStarted = a => capturedActivity = a
        };
        ActivitySource.AddActivityListener(listener);

        var behavior = new LoggingBehavior<FastTestQuery, string>(loggerMock.Object, currentUserMock.Object);

        // Act
        await behavior.Handle(new FastTestQuery(), () => Task.FromResult("traced"), CancellationToken.None);

        // Assert
        capturedActivity.Should().NotBeNull();
        capturedActivity!.OperationName.Should().Be(nameof(FastTestQuery));
        capturedActivity.GetTagItem("mediatr.request_name").Should().Be(nameof(FastTestQuery));
        capturedActivity.GetTagItem("user.id").Should().Be("trace-user-42");
    }

    [Fact]
    public async Task Handle_WhenCreateRecipeCommandSucceeds_ShouldIncrementRecipesCreatedMetric()
    {
        // Arrange
        var loggerMock = new Mock<ILogger<LoggingBehavior<CreateRecipeCommand, string>>>();
        var currentUserMock = new Mock<ICurrentUser>();
        currentUserMock.Setup(u => u.UserId).Returns("creator-1");

        long measurementValue = 0;
        using var meterListener = new MeterListener();
        meterListener.InstrumentPublished = (inst, l) =>
        {
            if (inst.Meter.Name == CulinaryBlogMetrics.MeterName)
                l.EnableMeasurementEvents(inst);
        };
        meterListener.SetMeasurementEventCallback<long>((inst, measurement, tags, state) =>
        {
            if (inst.Name == "culinaryblog.recipes.created")
                measurementValue += measurement;
        });
        meterListener.Start();

        var behavior = new LoggingBehavior<CreateRecipeCommand, string>(loggerMock.Object, currentUserMock.Object);

        // Act
        var result = await behavior.Handle(new CreateRecipeCommand(), () => Task.FromResult("created"), CancellationToken.None);

        // Assert
        result.Should().Be("created");
        measurementValue.Should().Be(1);
    }

    [Fact]
    public async Task Handle_WhenPublishRecipeCommandSucceeds_ShouldIncrementRecipesPublishedMetric()
    {
        // Arrange
        var loggerMock = new Mock<ILogger<LoggingBehavior<PublishRecipeCommand, string>>>();
        var currentUserMock = new Mock<ICurrentUser>();
        currentUserMock.Setup(u => u.UserId).Returns("publisher-1");

        long measurementValue = 0;
        using var meterListener = new MeterListener();
        meterListener.InstrumentPublished = (inst, l) =>
        {
            if (inst.Meter.Name == CulinaryBlogMetrics.MeterName)
                l.EnableMeasurementEvents(inst);
        };
        meterListener.SetMeasurementEventCallback<long>((inst, measurement, tags, state) =>
        {
            if (inst.Name == "culinaryblog.recipes.published")
                measurementValue += measurement;
        });
        meterListener.Start();

        var behavior = new LoggingBehavior<PublishRecipeCommand, string>(loggerMock.Object, currentUserMock.Object);

        // Act
        var result = await behavior.Handle(new PublishRecipeCommand(), () => Task.FromResult("published"), CancellationToken.None);

        // Assert
        result.Should().Be("published");
        measurementValue.Should().Be(1);
    }

    [Fact]
    public async Task Handle_WhenRequestThrowsException_ShouldIncrementErrorMetricAndSetActivityStatus()
    {
        // Arrange
        var loggerMock = new Mock<ILogger<LoggingBehavior<FailingTestCommand, string>>>();
        var currentUserMock = new Mock<ICurrentUser>();

        long errorCount = 0;
        using var meterListener = new MeterListener();
        meterListener.InstrumentPublished = (inst, l) =>
        {
            if (inst.Meter.Name == CulinaryBlogMetrics.MeterName)
                l.EnableMeasurementEvents(inst);
        };
        meterListener.SetMeasurementEventCallback<long>((inst, measurement, tags, state) =>
        {
            if (inst.Name == "culinaryblog.requests.errors")
                errorCount += measurement;
        });
        meterListener.Start();

        Activity? capturedActivity = null;
        using var activityListener = new ActivityListener
        {
            ShouldListenTo = s => s.Name == CulinaryBlogDiagnostics.ServiceName,
            Sample = (ref ActivityCreationOptions<ActivityContext> _) => ActivitySamplingResult.AllData,
            ActivityStopped = a => capturedActivity = a
        };
        ActivitySource.AddActivityListener(activityListener);

        var behavior = new LoggingBehavior<FailingTestCommand, string>(loggerMock.Object, currentUserMock.Object);

        // Act
        var act = () => behavior.Handle(
            new FailingTestCommand(),
            () => throw new InvalidOperationException("Simulated failure in handler"),
            CancellationToken.None);

        // Assert
        await act.Should().ThrowAsync<InvalidOperationException>().WithMessage("Simulated failure in handler");
        errorCount.Should().Be(1);
        capturedActivity.Should().NotBeNull();
        capturedActivity!.Status.Should().Be(ActivityStatusCode.Error);
        capturedActivity.StatusDescription.Should().Be("Simulated failure in handler");

        loggerMock.Verify(
            x => x.Log(
                LogLevel.Error,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("Error handling FailingTestCommand")),
                It.IsAny<InvalidOperationException>(),
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
            Times.Once);
    }
}
