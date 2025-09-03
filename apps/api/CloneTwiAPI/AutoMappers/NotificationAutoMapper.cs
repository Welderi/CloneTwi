using CloneTwiAPI.DTOs;
using CloneTwiAPI.Models;

namespace CloneTwiAPI.AutoMappers
{
    public static class NotificationAutoMapper
    {
        public static NotificationDTO ToDto(Notification entity, UserDTO user) =>
            new NotificationDTO
            {
                User = user,
                Emoji = entity.Emoji != null ? EmojiAutoMapper.ToDto(entity.Emoji!) : null,
                Follow = entity.Follow ?? null,
                Repost = entity.Repost != null ? RepostAutoMapper.ToDto(entity.Repost!) : null,
            };
    }
}
