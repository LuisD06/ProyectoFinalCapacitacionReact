using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Curso.ECommerce.Application.Dto;

namespace Curso.ECommerce.Application.Service
{
    public class PaymentService : IPaymentService
    {
        
        public Task<OrderDto> ConfirmOrder(OrderUpdateDto order)
        {
            throw new NotImplementedException();
        }
    }
}