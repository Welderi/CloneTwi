using CloneTwiAPI.Attributes;

namespace CloneTwiAPI.Models
{
    public class Interest
    {
        public int InterestId { get; set; }
        public string InterestTopic { get; set; } = string.Empty;
        [UserId]
        public string InterestUserId { get; set; } = null!;
        public ApplicationUser User { get; set; } = null!;
    }
}
