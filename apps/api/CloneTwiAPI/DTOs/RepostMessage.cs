namespace CloneTwiAPI.DTOs
{
    public class RepostMessage
    {
        public IEnumerable<RepostDTO> Reposts { get; set; }
        public IEnumerable<MessageDTO> Messages { get; set; }
    }
}
