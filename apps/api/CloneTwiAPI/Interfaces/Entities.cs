namespace CloneTwiAPI.Interfaces
{
    public interface IUserEntity
    {
        string UserId { get; set; }
    }

    public interface IMessageEntity
    {
        int? MessageId { get; set; }
    }
}
