using CloneTwiAPI.DTOs;
using CloneTwiAPI.Models;

namespace CloneTwiAPI.AutoMappers
{
    public static class EmojiAutoMapper
    {
        public static EmojiMessage ToEntity(EmojiDTO dto)
        {
            return new EmojiMessage
            {
                EmojiMessageId = dto.MessageId,
                EmojiValue = dto.EmojiType
            };
        }

        public static EmojiDTO ToDto(EmojiMessage entity)
        {
            return new EmojiDTO
            {
                EmojiId = entity.EmojiId,
                EmojiType = entity.EmojiValue,
                MessageId = entity.EmojiMessageId
            };
        }
    }
}
