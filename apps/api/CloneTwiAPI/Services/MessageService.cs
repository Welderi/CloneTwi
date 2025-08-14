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

        private async Task AddVideoOrImage(MessageDTO dto, Message message)
        {
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
        }

        public async Task AddTheme(MessageDTO dto, Message message)
        {
            if (dto.Themes != null)
            {
                var themeEntities = new List<ThemeMessage>();

                foreach (var theme in dto.Themes)
                {
                    var themeEntity = new ThemeMessage
                    {
                        ThemeType = theme,
                        ThemeMessageId = message.MessageId
                    };

                    themeEntities.Add(themeEntity);
                }

                await AddRangeAsync(themeEntities);
            }
        }

        public async Task<IActionResult> AddMessageAsync(MessageDTO dto, bool isParent)
        {
            var message = await MessageAutoMapper.ToEntity(dto);
            IActionResult? result = null;

            if (isParent)
                result = await AddAsync(dto, userBool: true, messageId: dto.MessageParentId, entity: message);
            else
                result = await AddAsync(dto, userBool: true, entity: message);

            var savedMessage = (Message)((OkObjectResult)result).Value!;

            // Video | Image

            await AddVideoOrImage(dto, savedMessage);

            // Themes

            await AddTheme(dto, savedMessage);

            var newDto = MessageAutoMapper.ToDto(savedMessage);

            await _hub.Clients.All.SendAsync("messages", newDto);

            return new OkObjectResult(newDto);
        }
        public async Task<bool> RemoveMessageAsync(MessageDTO dto)
        {
            return await RemoveAsync(entity: await MessageAutoMapper.ToEntity(dto));
        }
        public async Task<ActionResult<IEnumerable<MessageDTO>>> GetGroupedMessagesAsync(string? userId = null)
        {
            var query = _context.Set<Message>()
                                .AsNoTracking()
                                .Include(m => m.InverseMessageParent)
                                .Include(vm => vm.VideoMessages)
                                .Include(l => l.EmojiMessages)
                                .Include(t => t.ThemeMessages)
                                .AsQueryable();

            if (!string.IsNullOrEmpty(userId))
                query = query.Where(u => u.MessageUserId == userId);

            var entities = await query.ToListAsync();

            var dtos = entities.Select(MessageAutoMapper.ToDto).ToList();

            return new OkObjectResult(dtos);
        }
    }
}
