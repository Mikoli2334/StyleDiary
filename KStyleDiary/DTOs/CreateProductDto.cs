namespace KStyleDiary.DTOs;
using System.ComponentModel.DataAnnotations;
public class CreateProductDto
{
    [Required]
    [MaxLength(150)]
    public string Name { get; set; }=string.Empty;
    [MaxLength(150)]
    public string? Brand { get; set; }
    [Required]
    [MaxLength(150)]
    public string Category { get; set; }=string.Empty;
    [MaxLength(150)]
    public string? Country { get; set; }
    public decimal? Price { get; set; }
}