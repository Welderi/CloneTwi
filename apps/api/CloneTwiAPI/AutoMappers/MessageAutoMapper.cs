using CloneTwiAPI.DTOs;
using CloneTwiAPI.Models;

namespace CloneTwiAPI
{
    public static class MessageAutoMapper
    {
        public static async Task<Message> ToEntity(MessageDTO dto)
        {
            var inverseMessageParents = dto.Parents != null
                                ? (await Task.WhenAll(dto.Parents.Select(ToEntity))).ToList()
                                : null;

            return new Message
            {
                MessageText = dto.MessageText,
                MessageUserId = dto.MessageUserId!,
                MessageParentId = dto.MessageParentId!,
                InverseMessageParent = inverseMessageParents!,
            };
        }

        public static MessageDTO ToDto(Message entity)
        {
            return new MessageDTO
            {
                MessageId = entity.MessageId,
                MessageText = entity.MessageText,
                MessageUserId = entity.MessageUserId,
                MessageParentId = entity.MessageParentId,
                Parents = entity.InverseMessageParent != null
                        ? entity.InverseMessageParent.Select(e => ToDto(e)).ToList()
                        : null,
                VideoMessagesTo = entity.VideoMessages.Select(e => e.VideoFile).ToList(),
                Emojis = entity.EmojiMessages
                              .GroupBy(e => e.EmojiValue)
                              .ToDictionary(g => g.Key, g => g.Count())
            };
        }
    }
}
