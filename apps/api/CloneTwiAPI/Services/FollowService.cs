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
        private readonly NotificationService _service;

        public FollowService(CloneTwiContext context, UserGetter userGetter,
                             IHubContext<FollowHub> hub, NotificationService service)
        {
            _context = context;
            _hub = hub;
            _service = service;

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

                await _context.SaveChangesAsync();

                await _service.AddNotification(userId: followedUser.Id,
                                               followId: followEntity.FollowId);
            }
            else
            {
                var existingFollow = await _context.FollowUsers
                                                   .FirstOrDefaultAsync(f =>
                                                   f.FollowerUserId == _currentUser.Id &&
                                                   f.FollowingUserId == followedUser!.Id);

                if (existingFollow != null)
                {
                    _context.FollowUsers.Remove(existingFollow);

                    var notifications = _context.Notifications.Where(n => n.FollowId == existingFollow.FollowId);
                    _context.Notifications.RemoveRange(notifications);
                }

                await _context.SaveChangesAsync();
            }

            var count = await GetCountofFollowers(followedUser.Id);

            var userData = new
            {
                FollowerUserId = _currentUser.Id,
                FollowerUserName = _currentUser.UserName,
                FollowingUserId = followedUser.Id,
                FollowingUserName = followedUser.UserName,
                FollowingProfileImageUrl = followedUser.ProfileImageUrl,
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
        public async Task<int> GetCountofFollowing(string? userId = null)
        {
            if (userId == null)
                userId = _currentUser.Id;

            return await _context.FollowUsers
                                      .AsNoTracking()
                                      .CountAsync(u => u.FollowerUserId == userId);
        }


    }
}
