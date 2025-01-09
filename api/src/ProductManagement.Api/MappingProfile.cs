using System;
using AutoMapper;
using Entities.Dto;
using Entities.Models;

namespace ProductManagement.Api;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Product, ProductDto>();
        CreateMap<ProductUpdateDto, Product>();
        CreateMap<ProductCreationDto, Product>();
    }
}
