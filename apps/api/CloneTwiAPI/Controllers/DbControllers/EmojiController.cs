using CloneTwiAPI.DTOs;
using CloneTwiAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CloneTwiAPI.Controllers.DbControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmojiController
    {
        private readonly EmojiService _service;
        public EmojiController(EmojiService service)
        {
            _service = service;
        }

        [Authorize]
        [HttpPost("addemoji")]
        public async Task<IActionResult> AddAsync([FromBody] EmojiDTO dto)
        {
            return await _service.AddEmojiAsync(dto);
        }

        [Authorize]
        [HttpDelete("removeemoji")]
        public async Task<IActionResult> RemoveAsync([FromQuery] int emojiId)
        {
            var result = await _service.RemoveEmojiAsync(emojiId);
            return new OkObjectResult(result);
        }

        [Authorize]
        [HttpGet("allemojisforuser")]
        public async Task<ActionResult<IEnumerable<EmojiDTO>>> GetAllForUser()
        {
            var result = await _service.GetAllEmojisForUser();
            return new OkObjectResult(result);
        }

    }
}
