namespace CloneTwiAPI.DTOs
{
    public class MessageDTO
    {
        public int MessageId { get; set; }
        public string? MessageText { get; set; }
        public bool IsStory { get; set; }
        public int? MessageParentId { get; set; }
        public string? MessageUserId { get; set; }
        public List<MessageDTO>? Parents { get; set; }

        // To Server
        public List<IFormFile>? VideoMessages { get; set; }
        public IFormFile? AudioMessage { get; set; }

        // To Client
        public List<string>? VideoMessagesTo { get; set; }
        public UserDTO? User { get; set; }
        public string? AudioMessageTo { get; set; }
        public List<string>? Themes { get; set; }
        public Dictionary<string, int>? Emojis { get; set; }
    }
}
