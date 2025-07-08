using System;
using System.Collections.Generic;

namespace CloneTwiAPI.Models;

public partial class EmojiMessage
{
    public int EmojiId { get; set; }

    public string EmojiValue { get; set; } = null!;

    public int EmojiMessageId { get; set; }

    public virtual Message EmojiMessageNavigation { get; set; } = null!;
}
