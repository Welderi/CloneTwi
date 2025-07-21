namespace CloneTwiAPI.DTOs
{
    public class MessageDTO
    {
        public int MessageId { get; set; }
        public string? MessageText { get; set; }
        public int? MessageParentId { get; set; }
        public string? MessageUserId { get; set; }

        public List<MessageDTO>? Parents { get; set; }
        public List<IFormFile>? VideoMessages { get; set; }
        public List<string>? VideoMessagesTo { get; set; }
    }
}
