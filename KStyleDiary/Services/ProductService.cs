using KStyleDiary.Data;
using KStyleDiary.DTOs;
using KStyleDiary.Models;
using Microsoft.EntityFrameworkCore;

namespace KStyleDiary.Services;

public class ProductService:IProductService
{
    private readonly AppDbContext _context;

    public ProductService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<ProductDto?> GetByIdAsync(int id)
    {
        var product = await _context.Products
            .Where(p => p.Id == id)
            .Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Category = p.Category,
                Country = p.Country,
                Brand = p.Brand,
                Price = p.Price,

            })
            .FirstOrDefaultAsync();
        return product;
    }

    public async Task<ProductDto> CreateAsync(CreateProductDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
            throw new ArgumentException("Name is required.", nameof(dto));

        if (string.IsNullOrWhiteSpace(dto.Category))
            throw new ArgumentException("Category is required.", nameof(dto));
        
        var entity = new Models.Product
        {
            Name = dto.Name.Trim(),
            Brand = dto.Brand?.Trim(),
            Category = dto.Category.Trim(),
            Country = dto.Country?.Trim(),
            Price = dto.Price
        };

       
        _context.Products.Add(entity);
        await _context.SaveChangesAsync();
        return new ProductDto
        {
            Id = entity.Id,
            Name = entity.Name,
            Brand = entity.Brand,
            Category = entity.Category,
            Country = entity.Country,
            Price = entity.Price
            
        };

    }

    public async Task<IEnumerable<ProductDto>> GetAllAsync()
    {
        var products = await _context.Products.Select(p=>new ProductDto
        {
            Id = p.Id,
            Name = p.Name,
            Brand = p.Brand,
            Category = p.Category,
            Country = p.Country,
            Price = p.Price,
            
        }).ToListAsync();
        return products;
    }
    
   

}