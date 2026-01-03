using KStyleDiary.DTOs;
using KStyleDiary.Services;
using Microsoft.AspNetCore.Mvc;

namespace KStyleDiary.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LooksController : ControllerBase
{
    private readonly ILookService _lookService;

    public LooksController(ILookService lookService)
    {
        _lookService = lookService;
    }

    // POST /api/Looks
    [HttpPost]
    public async Task<ActionResult<LookDto>> Create([FromBody] CreateLookDto dto)
    {
        try
        {
            var created = await _lookService.CreateAsync(dto);

            return CreatedAtAction(
                nameof(GetById),
                new { id = created.Id },
                created
            );
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    // POST /api/Looks/{lookId}/products
    [HttpPost("{lookId:int}/products")]
    public async Task<IActionResult> AddProduct(int lookId, [FromBody] AddProductToLookDto dto)
    {
        try
        {
            var ok = await _lookService.AddProductAsync(lookId, dto);

            if (!ok)
                return BadRequest("Cannot add product to look. Check lookId/productId or duplicate link.");

            return NoContent(); // 204
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    // GET /api/Looks/{id}
    [HttpGet("{id:int}")]
    public async Task<ActionResult<LookDetailsDto>> GetById(int id)
    {
        var look = await _lookService.GetByIdAsync(id);

        if (look is null)
            return NotFound();

        return Ok(look);
    }
}