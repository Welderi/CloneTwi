using AutoMapper;
using CloneTwiAPI.DTOs;
using CloneTwiAPI.Models;
using CloneTwiAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace CloneTwiAPI.Controllers.DbControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessageController : GenericController<MessageDTO, Message>
    {
        public MessageController(CloneTwiContext context, UserGetter userGetter, IMapper mapper)
            : base(context, userGetter, mapper)
        {
        }

        [HttpPost("addmessage")]
        public async Task<IActionResult> Add([FromBody] MessageDTO dto)
        {
            var result = await AddAsync(dto, name: "Message", userBool: true, messageId: null);
            return Ok(result);
        }

        [HttpGet("getmessages")]
        public async Task<ActionResult<IEnumerable<MessageDTO>>> GetAllMessagesAsync()
        {
            try
            {
                return await GetAllAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}
