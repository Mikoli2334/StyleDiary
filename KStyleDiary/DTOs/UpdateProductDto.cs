using System.ComponentModel.DataAnnotations;

namespace KStyleDiary.DTOs;

public class UpdateProductDto
{
    [Required]
    [MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(150)]
    public string? Brand { get; set; }

    [Required]
    [MaxLength(150)]
    public string Category { get; set; } = string.Empty;

    [MaxLength(150)]
    public string? Country { get; set; }

    [Range(0, 100000)]
    public decimal? Price { get; set; }
}