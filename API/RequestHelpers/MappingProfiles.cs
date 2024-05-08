using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Models;
using API.Models.Enums;
using AutoMapper;

namespace API.RequestHelpers
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            //TODO: this is a mess

            CreateMap<CreateImageDto, Image>()
            .ForMember(dest => dest.Tags, opt => opt.MapFrom(src => src.Tags.Select(t => new Tag { Name = t })));

            CreateMap<Image, GetImageDto>()
               .ForMember(dest => dest.Tags, opt => opt.MapFrom(src => src.Tags.Select(t => t.Name)))
                .ForMember(dest => dest.ImageState, opt => opt.MapFrom(src => src.State));

            CreateMap<Image, GetImagesDto>()
               .ForMember(dest => dest.Tags, opt => opt.MapFrom(src => src.Tags.Select(t => t.Name)))
                .ForMember(dest => dest.ImageState, opt => opt.MapFrom(src => src.State));


            CreateMap<UpdateImageDto, Image>()
            .ForMember(dest => dest.Tags, opt => opt.MapFrom(src => src.Tags.Select(t => new Tag { Name = t })));

            CreateMap<Tag, GetTagDto>();
            CreateMap<User, GetUserDto>();

            CreateMap<UpdateImageDto, Image>();

            CreateMap<CreateImageCommentDto, ImageComment>();
            CreateMap<ImageComment, GetImageCommentDto>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.UserName));

            CreateMap<EditUserDto, User>();

            CreateMap<ProfileComment, GetProfileCommentsDto>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.UserName));



        }
    }
}