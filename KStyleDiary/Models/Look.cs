using System.ComponentModel.DataAnnotations;

namespace KStyleDiary.Models;

public class Look
{
    public int Id { get; set; }
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } =string.Empty;
    [MaxLength(2000)]
    public string? Description { get; set; }
    [MaxLength(150)]
    public string? Mood { get; set; }
    public DateTime CreatingDate { get; set; }=DateTime.UtcNow;
    public int OwnerId { get; set; }
    public bool IsPublic { get; set; } = true;
    public ICollection<LookProduct> LookProducts { get; set; } = new List<LookProduct>();
    
}