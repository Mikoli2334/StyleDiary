namespace KStyleDiary.DTOs;

public class ProductDto
{
    public int Id { get; set; }
    public string Name { get; set; }=string.Empty;
    public string? Brand { get; set; }
    public string Category { get; set; }=string.Empty;
    public string? Country { get; set; }
    public decimal? Price { get; set; }
    
    
}