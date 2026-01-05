using KStyleDiary.DTOs;
using KStyleDiary.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

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

    private int GetUserId()
    {
        var id =
            User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub);

        if (string.IsNullOrWhiteSpace(id))
            throw new UnauthorizedAccessException("UserId claim missing.");

        return int.Parse(id);
    }

    // ---------- PUBLIC (guest allowed) ----------

    // GET /api/Looks/public?page=1&pageSize=20
    [HttpGet("public")]
    public async Task<ActionResult<IEnumerable<LookDto>>> GetPublic([FromQuery] int? page, [FromQuery] int? pageSize)
    {
        var looks = await _lookService.GetPublicAsync(page, pageSize);
        return Ok(looks);
    }

    // GET /api/Looks/public/{id}
    [HttpGet("public/{id:int}")]
    public async Task<ActionResult<LookDetailsDto>> GetPublicById(int id)
    {
        var look = await _lookService.GetPublicByIdAsync(id);
        if (look is null) return NotFound();
        return Ok(look);
    }

    // ---------- MY (auth required) ----------

    // GET /api/Looks/mine
    [Authorize]
    [HttpGet("mine")]
    public async Task<ActionResult<IEnumerable<LookDto>>> GetMine([FromQuery] int? page, [FromQuery] int? pageSize)
    {
        var ownerId = GetUserId();
        var looks = await _lookService.GetMineAsync(ownerId, page, pageSize);
        return Ok(looks);
    }

    // GET /api/Looks/mine/{id}
    [Authorize]
    [HttpGet("mine/{id:int}")]
    public async Task<ActionResult<LookDetailsDto>> GetMineById(int id)
    {
        var ownerId = GetUserId();
        var look = await _lookService.GetMineByIdAsync(ownerId, id);
        if (look is null) return NotFound();
        return Ok(look);
    }

    // POST /api/Looks
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<LookDto>> Create([FromBody] CreateLookDto dto)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var ownerId = GetUserId();
        var created = await _lookService.CreateAsync(dto, ownerId);
        return CreatedAtAction(nameof(GetMineById), new { id = created.Id }, created);
    }

    // PUT /api/Looks/{id}
    [Authorize]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateLookDto dto)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var ownerId = GetUserId();
        var ok = await _lookService.UpdateAsync(ownerId, id, dto);
        if (!ok) return NotFound();

        return NoContent();
    }

    // DELETE /api/Looks/{id}
    [Authorize]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var ownerId = GetUserId();
        var ok = await _lookService.DeleteAsync(ownerId, id);
        if (!ok) return NotFound();
        return NoContent();
    }

    // POST /api/Looks/{lookId}/products
    [Authorize]
    [HttpPost("{lookId:int}/products")]
    public async Task<IActionResult> AddProduct(int lookId, [FromBody] AddProductToLookDto dto)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var ownerId = GetUserId();
        var ok = await _lookService.AddProductAsync(ownerId, lookId, dto);
        if (!ok) return BadRequest("Cannot add product to look.");
        return NoContent();
    }

    // DELETE /api/Looks/{lookId}/products/{productId}
    [Authorize]
    [HttpDelete("{lookId:int}/products/{productId:int}")]
    public async Task<IActionResult> RemoveProduct(int lookId, int productId)
    {
        var ownerId = GetUserId();
        var ok = await _lookService.RemoveProductAsync(ownerId, lookId, productId);
        if (!ok) return NotFound();
        return NoContent();
    }
}