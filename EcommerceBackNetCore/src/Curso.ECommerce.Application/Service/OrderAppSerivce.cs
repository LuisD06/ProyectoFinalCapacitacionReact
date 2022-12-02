using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using AutoMapper;
using Curso.ECommerce.Application.Dto;
using Curso.ECommerce.Application.Models;
using Curso.ECommerce.Domain.enums;
using Curso.ECommerce.Domain.Models;
using Curso.ECommerce.Domain.Repository;
using FluentValidation;
using Microsoft.Extensions.Configuration;

namespace Curso.ECommerce.Application.Service
{
    public class OrderAppSerivce : IOrderAppService
    {
        private readonly IOrderRepository repository;
        private readonly IProductAppService productService;
        private readonly IMapper mapper;
        private readonly IValidator<OrderCreateDto> orderCreateValidator;
        private readonly IValidator<OrderItemCreateUpdateDto> orderItemCUDtoValidator;
        private readonly IConfiguration configuration;

        public OrderAppSerivce(
            IOrderRepository repository,
            IProductAppService productService,
            IMapper mapper,
            IValidator<OrderCreateDto> orderCreateValidator,
            IValidator<OrderItemCreateUpdateDto> orderItemCUDtoValidator,
            IConfiguration configuration
        )
        {
            this.orderCreateValidator = orderCreateValidator;
            this.orderItemCUDtoValidator = orderItemCUDtoValidator;
            this.configuration = configuration;
            this.productService = productService;
            this.mapper = mapper;
            this.repository = repository;
        }

        public async Task<OrderDto> CreateAsync(OrderCreateDto order)
        {

            // Validaciones
            var validationResult = await orderCreateValidator.ValidateAsync(order);
            if (!validationResult.IsValid)
            {
                var listaErrores = validationResult.Errors.Select(
                    e => e.ErrorMessage
                );
                var errorString = string.Join(" - ", listaErrores);
                throw new ArgumentException(errorString);
            }

            var itemsError = string.Empty;
            foreach (var item in order.OrderItems)
            {
                var itemValidation = await orderItemCUDtoValidator.ValidateAsync(item);
                if (!itemValidation.IsValid)
                {
                    var itemErrorList = itemValidation.Errors.Select(e => e.ErrorMessage);
                    var itemErrorString = string.Join(" - ", itemErrorList);
                    itemsError += itemErrorString;
                }
            }
            if (!string.IsNullOrEmpty(itemsError))
            {
                throw new ArgumentException(itemsError);
            }



            // Stock del producto
            var productIdList = order.OrderItems.Select(i => i.ProductId);
            var itemProductList = await productService.GetAllByIdAsync(productIdList.ToList());
     
            if (itemProductList.Count == 0)
            {
                throw new ArgumentException("Ninguno de los productos registrados en esta orden existen");
            }

            Order orderEntity = new Order();
            string notes = String.Empty;
            // Obtención del impuesto a aplicar
            var tax = configuration.GetValue<decimal>("ProductTax");
            decimal totalTax = 1 + tax / 100;
            // Creacion de la orden
            foreach (var product in itemProductList)
            {
                long quantity = order.OrderItems.Where(i => i.ProductId == product.Id).Select(i => i.Quantity).SingleOrDefault();
                if (product.Stock == 0)
                {
                    notes += $"El producto {product.Name} no tiene existencias";
                    // Si el producto no tiene stock se recomienda otro del mismo tipo
                    var productDtoList = await productService.GetAllByTypeAsync(product.ProductType, product.Id);
                    if (productDtoList.Count > 0)
                    {
                        notes += $"Producto similar: {productDtoList.ElementAt(0).Name}";
                    }
                }
                else
                {
                    if (product.Stock < quantity)
                    {
                        notes += $"Existencias insuficientes del producto: {product.Name}";
                        quantity = (long)product.Stock;
                    }
                    OrderItem orderItem = new OrderItem();
                    orderItem.ProductId = product.Id;
                    orderItem.Price = product.HasTax ? product.Price * totalTax : product.Price;
                    orderItem.Quantity = quantity;
                    orderItem.Notes = order.OrderItems.Where(i => i.ProductId == product.Id).Select(i => i.Notes).SingleOrDefault();
                    orderEntity.AddOrderItem(orderItem);
                }
            }
            if (orderEntity.OrderItems.Count == 0)
            {
                throw new ArgumentException("No se ha podido crear la orden, productos no disponibles");
            }
            orderEntity.ClientId = order.ClientId;
            orderEntity.Status = OrderStatus.Registered;
            orderEntity.Date = order.Date;
            orderEntity.Notes = notes;
            
            //Aplicacion de impuestos en caso de que el producto aplique
            orderEntity.Total = orderEntity.OrderItems.Sum(x => x.Price * x.Quantity);


            // Persistencia del objeto
            orderEntity = await repository.AddAsync(orderEntity);
            await repository.UnitOfWork.SaveChangesAsync();

            var orderDto = await GetByIdAsync(orderEntity.Id);

            // Confirmacion de la orden
            await ConfirmOrder(orderEntity);

            return orderDto;

        }

