using KStyleDiary.Data;
using KStyleDiary.DTOs;
using Microsoft.EntityFrameworkCore;

namespace KStyleDiary.Services;

public class LookService : ILookService
{
    private readonly AppDbContext _context;

    public LookService(AppDbContext context)
    {
        _context = context;
    }

    // ---------- PUBLIC FEED ----------

    public async Task<IEnumerable<LookDto>> GetPublicAsync(int? page = null, int? pageSize = null)
    {
        IQueryable<Models.Look> query = _context.Looks
            .AsNoTracking()
            .Where(l => l.IsPublic)
            .OrderByDescending(l => l.CreatingDate);

        if (page.HasValue && pageSize.HasValue && page > 0 && pageSize > 0)
        {
            query = query.Skip((page.Value - 1) * pageSize.Value).Take(pageSize.Value);
        }

        return await query.Select(l => new LookDto
        {
            Id = l.Id,
            Name = l.Name,
            Description = l.Description,
            Mood = l.Mood,
            CreatingDate = l.CreatingDate,
            IsPublic = l.IsPublic
        }).ToListAsync();
    }

    public async Task<LookDetailsDto?> GetPublicByIdAsync(int id)
    {
        // only public
        var look = await _context.Looks
            .AsNoTracking()
            .Where(l => l.Id == id && l.IsPublic)
            .Select(l => new LookDetailsDto
            {
                Id = l.Id,
                Name = l.Name,
                Mood = l.Mood,
                Description = l.Description,
                CreatingDate = l.CreatingDate,
                IsPublic = l.IsPublic,
                Items = new List<LookItemDto>()
            })
            .FirstOrDefaultAsync();

        if (look is null) return null;

        look.Items = await _context.LookProducts
            .AsNoTracking()
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

        return look;
    }

    // ---------- MY LOOKS ----------

    public async Task<IEnumerable<LookDto>> GetMineAsync(int ownerId, int? page = null, int? pageSize = null)
    {
        IQueryable<Models.Look> query = _context.Looks
            .AsNoTracking()
            .Where(l => l.OwnerId == ownerId)
            .OrderByDescending(l => l.CreatingDate);

        if (page.HasValue && pageSize.HasValue && page > 0 && pageSize > 0)
        {
            query = query.Skip((page.Value - 1) * pageSize.Value).Take(pageSize.Value);
        }

        return await query.Select(l => new LookDto
        {
            Id = l.Id,
            Name = l.Name,
            Description = l.Description,
            Mood = l.Mood,
            CreatingDate = l.CreatingDate,
            IsPublic = l.IsPublic
        }).ToListAsync();
    }

    public async Task<LookDetailsDto?> GetMineByIdAsync(int ownerId, int id)
    {
        var look = await _context.Looks
            .AsNoTracking()
            .Where(l => l.Id == id && l.OwnerId == ownerId)
            .Select(l => new LookDetailsDto
            {
                Id = l.Id,
                Name = l.Name,
                Mood = l.Mood,
                Description = l.Description,
                CreatingDate = l.CreatingDate,
                IsPublic = l.IsPublic,
                Items = new List<LookItemDto>()
            })
            .FirstOrDefaultAsync();

        if (look is null) return null;

        look.Items = await _context.LookProducts
            .AsNoTracking()
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

        return look;
    }

    // ---------- WRITE ACTIONS ----------

    public async Task<LookDto> CreateAsync(CreateLookDto dto, int ownerId)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
            throw new ArgumentException("Name is required");

        var entity = new Models.Look
        {
            Name = dto.Name.Trim(),
            Mood = dto.Mood?.Trim(),
            Description = dto.Description?.Trim(),
            OwnerId = ownerId,
            CreatingDate = DateTime.UtcNow,
            IsPublic = dto.IsPublic
        };

        _context.Looks.Add(entity);
        await _context.SaveChangesAsync();

        return new LookDto
        {
            Id = entity.Id,
            Name = entity.Name,
            Description = entity.Description,
            Mood = entity.Mood,
            CreatingDate = entity.CreatingDate,
            IsPublic = entity.IsPublic
        };
    }

    public async Task<bool> UpdateAsync(int ownerId, int id, UpdateLookDto dto)
    {
        var look = await _context.Looks.FirstOrDefaultAsync(l => l.Id == id && l.OwnerId == ownerId);
        if (look is null) return false;

        if (dto.Name != null)
        {
            var name = dto.Name.Trim();
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Name cannot be empty.");
            look.Name = name;
        }

        if (dto.Description != null) look.Description = dto.Description.Trim();
        if (dto.Mood != null) look.Mood = dto.Mood.Trim();

        if (dto.IsPublic.HasValue)
            look.IsPublic = dto.IsPublic.Value;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int ownerId, int id)
    {
        var look = await _context.Looks.FirstOrDefaultAsync(l => l.Id == id && l.OwnerId == ownerId);
        if (look is null) return false;

        _context.Looks.Remove(look);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> AddProductAsync(int ownerId, int lookId, AddProductToLookDto dto)
    {
        var lookExists = await _context.Looks.AnyAsync(l => l.Id == lookId && l.OwnerId == ownerId);
        if (!lookExists) return false;

        var productExists = await _context.Products.AnyAsync(p => p.Id == dto.ProductId);
        if (!productExists) return false;

        var linkExists = await _context.LookProducts.AnyAsync(lp => lp.LookId == lookId && lp.ProductId == dto.ProductId);
        if (linkExists) return false;

        _context.LookProducts.Add(new Models.LookProduct
        {
            LookId = lookId,
            ProductId = dto.ProductId,
            UsageNote = dto.UsageNote?.Trim(),
            Rating = dto.Rating
        });

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> RemoveProductAsync(int ownerId, int lookId, int productId)
    {
        var lookExists = await _context.Looks.AnyAsync(l => l.Id == lookId && l.OwnerId == ownerId);
        if (!lookExists) return false;

        var link = await _context.LookProducts
            .FirstOrDefaultAsync(lp => lp.LookId == lookId && lp.ProductId == productId);

        if (link is null) return false;

        _context.LookProducts.Remove(link);
        await _context.SaveChangesAsync();
        return true;
    }
}