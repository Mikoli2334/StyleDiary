namespace KStyleDiary.Services;
using KStyleDiary.Data;
using KStyleDiary.DTOs;
using Microsoft.EntityFrameworkCore;

public class LookService:ILookService
{
    private readonly AppDbContext _context;

    public LookService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<LookDto> CreateAsync(CreateLookDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
        {
            throw new ArgumentException("Name is required");
        }

        var entity = new Models.Look
        {
            Name = dto.Name.Trim(),
            Mood = dto.Mood?.Trim(),
            Description = dto.Description?.Trim(),
            OwnerId = 0
        };
        _context.Looks.Add(entity);
        await _context.SaveChangesAsync();
        
        return new LookDto
        {
            Id = entity.Id,
            Name = entity.Name,
            Description = entity.Description,
            Mood = entity.Mood,
            CreatingDate = entity.CreatingDate
        };
        

    }
    
    public async Task<bool> AddProductAsync(int lookId, AddProductToLookDto dto)
    {
       
        var lookExists = await _context.Looks.AnyAsync(l => l.Id == lookId);
        if (!lookExists) return false;

     
        var productExists = await _context.Products.AnyAsync(p => p.Id == dto.ProductId);
        if (!productExists) return false;

       
        var linkExists = await _context.LookProducts.AnyAsync(lp =>
            lp.LookId == lookId && lp.ProductId == dto.ProductId);

        if (linkExists) return false;

       
        var link = new Models.LookProduct
        {
            LookId = lookId,
            ProductId = dto.ProductId,
            UsageNote = dto.UsageNote?.Trim(),
            Rating = dto.Rating
        };

        _context.LookProducts.Add(link);
        await _context.SaveChangesAsync();

        return true;
    }
    public async Task<LookDetailsDto?> GetByIdAsync(int id)
    {
       
        var look = await _context.Looks
            .Where(l => l.Id == id)
            .Select(l => new LookDetailsDto
            {
                Id = l.Id,
                Name = l.Name,
                Mood = l.Mood,
                Description = l.Description,
                CreatingDate = l.CreatingDate,
                Items = new List<LookItemDto>() 
            })
            .FirstOrDefaultAsync();

        if (look is null) return null;

        
        var items = await _context.LookProducts
            .Where(lp => lp.LookId == id)
            .Select(lp => new LookItemDto
            {
                ProductId = lp.ProductId,
                Name = lp.Product.Name,
                Brand = lp.Product.Brand,
                Category = lp.Product.Category,
                Country = lp.Product.Country,
                Price = lp.Product.Price,
                UsageNote = lp.UsageNote,
                Rating = lp.Rating
            })
            .ToListAsync();

        look.Items = items;

        return look;
    }
}