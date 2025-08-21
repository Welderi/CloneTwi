using CloneTwiAPI.Models;
using Microsoft.AspNetCore.Mvc;

namespace CloneTwiAPI.Services
{
    public class BookmarkService
    {
        private readonly CloneTwiContext _context;
        private readonly UserGetter _userGetter;
        public BookmarkService(CloneTwiContext context, UserGetter userGetter)
        {
            _context = context;
            _userGetter = userGetter;
        }

        public async Task<IActionResult> AddBookmark(int messageId)
        {
            var userId = _userGetter.GetUser().Result!.Id;

            var bookmark = new Bookmark
            {
                BookmarkUserId = userId,
                BookmarkMessageId = messageId
            };

            await _context.Bookmarks.AddAsync(bookmark);

            await _context.SaveChangesAsync();

            return new OkObjectResult("Success!");
        }

        public async Task<IActionResult> RemoveBookmark(int messageId)
        {
            var userId = _userGetter.GetUser().Result!.Id;

            var bookmark = _context.Bookmarks.FirstOrDefault(b => b.BookmarkUserId == userId &&
                                                                  b.BookmarkMessageId == messageId);

            _context.Bookmarks.Remove(bookmark!);

            await _context.SaveChangesAsync();

            return new OkObjectResult("Success!");
        }
    }
}
