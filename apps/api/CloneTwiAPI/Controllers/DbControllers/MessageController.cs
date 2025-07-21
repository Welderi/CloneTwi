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
        public async Task<IActionResult> Add([FromForm] MessageDTO dto)
        {
            var message = await MessageAutoMapper.ToEntity(dto);
            var result = await AddAsync(dto, userBool: true, entity: message);

            if (dto.VideoMessages != null)
            {
                var videoEntities = new List<VideoMessage>();

                foreach (var vm in dto.VideoMessages)
                {
                    var videoPath = await UploadService.Upload("videoImages", vm);

                    var videoEntity = new VideoMessage
                    {
                        VideoFile = videoPath,
                        VideoMessageId = message.MessageId
                    };

                    videoEntities.Add(videoEntity);
                }

                await AddRangeAsync(videoEntities);
            }

            return Ok(result);
        }

        [HttpPost("addparentmessage")]
        public async Task<IActionResult> AddParent([FromBody] MessageDTO dto)
        {
            var result = await AddAsync(dto, userBool: true, messageId: dto.MessageParentId,
                                        entity: await MessageAutoMapper.ToEntity(dto));
            return Ok(result);
        }

        [HttpGet("getgroupedmessages")]
        public async Task<ActionResult<IEnumerable<MessageDTO>>> GetGroupedMessagesAsync()
        {
            var entities = await _context.Set<Message>()
                .Include(m => m.InverseMessageParent)
                .Include(vm => vm.VideoMessages)
                .ToListAsync();

            var dtos = entities.Select(MessageAutoMapper.ToDto).ToList();

            return Ok(dtos);
        }
    }
}
