using CloneTwiAPI.DTOs;
using CloneTwiAPI.Hubs;
using CloneTwiAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace CloneTwiAPI.Services
{
    public class MessageService : GenericService<MessageDTO, Message>
    {
        private readonly IHubContext<PostHub> _hub;
        public MessageService(CloneTwiContext context, UserGetter userGetter, IHubContext<PostHub> hub)
            : base(context, userGetter)
        {
            _hub = hub;
        }

        public async Task<IActionResult> AddMessageAsync(MessageDTO dto)
        {
            var message = await MessageAutoMapper.ToEntity(dto);
            var result = await AddAsync(dto, userBool: true, entity: message);

            var savedMessage = (Message)((OkObjectResult)result).Value!;

            var newDto = MessageAutoMapper.ToDto(savedMessage);

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

            await _hub.Clients.All.SendAsync("messages", savedMessage);

            return new OkObjectResult(newDto);
        }

        public async Task<IActionResult> AddParentAsync(MessageDTO dto)
        {
            var result = await AddAsync(dto, userBool: true, messageId: dto.MessageParentId,
                                        entity: await MessageAutoMapper.ToEntity(dto));

            await _hub.Clients.All.SendAsync("messages", result);

            return new OkObjectResult(result);
        }

        public async Task<bool> RemoveMessageAsync(MessageDTO dto)
        {
            return await RemoveAsync(entity: await MessageAutoMapper.ToEntity(dto));
        }

        public async Task<ActionResult<IEnumerable<MessageDTO>>> GetGroupedMessagesAsync()
        {
            var entities = await _context.Set<Message>()
                .Include(m => m.InverseMessageParent)
                .Include(vm => vm.VideoMessages)
                .Include(l => l.EmojiMessages)
                .ToListAsync();

            var dtos = entities.Select(MessageAutoMapper.ToDto).ToList();

            return new OkObjectResult(dtos);
        }
    }
}
