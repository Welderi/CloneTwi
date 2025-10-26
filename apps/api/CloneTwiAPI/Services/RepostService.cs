using CloneTwiAPI.AutoMappers;
using CloneTwiAPI.DTOs;
using CloneTwiAPI.Hubs;
using CloneTwiAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace CloneTwiAPI.Services
{
    public class RepostService : GenericService<RepostDTO, Repost>
    {
        private readonly IHubContext<PostHub> _hub;
        private readonly NotificationService _service;

        public RepostService(CloneTwiContext context, UserGetter userGetter,
            IHubContext<PostHub> hub, NotificationService service)
            : base(context, userGetter)
        {
            _hub = hub;
            _service = service;
        }

        public async Task<IActionResult> AddRepost(RepostDTO dto)
        {
            var result = await AddAsync(
                    model: null,
                    userBool: true,
                    messageId: dto.MessageId,
                    entity: RepostAutoMapper.ToEntity(dto)
                );

            var savedRepost = await _context.Reposts
                .Include(r => r.RepostMessage)
                .FirstAsync(r => r.RepostId == ((Repost)((OkObjectResult)result).Value!).RepostId);

            var newDto = MessageAutoMapper.ToDto(savedRepost.RepostMessage);

            await _service.AddNotification(userId: savedRepost.RepostMessage.MessageUserId,
                                           repostId: savedRepost.RepostId);

            return new OkObjectResult(RepostAutoMapper.ToDto(savedRepost));
        }

        public async Task<IActionResult> RemoveRepost(int messageId)
        {
            var userId = _userGetter.GetUser().Result!.Id;

            var repost = _context.Reposts.FirstOrDefault(e => e.RepostMessageId == messageId &&
                                                                  e.RepostUserId == userId);
            if (repost == null) return new NotFoundResult();

            var notifications = _context.Notifications.Where(n => n.RepostId == repost.RepostId);
            _context.Notifications.RemoveRange(notifications);

            var result = await RemoveAsync(entity: repost);

            return new OkObjectResult(result);
        }

        public async Task<ActionResult<RepostMessage>> GetAllRepostsForFollowers()
        {
            var follower = await _userGetter.GetUserId();

            var allFollowing = _context.FollowUsers
                .Where(u => u.FollowerUserId == follower)
                .Select(u => u.FollowingUserId);

            var users = _context.Users
                .Where(u => allFollowing.Contains(u.Id))
                .Select(u => u.Id);

            var reposts = await _context.Reposts
                .Where(u => users.Contains(u.RepostUserId))
                .ToListAsync();

            var messages = await _context.Messages
                .Include(m => m.User)
                .Include(m => m.VideoMessages)
                .Include(m => m.AudioMessages)
                .Include(m => m.EmojiMessages)
                .Include(m => m.ThemeMessages)
                .Include(m => m.InverseMessageParent)
                    .ThenInclude(p => p.User)
                .AsNoTracking()
                .Where(m => reposts.Select(r => r.RepostMessageId).Contains(m.MessageId))
                .ToListAsync();

            var repostDtos = reposts.Select(RepostAutoMapper.ToDto).ToList();
            var messageDtos = messages.Select(MessageAutoMapper.ToDto).ToList();

            return new OkObjectResult(new RepostMessage
            {
                Reposts = repostDtos,
                Messages = messageDtos
            });
        }


        public async Task<IEnumerable<RepostDTO>> GetAllRepostsForUser()
        {
            var user = await _userGetter.GetUser();

            var result = _context.Reposts
                                 .AsNoTracking()
                                 .Where(u => u.RepostUserId == user!.Id)
                                 .ToList()
                                 .Select(RepostAutoMapper.ToDto);

            return result;
        }
    }
}
