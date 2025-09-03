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

            var tasks = notifications.Select(async notification =>
            {
                ApplicationUser userEntity;

                if (notification.Follow != null)
                    userEntity = await _userGetter.FindById(notification.Follow.FollowerUserId);
                else if (notification.Repost != null)
                    userEntity = await _userGetter.FindById(notification.Repost.RepostUserId);
                else
                    userEntity = await _userGetter.FindById(notification.Emoji.EmojiUserId);

                var userDto = new UserDTO
                {
                    Id = userEntity.Id,
                    UserName = userEntity.UserName!,
                    ProfileImageUrl = userEntity.ProfileImageUrl
                };

                return NotificationAutoMapper.ToDto(notification, userDto);
            });

            return new OkObjectResult(await Task.WhenAll(tasks));
        }
    }
}
