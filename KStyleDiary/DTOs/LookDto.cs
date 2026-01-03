using System.ComponentModel.DataAnnotations;
namespace KStyleDiary.DTOs;

public class LookDto
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public string? Mood { get; set; }

    public DateTime CreatingDate { get; set; }
}