using CloneTwiAPI.DTOs;
using CloneTwiAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CloneTwiAPI.Controllers.DbControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessageController
    {
        private readonly MessageService _service;

        public MessageController(MessageService service)
        {
            _service = service;
        }

        [Authorize]
        [HttpPost("addmessage/{isParent}")]
        public async Task<IActionResult> AddAsync([FromForm] MessageDTO dto, [FromRoute] bool isParent)
        => await _service.AddMessageAsync(dto, isParent);

        [Authorize]
        [HttpGet("getgroupedmessages/{userId?}")]
        public async Task<ActionResult<IEnumerable<MessageDTO>>> GetGroupedMessagesAsync([FromRoute] string? userId)
        => await _service.GetGroupedMessagesAsync(userId);

        [Authorize]
        [HttpGet("getuserstories/{userId?}")]
        public async Task<ActionResult<IEnumerable<MessageDTO>>> GetUserStories([FromRoute] string? userId)
        => await _service.GetUserStories(userId);

        [Authorize]
        [HttpGet("getstories")]
        public async Task<ActionResult<IEnumerable<MessageDTO>>> GetStories() => await _service.GetStories();
    }
}
