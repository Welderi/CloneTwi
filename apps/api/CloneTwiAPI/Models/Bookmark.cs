using CloneTwiAPI.Attributes;

namespace CloneTwiAPI.Models;

public partial class Bookmark
{
    public int BookmarkId { get; set; }

    [MessageId]
    public int BookmarkMessageId { get; set; }

    [UserId]
    public string BookmarkUserId { get; set; } = null!;

    public virtual Message BookmarkMessage { get; set; } = null!;
}
