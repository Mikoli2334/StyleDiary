
namespace KStyleDiary.Services;
using KStyleDiary.DTOs;
using KStyleDiary.Models;
public interface IProductService
{
   public Task<ProductDto?> GetByIdAsync(int id);
   public Task<IEnumerable<ProductDto>> GetAllAsync();
   public Task<ProductDto> CreateAsync(CreateProductDto dto);
}