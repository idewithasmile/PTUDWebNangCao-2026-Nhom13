using CulinaryBlog.Application.Common.Helpers;
using FluentAssertions;

namespace CulinaryBlog.UnitTests;

public class SlugHelperTests
{
    [Theory]
    [InlineData("Món khai vị", "mon-khai-vi")]
    [InlineData("Món ăn vặt & Đồ uống", "mon-an-vat-do-uong")]
    [InlineData("Ẩm thực miền Bắc", "am-thuc-mien-bac")]
    [InlineData("Bún bò Huế đặc biệt", "bun-bo-hue-dac-biet")]
    [InlineData("Thịt kho tàu nước dừa", "thit-kho-tau-nuoc-dua")]
    [InlineData("   Canh chua   cá lóc   ", "canh-chua-ca-loc")]
    [InlineData("Đồ Uống Lạnh!", "do-uong-lanh")]
    public void GenerateSlug_ShouldNormalizeVietnameseAndHandleSpecialCharacters(string input, string expected)
    {
        var result = SlugHelper.GenerateSlug(input);
        result.Should().Be(expected);
    }

    [Fact]
    public void GenerateSlug_WhenEmptyOrWhitespace_ShouldReturnEmpty()
    {
        SlugHelper.GenerateSlug("").Should().BeEmpty();
        SlugHelper.GenerateSlug("   ").Should().BeEmpty();
    }
}
