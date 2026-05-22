using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RichBackend.Models;

namespace RichBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AddressController : ControllerBase
    {
        private readonly RichContext _context;

        public AddressController(RichContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> PostAddress(AddressRequest address)
        {
            _context.Addresses.Add(address);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Adres başarıyla kaydedildi!" });
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AddressRequest>>> GetAddresses()
        {
            return await _context.Addresses.ToListAsync();
        }
    }
}