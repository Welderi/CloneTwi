using CloneTwiAPI.DTOs;
using CloneTwiAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CloneTwiAPI.Services
{
    public class MessageService : GenericService<MessageDTO, Message>
    {
        public MessageService(CloneTwiContext context, UserGetter userGetter)
            : base(context, userGetter)
        {
        }

        public async Task<IActionResult> AddMessageAsync(MessageDTO dto)
        {
            var message = await MessageAutoMapper.ToEntity(dto);
            var result = await AddAsync(dto, userBool: true, entity: message);

            // Video | Image

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

            return new OkObjectResult(result);
        }

        public async Task<IActionResult> AddParentAsync(MessageDTO dto)
        {
            var result = await AddAsync(dto, userBool: true, messageId: dto.MessageParentId,
                                        entity: await MessageAutoMapper.ToEntity(dto));
            return new OkObjectResult(result);
        }

        public async Task<bool> RemoveMessageAsync(MessageDTO dto)
        {
            return await RemoveAsync(dto, entity: await MessageAutoMapper.ToEntity(dto));
        }

        public async Task<ActionResult<IEnumerable<MessageDTO>>> GetGroupedMessagesAsync()
        {
            var entities = await _context.Set<Message>()
                .Include(m => m.InverseMessageParent)
                .Include(vm => vm.VideoMessages)
                .ToListAsync();

            var dtos = entities.Select(MessageAutoMapper.ToDto).ToList();

            return new OkObjectResult(dtos);
        }
    }
}
