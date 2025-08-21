using CloneTwiAPI.AutoMappers;
using CloneTwiAPI.DTOs;
using CloneTwiAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CloneTwiAPI.Services
{
    public class BookmarkService : GenericService<BookmarkDTO, Bookmark>
    {
        public BookmarkService(CloneTwiContext context, UserGetter userGetter)
            : base(context, userGetter)
        {
        }

        public async Task<IActionResult> AddBookmark(BookmarkDTO dto)
        {
            var result = await AddAsync(model: null, userBool: true,
                            messageId: dto.MessageId,
                            entity: BookmarkAutoMapper.ToEntity(dto));

            var savedBookmark = (Bookmark)((OkObjectResult)result).Value!;

            return new OkObjectResult(BookmarkAutoMapper.ToDto(savedBookmark));
        }

        public async Task<IActionResult> RemoveBookmark(int messageId)
        {
            var userId = _userGetter.GetUser().Result!.Id;

            var bookmark = _context.Bookmarks.FirstOrDefault(e => e.BookmarkMessageId == messageId &&
                                                                  e.BookmarkUserId == userId);
            if (bookmark == null) return new NotFoundResult();

            var result = await RemoveAsync(entity: bookmark);

            return new OkObjectResult(result);
        }

        public async Task<ActionResult<BookmarkMessage>> GetAllBookmarks()
        {
            var user = await _userGetter.GetUser();

            var bookmarks = await _context.Bookmarks
                .AsNoTracking()
                .Where(b => b.BookmarkUserId == user!.Id)
                .ToListAsync();

            var bookmarkDtos = bookmarks.Select(BookmarkAutoMapper.ToDto).ToList();

            var messageIds = bookmarks.Select(b => b.BookmarkMessageId).Distinct().ToList();

            var messages = await _context.Messages
                .AsNoTracking()
                .Where(m => messageIds.Contains(m.MessageId))
                .ToListAsync();

            var messageDtos = messages.Select(MessageAutoMapper.ToDto).ToList();

            return new OkObjectResult(new BookmarkMessage
            {
                Bookmarks = bookmarkDtos,
                Messages = messageDtos
            });
        }

        public async Task<IEnumerable<BookmarkDTO>> GetAllBookmarksForUser()
        {
            var user = await _userGetter.GetUser();

            var result = _context.Bookmarks
                                 .AsNoTracking()
                                 .Where(u => u.BookmarkUserId == user!.Id)
                                 .ToList()
                                 .Select(BookmarkAutoMapper.ToDto);

            return result;
        }
    }
}
