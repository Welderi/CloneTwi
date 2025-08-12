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
        private readonly ApplicationUser _currentUser;
        private readonly IHubContext<FollowHub> _hub;

        public FollowService(CloneTwiContext context, UserGetter userGetter, IHubContext<FollowHub> hub)
        {
            _context = context;
            _hub = hub;

            _currentUser = userGetter.GetUser().GetAwaiter().GetResult()!;
        }

        public async Task<IActionResult> FollowOrUnfollow(string userId, bool isFollow)
        {
            var followedUser = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);

            if (isFollow)
            {
                var followEntity = new FollowUser
                {
                    Follower = _currentUser,
                    Following = followedUser!
                };

                await _context.FollowUsers.AddAsync(followEntity);
            }
            else
            {
                var existingFollow = await _context.FollowUsers
                                                   .FirstOrDefaultAsync(f =>
                                                   f.FollowerUserId == _currentUser.Id &&
                                                   f.FollowingUserId == followedUser!.Id);

                if (existingFollow != null)
                    _context.FollowUsers.Remove(existingFollow);
            }

            await _context.SaveChangesAsync();

            var count = await GetCountofFollowers(followedUser.Id);

            var userData = new
            {
                FollowerUserId = _currentUser.Id,
                FollowerUserName = _currentUser.UserName,
                FollowingUserId = followedUser.Id,
                FollowingUserName = followedUser.UserName,
                FollowersCount = count
            };

            await _hub.Clients.Users(_currentUser.Id).SendAsync("follow", userData);

            await _hub.Clients.Users(followedUser.Id).SendAsync("newfollower", userData);

            return new OkObjectResult(true);
        }

        public async Task<IActionResult> IsFollowed(string userId)
        {
            var isFollowed = await _context.FollowUsers
                                           .AsNoTracking()
                                           .AnyAsync(u =>
                                           u.FollowerUserId == _currentUser.Id &&
                                           u.FollowingUserId == userId);

            return new OkObjectResult(isFollowed);
        }

        public async Task<int> GetCountofFollowers(string? userId = null)
        {
            if (userId == null)
                userId = _currentUser.Id;

            return await _context.FollowUsers
                                      .AsNoTracking()
                                      .CountAsync(u => u.FollowingUserId == userId);
        }
    }
}