        private async Task ConfirmOrder(Order order)
        {
            // Proceso de confirmacion de la orden 
            var productIdList = order.OrderItems.Select(i => i.ProductId);
            var productList = await productService.GetAllByIdAsync(productIdList.ToList());
            // Actualizacion del stock de los productos
            foreach (var orderItem in order.OrderItems)
            {
                var productDto = productList.Where(p => p.Id == orderItem.ProductId).SingleOrDefault();
                var product = new ProductUpdateStockDto();
                product.Stock = (int?)(productDto.Stock - orderItem.Quantity);
                await productService.UpdateStockAsync(productDto.Id, product);

            }
            order.Status = OrderStatus.Processed;
            await repository.UpdateAsync(order);
            await repository.UnitOfWork.SaveChangesAsync();
            return;

        }

        public async Task<bool> DeleteAsync(Guid orderId)
        {
            //Reglas Validaciones... 
            var orderEntity = await repository.GetByIdAsync(orderId);
            if (orderEntity == null)
            {
                throw new ArgumentException($"La orden con el id: {orderId}, no existe");
            }

            orderEntity.Status = OrderStatus.Canceled;
            orderEntity.CancellationDate = DateTime.Now;

            await repository.UpdateAsync(orderEntity);
            await repository.UnitOfWork.SaveChangesAsync();

            return true;
        }

        public ICollection<OrderDto> GetAll()
        {
            var query = repository.GetAllIncluding(o => o.Client, o => o.OrderItems);
            var orderDtoList = query.Select(o => new OrderDto()
            {
                CancellationDate = o.CancellationDate,
                ClientId = o.ClientId,
                Client = o.Client.Name,
                Date = o.Date,
                Id = o.Id,
                Notes = o.Notes,
                Status = o.Status,
                Total = o.Total,
                OrderItems = o.OrderItems.Select(i => new OrderItemDto()
                {
                    Id = i.Id,
                    Notes = i.Notes,
                    OrderId = i.OrderId,
                    Price = i.Price,
                    Product = i.Product.Name,
                    ProductId = i.ProductId,
                    Quantity = i.Quantity
                }).ToList()
            });
            return orderDtoList.ToList();
        }

        public async Task UpdateAsync(Guid orderId, OrderUpdateDto order)
        {
            var orderEntity = await repository.GetByIdAsync(orderId);
            if (orderEntity == null)
            {
                throw new ArgumentException($"La orden con el id {orderId} no existe");
            }
            // Mapeo DTO => Entidad
            mapper.Map(order, orderEntity);

            await repository.UpdateAsync(orderEntity);
            await repository.UnitOfWork.SaveChangesAsync();

        }

