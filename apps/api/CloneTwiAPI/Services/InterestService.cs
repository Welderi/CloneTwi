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

            var allMessages = await _context.Messages
                .Include(m => m.User)
                .Include(m => m.VideoMessages)
                .Include(m => m.AudioMessages)
                .Include(m => m.EmojiMessages)
                .Include(m => m.ThemeMessages)
                .AsNoTracking()
                .ToListAsync();

            var lookup = allMessages.ToLookup(m => m.MessageParentId);

            List<MessageDTO> BuildTree(int? parentId)
            {
                return lookup[parentId]
                    .Select(m => new MessageDTO
                    {
                        MessageId = m.MessageId,
                        MessageText = m.MessageText,
                        MessageUserId = m.MessageUserId,
                        IsStory = m.IsStory,
                        MessageParentId = m.MessageParentId,

                        Parents = BuildTree(m.MessageId),

                        VideoMessagesTo = m.VideoMessages.Select(v => v.VideoFile).ToList(),
                        AudioMessageTo = m.AudioMessages.Select(v => new AudioMessageDTO
                        {
                            FilePath = v.AudioFile,
                            FileName = v.AudioName!
                        }).FirstOrDefault(),
                        Emojis = m.EmojiMessages
                                  .GroupBy(e => e.EmojiValue)
                                  .ToDictionary(g => g.Key, g => g.Count()),
                        User = m.User != null ? new UserDTO
                        {
                            Id = m.User.Id,
                            UserName = m.User.UserName,
                            ProfileImageUrl = m.User.ProfileImageUrl
                        } : null,
                        Themes = m.ThemeMessages.Select(t => t.ThemeType).ToList()
                    })
                    .ToList();
            }

            var result = BuildTree(null);

            if (allRelevantThemes.Any())
                result = result.Where(m => m.Themes.Any(t => allRelevantThemes.Contains(t)))
                               .ToList();

            return result;
        }
    }
}
