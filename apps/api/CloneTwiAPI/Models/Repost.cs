using System;
using System.Collections.Generic;

namespace CloneTwiAPI.Models;

public partial class Repost
{
    public int RepostId { get; set; }

    public int RepostMessageId { get; set; }

    public string RepostUserId { get; set; } = null!;

    public virtual Message RepostMessage { get; set; } = null!;
}
