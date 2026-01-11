using Microsoft.AspNetCore.Mvc;
using OrderService.Models;
using OrderService.DTOs;

namespace OrderService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private static readonly List<Order> _orders = new();

        [HttpPost]
        public IActionResult PlaceOrder([FromBody] OrderRequest request)
        {
            var order = new Order
            {
                Id = Guid.NewGuid(),
                QuoteId = request.QuoteId,
                DesignId = request.DesignId,
                SupplierName = request.SupplierName,
                Amount = request.Amount,
                Status = "Placed",
                OrderDate = DateTime.UtcNow
            };

            _orders.Add(order);

            return Ok(order);
        }

        [HttpGet]
        public IActionResult GetOrders()
        {
            return Ok(_orders);
        }

        [HttpPut("{id}/ship")]
        public IActionResult MarkAsShipped(Guid id)
        {
            var order = _orders.FirstOrDefault(o => o.Id == id);
            if (order == null) return NotFound();

            order.Status = "Shipped";

            return Ok(order);
        }
    }
}