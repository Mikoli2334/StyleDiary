using KStyleDiary.DTOs;

namespace KStyleDiary.Services;

public interface ILookService
{
    // PUBLIC (guest allowed)
    Task<IEnumerable<LookDto>> GetPublicAsync(int? page = null, int? pageSize = null);
    Task<LookDetailsDto?> GetPublicByIdAsync(int id);

    // MY (auth required)
    Task<IEnumerable<LookDto>> GetMineAsync(int ownerId, int? page = null, int? pageSize = null);
    Task<LookDetailsDto?> GetMineByIdAsync(int ownerId, int id);

    Task<LookDto> CreateAsync(CreateLookDto dto, int ownerId);
    Task<bool> UpdateAsync(int ownerId, int id, UpdateLookDto dto);
    Task<bool> DeleteAsync(int ownerId, int id);

    Task<bool> AddProductAsync(int ownerId, int lookId, AddProductToLookDto dto);
    Task<bool> RemoveProductAsync(int ownerId, int lookId, int productId);
}