
namespace KStyleDiary.Services;
using KStyleDiary.DTOs;
using KStyleDiary.Models;
public interface IProductService
{
   public Task<ProductDto?> GetByIdAsync(int id);
   Task<IEnumerable<ProductDto>> GetAllAsync(int? page = null, int? pageSize = null);
   public Task<ProductDto> CreateAsync(CreateProductDto dto);
   Task<ProductDto?> UpdateAsync(int id, UpdateProductDto dto);
   Task<bool> DeleteAsync(int id);
}