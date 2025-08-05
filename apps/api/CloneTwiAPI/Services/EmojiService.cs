using CloneTwiAPI.AutoMappers;
using CloneTwiAPI.DTOs;
using CloneTwiAPI.Hubs;
using CloneTwiAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace CloneTwiAPI.Services
{
    public class EmojiService : GenericService<EmojiDTO, EmojiMessage>
    {
        private readonly IHubContext<EmojiHub> _hub;
        public EmojiService(CloneTwiContext context, UserGetter userGetter, IHubContext<EmojiHub> hub)
            : base(context, userGetter)
        {
            _hub = hub;
        }

        public async Task<IActionResult> AddEmojiAsync(EmojiDTO dto)
        {
            var result = await AddAsync(model: null, userBool: true,
                               messageId: dto.MessageId, entity: EmojiAutoMapper.ToEntity(dto));

            var savedEmoji = (EmojiMessage)((OkObjectResult)result).Value!;

            await _hub.Clients.All.SendAsync("emojis", savedEmoji);

            return new OkObjectResult(EmojiAutoMapper.ToDto(savedEmoji));
        }

        public async Task<IActionResult> RemoveEmojiAsync(int emojiId)
        {
            var emoji = _context.EmojiMessages.FirstOrDefault(e => e.EmojiId == emojiId);
            if (emoji == null) return new NotFoundResult();

            var result = await RemoveAsync(entity: emoji);

            await _hub.Clients.All.SendAsync("emojis", result);

            return new OkObjectResult(result);
        }

        public async Task<IEnumerable<EmojiDTO>> GetAllEmojisForUser()
        {
            var user = await _userGetter.GetUser();

            var result = _context.EmojiMessages
                .Where(u => u.EmojiUserId == user!.Id)
                .ToList()
                .Select(EmojiAutoMapper.ToDto);

            return result;
        }
    }
}
