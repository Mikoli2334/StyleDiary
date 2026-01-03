namespace KStyleDiary.DTOs;

public class LookDetailsDto
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;
    public string? Mood { get; set; }
    public string? Description { get; set; }

    public DateTime CreatingDate { get; set; }

    public List<LookItemDto> Items { get; set; } = new();
}