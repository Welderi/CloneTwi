using CloneTwiAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace CloneTwiAPI.Cache
{
    public class UserInterestCache
    {
        private readonly IMemoryCache _cache;
        private readonly CloneTwiContext _context;

        public UserInterestCache(IMemoryCache cache, CloneTwiContext context)
        {
            _cache = cache;
            _context = context;
        }

        public async Task<List<string>> GetInterestsAsync(string userId)
        {
            if (!_cache.TryGetValue(userId, out List<string> interests))
            {
                interests = await _context.Interests
                                          .AsNoTracking()
                                          .Where(i => i.InterestUserId == userId)
                                          .Select(i => i.InterestTopic)
                                          .ToListAsync();

                _cache.Set(userId, interests, TimeSpan.FromMinutes(1));
            }

            return interests;
        }
        public void Invalidate(string userId)
        {
            _cache.Remove(userId);
        }
    }
}
