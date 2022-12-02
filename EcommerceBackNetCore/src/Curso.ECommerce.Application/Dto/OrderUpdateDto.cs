using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Curso.ECommerce.Domain.Models;

namespace Curso.ECommerce.Application.Dto
{
    public class OrderUpdateDto
    {
        public string? Notes { get; set; }
    }
}