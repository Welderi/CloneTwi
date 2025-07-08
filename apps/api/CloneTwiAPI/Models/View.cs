using System;
using System.Collections.Generic;

namespace CloneTwiAPI.Models;

public partial class View
{
    public int ViewId { get; set; }

    public int ViewMessageId { get; set; }

    public string ViewUserId { get; set; } = null!;

    public virtual Message ViewMessage { get; set; } = null!;
}
