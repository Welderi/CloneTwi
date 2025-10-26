using Microsoft.AspNetCore.Identity;

namespace CloneTwiAPI.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string? ProfileImageUrl { get; set; }
        public string? Bio { get; set; }
        public string? Title { get; set; }
        public string? ExtraUserId { get; set; }
        public string? Background { get; set; }
        public ICollection<FollowUser> Follower { get; set; } = new List<FollowUser>();
        public ICollection<FollowUser> Following { get; set; } = new List<FollowUser>();
        public ICollection<ApplicationUser?> ExtraUser { get; set; } = new List<ApplicationUser?>();
        public ICollection<Interest> Interests { get; set; } = new List<Interest>();
    }
}
