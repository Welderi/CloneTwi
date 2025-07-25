using CloneTwiAPI.Attributes;

namespace CloneTwiAPI.Models;

public partial class EmojiMessage
{
    public int EmojiId { get; set; }

    public string EmojiValue { get; set; } = null!;

    [UserId]
    public string EmojiUserId { get; set; }

    [MessageId]
    public int EmojiMessageId { get; set; }

    public virtual Message EmojiMessageNavigation { get; set; } = null!;
}
