namespace KStyleDiary.DTOs;
using System.ComponentModel.DataAnnotations;
public class CreateLookDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string? Description { get; set; }

    [MaxLength(150)]
    public string? Mood { get; set; }
}