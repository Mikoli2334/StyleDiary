using System.ComponentModel.DataAnnotations;

namespace KStyleDiary.Models;

public class LookProduct
{
    public int LookId { get; set; }
    public Look Look { get; set; } = null!;
    
    public int ProductId { get; set; }
    public Product Product { get; set; } = null!;
    
    [MaxLength(500)]
    public string? UsageNote  { get; set; }
    [Range(1,5)]
    public int? Rating { get; set; }
    
    
    
    
}
    