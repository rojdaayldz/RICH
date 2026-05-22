using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RichBackend.Models;

namespace RichBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FavoritesController : ControllerBase
    {
        private readonly RichContext _context;

        public FavoritesController(RichContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<FavoriteRequest>>> GetFavorites()
        {
            return await _context.Favorites.ToListAsync();
        }

        [HttpPost]
        public async Task<IActionResult> AddFavorite(FavoriteRequest fav)
        {
            _context.Favorites.Add(fav);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Favorilere eklendi!" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFavorite(int id)
        {
            var fav = await _context.Favorites.FindAsync(id);
            if (fav == null) return NotFound();

            _context.Favorites.Remove(fav);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Favorilerden silindi!" });
        }
    }
}