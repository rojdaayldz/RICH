using Microsoft.AspNetCore.Mvc;

namespace RichBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new
        {
            status = "OK",
            service = "RichBackend",
            time = DateTime.UtcNow
        });
    }
}
