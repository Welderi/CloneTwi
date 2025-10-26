using CloneTwiAPI.AutoMappers;
using CloneTwiAPI.DTOs;
using CloneTwiAPI.Hubs;
using CloneTwiAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace CloneTwiAPI.Services
{
    public class EmojiService : GenericService<EmojiDTO, EmojiMessage>
    {
        private readonly IHubContext<PostHub> _hub;
        private readonly NotificationService _service;

        public EmojiService(CloneTwiContext context, UserGetter userGetter,
                            IHubContext<PostHub> hub, NotificationService service)
            : base(context, userGetter)
        {
            _hub = hub;
            _service = service;
        }
        private async Task<object> GetUserEmojisForMessage(int messageId, string? userId)
        {
            var message = await _context.Messages
                                        .Include(m => m.EmojiMessages)
                                        .FirstOrDefaultAsync(m => m.MessageId == messageId);

            var emojis = message.EmojiMessages
                                .GroupBy(e => e.EmojiValue)
                                .ToDictionary(g => g.Key, g => g.Count());

            object? userEmoji = null;

            if (!string.IsNullOrEmpty(userId))
            {
                var found = message.EmojiMessages
                                   .FirstOrDefault(e => e.EmojiUserId == userId);

                if (found != null)
                {
                    userEmoji = new
                    {
                        emojiId = found.EmojiId,
                        emojiType = found.EmojiValue,
                        messageId = messageId
                    };
                }
            }

            return new
            {
                messageId = messageId,
                emojis = emojis,
                emoji = userEmoji
            };
        }

        private async Task NotifyClientsEmojiUpdate(int messageId)
        {
            var allUsers = _userGetter.GetAllUsers().Select(u => u.Id).ToList();

            foreach (var userId in allUsers)
            {
                var data = await GetUserEmojisForMessage(messageId, userId);

                await _hub.Clients.User(userId)
                                  .SendAsync("updateEmojiForMessage", messageId, data);
            }
        }

        public async Task<IActionResult> AddEmojiAsync(EmojiDTO dto)
        {
            var result = await AddAsync(model: null, userBool: true,
                                        messageId: dto.MessageId,
                                        entity: EmojiAutoMapper.ToEntity(dto));

            var savedEmoji = (EmojiMessage)((OkObjectResult)result).Value!;

            await NotifyClientsEmojiUpdate(dto.MessageId);

            await _service.AddNotification(userId: savedEmoji.EmojiMessageNavigation.MessageUserId,
                                           emojiId: savedEmoji.EmojiId);

            return new OkObjectResult(EmojiAutoMapper.ToDto(savedEmoji));
        }

        public async Task<IActionResult> RemoveEmojiAsync(int emojiId)
        {
            var emoji = _context.EmojiMessages.FirstOrDefault(e => e.EmojiId == emojiId);
            if (emoji == null) return new NotFoundResult();

            var messageId = emoji.EmojiMessageId;

            var notifications = _context.Notifications.Where(n => n.EmojiId == emojiId);
            _context.Notifications.RemoveRange(notifications);

            var result = await RemoveAsync(entity: emoji);

            await NotifyClientsEmojiUpdate(messageId);

            return new OkObjectResult(result);
        }

        public async Task<IEnumerable<EmojiDTO>> GetAllEmojisForUser()
        {
            var user = await _userGetter.GetUser();

            var result = _context.EmojiMessages
                                 .AsNoTracking()
                                 .Where(u => u.EmojiUserId == user!.Id)
                                 .ToList()
                                 .Select(EmojiAutoMapper.ToDto);

            return result;
        }
    }
}
