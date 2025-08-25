using CloneTwiAPI.DTOs;
using CloneTwiAPI.Models;

namespace CloneTwiAPI.AutoMappers
{
    public static class RepostAutoMapper
    {
        public static Repost ToEntity(RepostDTO dto)
            => new Repost
            {
                RepostMessageId = dto.MessageId
            };

        public static RepostDTO ToDto(Repost entity)
            => new RepostDTO
            {
                MessageId = entity.RepostMessageId
            };
    }
}
