namespace KStyleDiary.DTOs;

public class LookItemDto
{
    public int ProductId { get; set; }

    public string Name { get; set; } = string.Empty;
    public string? Brand { get; set; }
    public string Category { get; set; } = string.Empty;
    public string? Country { get; set; }
    public decimal? Price { get; set; }

    public string? UsageNote { get; set; }
    public int? Rating { get; set; }
}