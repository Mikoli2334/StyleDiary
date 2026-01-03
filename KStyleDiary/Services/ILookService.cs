namespace KStyleDiary.Services;
using KStyleDiary.DTOs;

public interface ILookService
{
    public Task<LookDto> CreateAsync(CreateLookDto dto);
    public Task<bool> AddProductAsync(int lookId, AddProductToLookDto dto);
    public Task<LookDetailsDto?> GetByIdAsync(int id);
}