        public async Task<OrderDto> GetByIdAsync(Guid orderId)
        {
            var query = repository.GetAllIncluding(o => o.Client, o => o.OrderItems);
            var orderQuery = query.Where(o => o.Id == orderId);

            if (orderQuery == null)
            {
                throw new ArgumentException($"No existe una orden con el id {orderId}");
            }

            var orderDto = orderQuery.Select(o => new OrderDto()
            {
                CancellationDate = o.CancellationDate,
                ClientId = o.ClientId,
                Client = o.Client.Name,
                Date = o.Date,
                Id = o.Id,
                Notes = o.Notes,
                Status = o.Status,
                Total = o.Total,
                OrderItems = o.OrderItems.Select(i => new OrderItemDto()
                {
                    Id = i.Id,
                    Notes = i.Notes,
                    OrderId = i.OrderId,
                    Price = i.Price,
                    Product = i.Product.Name,
                    ProductId = i.ProductId,
                    Quantity = i.Quantity

                }).ToList()
            }).SingleOrDefault();
            return orderDto;
        }
        public PaginatedList<OrderDto> GetAllPaginated(int limit, int offset)
        {
            var query = repository.GetAllIncluding(o => o.OrderItems, o => o.Client);
            var totalQuery = query.Count();
            if (limit > totalQuery) {
                limit = totalQuery;
            }
            // var orderDtoList = consulta.Skip(offset).Take(limit).Select(o => mapper.Map<OrderDto>(o));
            var orderDtoList = query.Skip(offset).Take(limit).Select(o => new OrderDto()
            {
                CancellationDate = o.CancellationDate,
                ClientId = o.ClientId,
                Client = o.Client.Name,
                Date = o.Date,
                Id = o.Id,
                Notes = o.Notes,
                Status = o.Status,
                Total = o.Total,
                OrderItems = o.OrderItems.Select(i => new OrderItemDto()
                {
                    Id = i.Id,
                    Notes = i.Notes,
                    OrderId = i.OrderId,
                    Price = i.Price,
                    Product = i.Product.Name,
                    ProductId = i.ProductId,
                    Quantity = i.Quantity
                }).ToList()
            });
            
            var result = new PaginatedList<OrderDto>();
            result.Total = orderDtoList.Count();
            result.List = orderDtoList.ToList();

            return result;
        }

        public List<OrderDto> GetByClientTotal(string identification, decimal minTotal = 0, decimal maxTotal = 0)
        {
            var orderQuery = repository.GetAllIncluding(o => o.Client, o => o.OrderItems);
            if (!string.IsNullOrEmpty(identification))
            {
                orderQuery = orderQuery.Where(o => 
                    o.Client.Identification.ToLower().Contains(identification.ToLower()) ||
                    o.Client.Identification.ToLower().StartsWith(identification.ToLower())
                );
            }
            if(maxTotal > minTotal) {
                orderQuery = orderQuery.Where(o => 
                    o.Total >= minTotal && o.Total <= maxTotal
                );
            }
            if(minTotal > 0 && maxTotal <= 0) {
                orderQuery = orderQuery.Where(o => 
                    o.Total >= minTotal
                );
            }
            var orderDtoList = orderQuery.Select(o => new OrderDto()
            {
                CancellationDate = o.CancellationDate,
                ClientId = o.ClientId,
                Client = o.Client.Name,
                Date = o.Date,
                Id = o.Id,
                Notes = o.Notes,
                Status = o.Status,
                Total = o.Total,
                OrderItems = o.OrderItems.Select(i => new OrderItemDto()
                {
                    Id = i.Id,
                    Notes = i.Notes,
                    OrderId = i.OrderId,
                    Price = i.Price,
                    Product = i.Product.Name,
                    ProductId = i.ProductId,
                    Quantity = i.Quantity
                }).ToList()
            });

            return orderDtoList.ToList();
        }
    }
}