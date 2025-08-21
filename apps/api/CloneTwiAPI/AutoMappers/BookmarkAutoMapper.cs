using CloneTwiAPI.DTOs;
using CloneTwiAPI.Models;

namespace CloneTwiAPI.AutoMappers
{
    public static class BookmarkAutoMapper
    {
        public static Bookmark ToEntity(BookmarkDTO dto) =>
            new Bookmark
            {
                BookmarkMessageId = dto.MessageId
            };

        public static BookmarkDTO ToDto(Bookmark entity) =>
            new BookmarkDTO
            {
                BookmarkId = entity.BookmarkId,
                MessageId = entity.BookmarkMessageId
            };
    }
}
