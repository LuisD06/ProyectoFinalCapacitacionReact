using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Curso.ECommerce.Application.Dto;
using Curso.ECommerce.Domain.models;
using Curso.ECommerce.Domain.Models;

namespace Curso.ECommerce.Application.Map
{
    public class MapProfileConfiguration : Profile
    {
        public MapProfileConfiguration()
        {
            CreateMap<Brand, BrandDto>();
            CreateMap<BrandDto, Brand>();
            CreateMap<BrandCreateUpdateDto, Brand>();

            CreateMap<ProductTypeCreateUpdateDto, ProductType>();
            CreateMap<ProductType, ProductTypeDto>();

            CreateMap<Cart, CartDto>();
            CreateMap<CartItem, CartItemDto>();
            CreateMap<CartItemCreateUpdateDto, CartItem>();
            CreateMap<CartUpdateDto, Cart>();

            CreateMap<CreditCreateDto, Credit>();
            CreateMap<Credit, CreditDto>()
                .ForMember(c => c.Client, opt => opt.MapFrom(src => src.Client.Name));

            CreateMap<ClientCreateUpdateDto, Client>();
            CreateMap<Client, ClientDto>();

            CreateMap<ProductCreateUpdateDto, Product>();
            CreateMap<Product, ProductDto>()
                .ForMember(p => p.Brand, opt => opt.MapFrom(src => src.Brand.Name))
                .ForMember(p => p.ProductType, opt => opt.MapFrom(src => src.ProductType.Name));
            CreateMap<ProductDto, Product>()
                .ForMember(p => p.Brand, opt => opt.Ignore())
                .ForMember(p => p.ProductType, opt => opt.Ignore());

            CreateMap<OrderUpdateDto, Order>();
            CreateMap<Order, OrderDto>()
                .ForMember(o => o.Client, opt => opt.MapFrom(src => src.Client.Name));

            CreateMap<OrderItem, OrderItemDto>()
                .ForMember(o => o.Product, opt => opt.MapFrom(src => src.Product.Name));
        }
    }
}