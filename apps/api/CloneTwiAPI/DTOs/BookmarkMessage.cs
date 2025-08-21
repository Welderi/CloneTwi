namespace CloneTwiAPI.DTOs
{
    public class BookmarkMessage
    {
        public IEnumerable<BookmarkDTO> Bookmarks { get; set; }
        public IEnumerable<MessageDTO> Messages { get; set; }
    }
}
