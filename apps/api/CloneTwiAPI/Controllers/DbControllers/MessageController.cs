using AutoMapper;
using CloneTwiAPI.DTOs;
using CloneTwiAPI.Models;
using CloneTwiAPI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
            var result = await AddAsync(dto, userBool: true);
            return Ok(result);
        }

        [HttpPost("addparentmessage")]
        public async Task<IActionResult> AddParent([FromBody] MessageDTO dto)
        {
            var result = await AddAsync(dto, userBool: true, messageId: dto.MessageParentId);
            return Ok(result);
        }

        [HttpGet("getmessages")]
        public async Task<ActionResult<IEnumerable<MessageDTO>>> GetAllMessagesAsync() => await GetAllAsync();

        [HttpGet("getgroupedmessages")]
        public async Task<ActionResult<IEnumerable<MessageDTO>>> GetGroupedMessagesAsync()
        {
            var entities = await _context.Set<Message>()
                .Include(m => m.InverseMessageParent)
                .ToListAsync();

            return Ok(_mapper.Map<IEnumerable<MessageDTO>>(entities));
        }
    }
}
