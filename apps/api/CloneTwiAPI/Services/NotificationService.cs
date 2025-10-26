using CloneTwiAPI.AutoMappers;
using CloneTwiAPI.DTOs;
using CloneTwiAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CloneTwiAPI.Services
{
    public class NotificationService
    {
        private readonly UserGetter _userGetter;
        private readonly CloneTwiContext _context;

        public NotificationService(UserGetter userGetter, CloneTwiContext context)
        {
            _userGetter = userGetter;
            _context = context;
        }

        public async Task<IActionResult> AddNotification(
             string userId,
             int? followId = null,
             int? repostId = null,
             int? emojiId = null)
        {
            string user = await _userGetter.GetUserId();

            if (user == userId)
                return new OkObjectResult("Success");

            var type = followId.HasValue ? "follow" :
                       repostId.HasValue ? "repost" :
                       emojiId.HasValue ? "like" :
                       "unknown";

            var notification = new Notification
            {
                NotificationUserId = userId,
                Type = type,
                RepostId = repostId,
                FollowId = followId,
                EmojiId = emojiId
            };

            await _context.Notifications.AddAsync(notification);
            await _context.SaveChangesAsync();

            return new OkObjectResult("Success");
        }

        public async Task<ActionResult<IEnumerable<NotificationDTO>>> GetAllNotifications()
        {
            var userId = await _userGetter.GetUserId();

            var notifications = await _context.Notifications
                .AsNoTracking()
                .Include(n => n.Follow)
                .Include(n => n.Repost)
                .Include(n => n.Emoji)
                .Where(u => u.NotificationUserId == userId)
                .ToListAsync();

            var userIds = notifications
                .Select(n => n.Follow?.FollowerUserId ?? n.Repost?.RepostUserId ?? n.Emoji?.EmojiUserId)
                .Where(id => id != null)
                .Distinct()
                .ToList();

            var users = await _context.Users
                .Where(u => userIds.Contains(u.Id))
                .ToDictionaryAsync(u => u.Id, u => u);

            var result = new List<NotificationDTO>();

            foreach (var notification in notifications)
            {
                var relatedUserId = notification.Follow?.FollowerUserId
                                    ?? notification.Repost?.RepostUserId
                                    ?? notification.Emoji?.EmojiUserId;

                if (relatedUserId == null || !users.TryGetValue(relatedUserId, out var userEntity))
                {
                    continue;
                }

                var userDto = new UserDTO
                {
                    Id = userEntity.Id,
                    UserName = userEntity.UserName!,
                    ProfileImageUrl = userEntity.ProfileImageUrl
                };

                result.Add(NotificationAutoMapper.ToDto(notification, userDto));
            }

            return new OkObjectResult(result);
        }

    }
}
