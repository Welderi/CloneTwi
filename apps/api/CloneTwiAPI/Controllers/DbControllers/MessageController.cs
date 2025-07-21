using CloneTwiAPI.DTOs;
using CloneTwiAPI.Services;
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

        [HttpPost("addmessage")]
        public async Task<IActionResult> AddAsync([FromForm] MessageDTO dto)
        {
            return await _service.AddMessageAsync(dto);
        }

        [HttpPost("addparentmessage")]
        public async Task<IActionResult> AddParentAsync([FromBody] MessageDTO dto)
        {
            return await _service.AddParentAsync(dto);
        }

        [HttpDelete("removemessage")]
        public async Task<bool> RemoveAsync([FromBody] MessageDTO dto)
        {
            return await _service.RemoveAsync(dto);
        }

        [HttpGet("getgroupedmessages")]
        public async Task<ActionResult<IEnumerable<MessageDTO>>> GetGroupedMessagesAsync()
        {
            return await _service.GetGroupedMessagesAsync();
        }
    }
}
