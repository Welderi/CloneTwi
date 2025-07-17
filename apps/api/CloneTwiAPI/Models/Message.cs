using CloneTwiAPI.Attributes;

namespace CloneTwiAPI.Models;

public partial class Message
{
    public int MessageId { get; set; }

    public string? MessageText { get; set; }

    public bool? MessageIsEdited { get; set; }

    [MessageId]
    public int? MessageParentId { get; set; }

    public int? MessagePreviousVersionId { get; set; }

    [UserId]
    public string MessageUserId { get; set; } = null!;

    public virtual ICollection<AudioMessage> AudioMessages { get; set; } = new List<AudioMessage>();

    public virtual ICollection<Bookmark> Bookmarks { get; set; } = new List<Bookmark>();

    public virtual ICollection<EmojiMessage> EmojiMessages { get; set; } = new List<EmojiMessage>();

    public virtual ICollection<Message> InverseMessageParent { get; set; } = new List<Message>();

    public virtual ICollection<Message> InverseMessagePreviousVersion { get; set; } = new List<Message>();

    public virtual Message? MessageParent { get; set; }

    public virtual Message? MessagePreviousVersion { get; set; }

    public virtual ICollection<Repost> Reposts { get; set; } = new List<Repost>();

    public virtual ICollection<ThemeMessage> ThemeMessages { get; set; } = new List<ThemeMessage>();

    public virtual ICollection<VideoMessage> VideoMessages { get; set; } = new List<VideoMessage>();

    public virtual ICollection<View> Views { get; set; } = new List<View>();
}
