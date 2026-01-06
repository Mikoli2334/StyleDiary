namespace KStyleDiary.DTOs;
using System.ComponentModel.DataAnnotations;
public class CreateProductDto
{
    [Required]
    [MaxLength(150)]
    [MinLength(1)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(150)]
    public string? Brand { get; set; }

    [Required]
    [MaxLength(150)]
    [MinLength(1)]
    public string Category { get; set; } = string.Empty;

    [MaxLength(150)]
    public string? Country { get; set; }

    [Range(0, 1000000)] 
    public decimal? Price { get; set; }
}