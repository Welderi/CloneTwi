using System;
using System.Collections.Generic;

namespace CloneTwiAPI.Models;

public partial class Bookmark
{
    public int BookmarkId { get; set; }

    public int BookmarkMessageId { get; set; }

    public string BookmarkUserId { get; set; } = null!;

    public virtual Message BookmarkMessage { get; set; } = null!;
}
