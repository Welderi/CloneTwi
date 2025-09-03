namespace CloneTwiAPI.Models
{
    public class Notification
    {
        public int NotificationId { get; set; }

        public string NotificationUserId { get; set; } = null!;

        public string Type { get; set; } = null!;

        public int? RepostId { get; set; }
        public Repost? Repost { get; set; }

        public int? FollowId { get; set; }
        public FollowUser? Follow { get; set; }

        public int? EmojiId { get; set; }
        public EmojiMessage? Emoji { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }

}
