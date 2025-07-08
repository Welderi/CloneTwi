using System;
using System.Collections.Generic;

namespace CloneTwiAPI.Models;

public partial class VideoMessage
{
    public int VideoId { get; set; }

    public string VideoFile { get; set; } = null!;

    public string? VideoPreview { get; set; }

    public int VideoMessageId { get; set; }

    public virtual Message VideoMessageNavigation { get; set; } = null!;
}
