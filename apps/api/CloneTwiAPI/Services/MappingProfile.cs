using AutoMapper;

namespace CloneTwiAPI.Services
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            //CreateMap<Message, MessageDTO>()
            //        .ForMember(dest => dest.Parents, opt => opt.MapFrom(src => src.InverseMessageParent))
            //        .ForMember(dest => dest.VideoMessages, opt => opt.MapFrom(src => src.VideoMessages))
            //        .ReverseMap();

        }
    }
}
