using CloneTwiAPI.Attributes;

namespace CloneTwiAPI.Models;

public partial class View
{
    public int ViewId { get; set; }

    [MessageId]
    public int ViewMessageId { get; set; }

    [UserId]
    public string ViewUserId { get; set; } = null!;

    public virtual Message ViewMessage { get; set; } = null!;
}
