using CloneTwiAPI.DTOs;
using CloneTwiAPI.Models;

namespace CloneTwiAPI.AutoMappers
{
    public static class InterestAutoMapper
    {
        public static Interest ToEntity(InterestDTO dto)
            => new Interest
            {
                InterestTopic = dto.Topic!,
            };

        public static InterestDTO ToDto(Interest entity)
            => new InterestDTO
            {
                Id = entity.InterestId,
                Topic = entity.InterestTopic
            };
    }
}
