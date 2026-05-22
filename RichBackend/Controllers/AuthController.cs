using Microsoft.AspNetCore.Mvc;
using RichBackend.Models;
using RichBackend.Services;

namespace RichBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private static readonly List<User> Users = new();
        private readonly IEventPublisher _eventPublisher;

        public AuthController(IEventPublisher eventPublisher)
        {
            _eventPublisher = eventPublisher;
        }

        [HttpPost("register")]
        public IActionResult Register(RegisterRequest request)
        {
            var existingUser = Users.FirstOrDefault(u => u.Email == request.Email);

            if (existingUser != null)
            {
                return BadRequest("Bu e-posta adresi zaten kayitli.");
            }

            var user = new User
            {
                Id = Users.Count + 1,
                FullName = request.FullName,
                Email = request.Email,
                Password = request.Password
            };

            Users.Add(user);
            _eventPublisher.Publish("user.registered", new
            {
                user.Id,
                user.FullName,
                user.Email
            });

            return Ok(new
            {
                message = "Kayit basarili.",
                userId = user.Id,
                fullName = user.FullName,
                email = user.Email
            });
        }

        [HttpPost("login")]
        public IActionResult Login(LoginRequest request)
        {
            var user = Users.FirstOrDefault(u =>
                u.Email == request.Email &&
                u.Password == request.Password);

            if (user == null)
            {
                return Unauthorized("E-posta veya sifre hatali.");
            }

            _eventPublisher.Publish("user.logged_in", new
            {
                user.Id,
                user.FullName,
                user.Email
            });

            return Ok(new
            {
                message = "Giris basarili.",
                userId = user.Id,
                fullName = user.FullName,
                email = user.Email
            });
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            _eventPublisher.Publish("user.logged_out", new
            {
                message = "User logout endpoint called"
            });

            return Ok(new { message = "Cikis basarili." });
        }

        [HttpDelete("delete/{id}")]
        public IActionResult DeleteAccount(int id)
        {
            var user = Users.FirstOrDefault(u => u.Id == id);

            if (user == null)
            {
                return NotFound("Kullanici bulunamadi.");
            }

            Users.Remove(user);
            _eventPublisher.Publish("user.deleted", new
            {
                user.Id,
                user.FullName,
                user.Email
            });

            return Ok(new { message = "Hesap silindi." });
        }
    }
}
