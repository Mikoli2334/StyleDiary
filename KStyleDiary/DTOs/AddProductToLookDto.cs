using System.ComponentModel.DataAnnotations;

namespace KStyleDiary.DTOs;

public class AddProductToLookDto
{
    [Required]
    [Range(1, int.MaxValue)]
    public int ProductId { get; set; }

    [MaxLength(500)]
    public string? UsageNote { get; set; }

    [Range(1, 5)]
    public int? Rating { get; set; }
}