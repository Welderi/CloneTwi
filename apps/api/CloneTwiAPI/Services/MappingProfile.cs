using AutoMapper;
using CloneTwiAPI.DTOs;
using CloneTwiAPI.Models;

namespace CloneTwiAPI.Services
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Message, MessageDTO>()
                    .ForMember(dest => dest.Parents, opt => opt.MapFrom(src => src.InverseMessageParent))
                    .ReverseMap();

        }
    }
}
