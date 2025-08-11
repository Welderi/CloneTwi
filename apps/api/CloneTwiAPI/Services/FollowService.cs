using CloneTwiAPI.Hubs;
using CloneTwiAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace CloneTwiAPI.Services
{
    public class FollowService
    {
        private readonly CloneTwiContext _context;
        private readonly UserGetter _userGetter;
        private readonly IHubContext<FollowHub> _hub;

        public FollowService(CloneTwiContext context, UserGetter userGetter, IHubContext<FollowHub> hub)
        {
            _context = context;
            _userGetter = userGetter;
            _hub = hub;
        }

        public async Task<IActionResult> FollowOrUnfollow(string userId, bool isFollow)
        {
            var currentUser = await _userGetter.GetUser();
            var followedUser = await _userGetter.GetUserById(userId);

            var followEntity = new FollowUser
            {
                Follower = currentUser!,
                Following = followedUser
            };

            if (isFollow)
                await _context.FollowUsers.AddAsync(followEntity);
            else
            {
                var existingFollow = await _context.FollowUsers
                    .FirstOrDefaultAsync(f => f.Follower == currentUser && f.Following == followedUser);
                if (existingFollow != null)
                {
                    _context.FollowUsers.Remove(existingFollow);
                }
            }

            await _context.SaveChangesAsync();

            await _hub.Clients.Users(new[] { currentUser!.Id, userId }).SendAsync("followmessage");

            return new OkObjectResult(true);
        }

        public async Task<IActionResult> IsFollowed(string userId)
        {
            var currentUser = await _userGetter.GetUser();
            var followedUser = await _userGetter.GetUserById(userId);

            var isFollowed = await _context.FollowUsers.AnyAsync(u =>
                u.FollowerUserId == currentUser!.Id && u.FollowingUserId == userId);

            Console.WriteLine($"+===============d {isFollowed} ++++++++++");

            return new OkObjectResult(isFollowed);
        }
    }
}
