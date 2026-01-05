using System.ComponentModel.DataAnnotations;

namespace KStyleDiary.DTOs;

public class UpdateLookDto
{
    [MaxLength(100)]
    public string? Name { get; set; }

    [MaxLength(2000)]
    public string? Description { get; set; }

    [MaxLength(150)]
    public string? Mood { get; set; }

    public bool? IsPublic { get; set; }
}