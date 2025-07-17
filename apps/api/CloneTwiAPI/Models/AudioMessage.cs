﻿using CloneTwiAPI.Attributes;

namespace CloneTwiAPI.Models;

public partial class AudioMessage
{
    public int AudioId { get; set; }

    public string AudioFile { get; set; } = null!;

    [MessageId]
    public int AudioMessageId { get; set; }

    public virtual Message AudioMessageNavigation { get; set; } = null!;
}
