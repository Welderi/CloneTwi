using System;
using System.Collections.Generic;

namespace CloneTwiAPI.Models;

public partial class ThemeMessage
{
    public int ThemeId { get; set; }

    public string ThemeType { get; set; } = null!;

    public int ThemeMessageId { get; set; }

    public virtual Message ThemeMessageNavigation { get; set; } = null!;
}
