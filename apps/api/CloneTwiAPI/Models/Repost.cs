using CloneTwiAPI.Attributes;

namespace CloneTwiAPI.Models;

public partial class Repost
{
    public int RepostId { get; set; }

    [MessageId]
    public int RepostMessageId { get; set; }

    [UserId]
    public string RepostUserId { get; set; } = null!;

    public virtual Message RepostMessage { get; set; } = null!;

    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();
}
