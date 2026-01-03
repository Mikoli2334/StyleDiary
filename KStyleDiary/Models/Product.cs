using System.ComponentModel.DataAnnotations;

namespace KStyleDiary.Models;

public class Product
{
    public int Id { get; set; }
    [Required]
    [MaxLength(150)]
    public string Name { get; set; }=string.Empty;
    [MaxLength(150)]
    public string? Brand { get; set; }
    [Required]
    [MaxLength(150)]
    public string Category {get; set;}= string.Empty;
    [MaxLength(150)]
    public string? Country { get; set; }
    public decimal? Price { get; set; }
    public ICollection<LookProduct> LookProducts { get; set; }= new List<LookProduct>();
}
