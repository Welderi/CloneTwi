using CloneTwiAPI.DTOs;
using CloneTwiAPI.Models;

namespace CloneTwiAPI.AutoMappers
{
    public static class FollowAutoMapper
    {
        public static FollowDTO ToDto(FollowUser entity)
        {
            return new FollowDTO
            {
                FollowerUserId = entity.FollowerUserId,
                FollowingUserId = entity.FollowingUserId,
            };
        }
    }

}
