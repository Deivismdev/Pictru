using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.RequestHelpers;
using AutoMapper;

namespace API.tests
{
    public static class AutoMapperConfig
    {
        private static IMapper _mapper;

        public static IMapper GetMapper()
        {
            if (_mapper == null)
            {
                var config = new MapperConfiguration(cfg =>
                {
                    cfg.AddProfile<MappingProfiles>();
                });
                _mapper = config.CreateMapper();
            }

            return _mapper;
        }
    }
}