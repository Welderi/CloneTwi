using CloneTwiAPI.AutoMappers;
using CloneTwiAPI.Cache;
using CloneTwiAPI.DTOs;
using CloneTwiAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CloneTwiAPI.Services
{
    public class InterestService : GenericService<InterestDTO, Interest>
    {
        private readonly UserInterestCache _userInterestCache;
        public InterestService(CloneTwiContext context, UserGetter userGetter, UserInterestCache userInterestCache)
            : base(context, userGetter)
        {
            _userInterestCache = userInterestCache;
        }

        public async Task<IActionResult> AddInterest(InterestDTO dto)
        {
            var user = _userGetter.GetUserId().Result;

            var result = await AddAsync(model: null, userBool: true,
                                        messageId: null,
                                        entity: InterestAutoMapper.ToEntity(dto));

            var savedInterest = (Interest)((OkObjectResult)result).Value!;

            _userInterestCache.Invalidate(user);

            return new OkObjectResult(InterestAutoMapper.ToDto(savedInterest));
        }

        public async Task<IActionResult> AddRangeInterests(List<InterestDTO> dtos)
        {
            var user = _userGetter.GetUserId().Result;

            var entities = dtos.Select(InterestAutoMapper.ToEntity).ToList();

            foreach (var e in entities)
            {
                e.InterestUserId = user;
            }

            await AddRangeAsync<Interest>(entities);

            _userInterestCache.Invalidate(_userGetter.GetUser().Result!.Id);

            return new OkObjectResult(dtos);
        }

        public async Task<IActionResult> RemoveInterest(string topic)
        {
            var userId = _userGetter.GetUserId().Result;

            var interest = _context.Interests.FirstOrDefault(e => e.InterestUserId == userId &&
                                                                e.InterestTopic == topic);

            var result = await RemoveAsync(entity: interest!);

            _userInterestCache.Invalidate(userId);

            return new OkObjectResult(result);
        }

        public async Task<IEnumerable<InterestDTO>> GetAllInterestsForUser()
        {
            var user = _userGetter.GetUserId().Result;

            var result = _context.Interests
                                 .AsNoTracking()
                                 .Where(u => u.InterestUserId == user)
                                 .ToList()
                                 .Select(InterestAutoMapper.ToDto);

            return result;
        }

        public async Task<List<MessageDTO>> GetPostsByInterest()
        {
            var user = await _userGetter.GetUser();
            var interests = await _userInterestCache.GetInterestsAsync(user!.Id);

            var likedThemes = await _context.EmojiMessages
                .Join(_context.ThemeMessages,
                      e => e.EmojiMessageId,
                      t => t.ThemeMessageId,
                      (e, t) => new { e.EmojiUserId, t.ThemeType })
                .Where(x => x.EmojiUserId == user.Id)
                .GroupBy(x => x.ThemeType)
                .Select(g => new { Theme = g.Key, Count = g.Count() })
                .Where(x => x.Count > 2)
                .Select(x => x.Theme)
                .ToListAsync();

            var allRelevantThemes = interests.Union(likedThemes).ToList();

            var messages = await _context.Messages
                .Include(m => m.InverseMessageParent)
                .Include(m => m.VideoMessages)
                .Include(m => m.EmojiMessages)
                .Include(m => m.ThemeMessages)
                .Include(a => a.AudioMessages)
                .Where(m => m.ThemeMessages.Any(t => allRelevantThemes.Contains(t.ThemeType)))
                .ToListAsync();

            var dtos = messages.Select(MessageAutoMapper.ToDto).ToList();
            return dtos;
        }
    }
}
