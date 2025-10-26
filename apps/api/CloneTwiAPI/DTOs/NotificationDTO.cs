namespace CloneTwiAPI.DTOs
{
    public class NotificationDTO
    {
        public UserDTO User { get; set; } = null!;
        public RepostDTO? Repost { get; set; }
        public FollowDTO? Follow { get; set; }
        public EmojiDTO? Emoji { get; set; }
    }
}
