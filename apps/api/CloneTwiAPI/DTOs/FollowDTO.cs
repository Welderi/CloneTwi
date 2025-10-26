namespace CloneTwiAPI.DTOs
{
    public class FollowDTO
    {
        public string FollowerUserId { get; set; } = null!;
        public string FollowerUserName { get; set; } = null!;
        public string FollowingUserId { get; set; } = null!;
        public string FollowingUserName { get; set; } = null!;
    }

}
