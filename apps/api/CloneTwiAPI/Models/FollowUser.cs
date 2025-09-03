using System.ComponentModel.DataAnnotations.Schema;

namespace CloneTwiAPI.Models;

public partial class FollowUser
{
    public int FollowId { get; set; }

    [ForeignKey(nameof(Follower))]
    public string FollowerUserId { get; set; } = null!;
    public ApplicationUser Follower { get; set; } = null!;

    [ForeignKey(nameof(Following))]
    public string FollowingUserId { get; set; } = null!;
    public ApplicationUser Following { get; set; } = null!;
    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();
}
