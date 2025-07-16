using CloneTwiAPI.DTOs;
using CloneTwiAPI.Models;
using CloneTwiAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CloneTwiAPI.Controllers.DbControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessageController : GenericController<Message>
    {
        private readonly MessageService _messageService;
        public MessageController(CloneTwiContext context, MessageService messageService) : base(context)
        {
            _messageService = messageService;
        }

        [Authorize]
        [HttpPost("addmessage")]
        public async Task<IActionResult?> AddAsync([FromBody] MessageDTO model)
            => await _messageService.AddAsync(model);
    }
}
