using Microsoft.AspNetCore.Mvc;
using RichBackend.Models;

namespace RichBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        private readonly RichContext _context;

        public PaymentsController(RichContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> ProcessPayment(PaymentRequest payment)
        {
            // Madde 1: 16 hane kontrolü backend tarafında da yapılabilir
            if (payment.CardNumber.Replace(" ", "").Length != 16)
            {
                return BadRequest(new { message = "Kart numarası 16 hane olmalıdır!" });
            }

            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Ödeme başarıyla alındı. Siparişiniz hazırlanıyor!" });
        }
    }
}