using Microsoft.AspNetCore.Mvc;
using RichBackend.Models;
using RichBackend.Services;

namespace RichBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IEventPublisher _eventPublisher;

        private static readonly List<Product> Products = new()
        {
            // KADIN
            new Product { Id = 1,  Name = "Elegant Lacivert Elbise",    Price = 1250, Image = "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600", Category = "kadin",    Stok = 5,  Renk = "Lacivert",    Beden = "M"  },
            new Product { Id = 2,  Name = "Siyah Midi Etek",            Price = 890,  Image = "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600", Category = "kadin",    Stok = 8,  Renk = "Siyah",       Beden = "S"  },
            new Product { Id = 3,  Name = "Beyaz Oversize Gömlek",      Price = 650,  Image = "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=600", Category = "kadin",    Stok = 12, Renk = "Beyaz",       Beden = "L"  },
            new Product { Id = 4,  Name = "Kahverengi Deri Ceket",      Price = 2800, Image = "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600", Category = "kadin",    Stok = 3,  Renk = "Kahverengi",  Beden = "M"  },
            new Product { Id = 5,  Name = "Krem Örgü Kazak",           Price = 780,  Image = "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600", Category = "kadin",    Stok = 6,  Renk = "Krem",        Beden = "S"  },
            new Product { Id = 6,  Name = "Bordo Kadife Blazer",        Price = 1650, Image = "https://images.unsplash.com/photo-1548549557-dbe9946621da?w=600", Category = "kadin",    Stok = 0,  Renk = "Bordo",       Beden = "M"  },

            // ERKEK
            new Product { Id = 7,  Name = "Klasik Siyah Deri Ceket",    Price = 2800, Image = "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=600", Category = "erkek",    Stok = 3,  Renk = "Siyah",       Beden = "L"  },
            new Product { Id = 8,  Name = "Lacivert Slim Fit Takım",    Price = 4200, Image = "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600", Category = "erkek",    Stok = 4,  Renk = "Lacivert",    Beden = "M"  },
            new Product { Id = 9,  Name = "Gri Oversize Hoodie",        Price = 750,  Image = "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600", Category = "erkek",    Stok = 15, Renk = "Gri",         Beden = "XL" },
            new Product { Id = 10, Name = "Beyaz Basic Tişört",         Price = 320,  Image = "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600", Category = "erkek",    Stok = 20, Renk = "Beyaz",       Beden = "M"  },
            new Product { Id = 11, Name = "Haki Kargo Pantolon",        Price = 980,  Image = "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600", Category = "erkek",    Stok = 7,  Renk = "Haki",        Beden = "L"  },
            new Product { Id = 12, Name = "Siyah Slim Fit Chino",       Price = 860,  Image = "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600", Category = "erkek",    Stok = 0,  Renk = "Siyah",       Beden = "M"  },

            // BEBEK
            new Product { Id = 13, Name = "Pamuklu Beyaz Tulum",        Price = 450,  Image = "https://images.unsplash.com/photo-1522771935878-3a0373d4fe84?w=600", Category = "bebek",    Stok = 10, Renk = "Beyaz",       Beden = "0-3 Ay"  },
            new Product { Id = 14, Name = "Sarı Örme Hırka",            Price = 380,  Image = "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600", Category = "bebek",    Stok = 8,  Renk = "Sarı",        Beden = "3-6 Ay"  },
            new Product { Id = 15, Name = "Pembe Şapkalı Tulum Seti",   Price = 620,  Image = "https://images.unsplash.com/photo-1591348278863-a8fb3887e2aa?w=600", Category = "bebek",    Stok = 5,  Renk = "Pembe",       Beden = "6-9 Ay"  },
            new Product { Id = 16, Name = "Mavi Çizgili Pijama Takımı", Price = 290,  Image = "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600", Category = "bebek",    Stok = 12, Renk = "Mavi",        Beden = "0-3 Ay"  },
            new Product { Id = 17, Name = "Gri Kapüşonlu Sweatshirt",   Price = 410,  Image = "https://images.unsplash.com/photo-1519689373023-dd07c7988603?w=600", Category = "bebek",    Stok = 2,  Renk = "Gri",         Beden = "9-12 Ay" },
            new Product { Id = 18, Name = "Ekru Organik Pamuk Zıbın",   Price = 240,  Image = "https://images.unsplash.com/photo-1544568100-847a948585b9?w=600", Category = "bebek",    Stok = 0,  Renk = "Ekru",        Beden = "0-3 Ay"  },

            // AKSESUAR
            new Product { Id = 19, Name = "Siyah Deri El Çantası",      Price = 950,  Image = "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600", Category = "aksesuar", Stok = 2,  Renk = "Siyah",       Beden = "Standart" },
            new Product { Id = 20, Name = "Altın Zincir Kolye",         Price = 420,  Image = "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600", Category = "aksesuar", Stok = 7,  Renk = "Altın",       Beden = "Standart" },
            new Product { Id = 21, Name = "Kahverengi Deri Kemer",      Price = 310,  Image = "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=600", Category = "aksesuar", Stok = 9,  Renk = "Kahverengi",  Beden = "Standart" },
            new Product { Id = 22, Name = "Güneş Gözlüğü",             Price = 680,  Image = "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600", Category = "aksesuar", Stok = 5,  Renk = "Siyah",       Beden = "Standart" },
            new Product { Id = 23, Name = "Bej Hasır Şapka",           Price = 390,  Image = "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600", Category = "aksesuar", Stok = 0,  Renk = "Bej",         Beden = "Standart" },
            new Product { Id = 24, Name = "Gümüş Bileklik Seti",       Price = 280,  Image = "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600", Category = "aksesuar", Stok = 11, Renk = "Gümüş",       Beden = "Standart" },
        };

        public ProductsController(IEventPublisher eventPublisher)
        {
            _eventPublisher = eventPublisher;
        }

        [HttpGet]
        public IActionResult GetProducts([FromQuery] string? category)
        {
            var query = Products.AsEnumerable();

            if (!string.IsNullOrWhiteSpace(category))
            {
                query = query.Where(p => p.Category.Equals(category, StringComparison.OrdinalIgnoreCase));
            }

            var products = query.OrderBy(p => p.Id).ToList();

            _eventPublisher.Publish("products.listed", new
            {
                category = category ?? "all",
                count = products.Count
            });

            return Ok(products);
        }

        [HttpGet("{id:int}")]
        public IActionResult GetProduct(int id)
        {
            var product = Products.FirstOrDefault(p => p.Id == id);
            if (product == null) return NotFound("Ürün bulunamadı.");
            return Ok(product);
        }

        [HttpPost]
        public IActionResult CreateProduct([FromBody] Product request)
        {
            if (string.IsNullOrWhiteSpace(request.Name)) return BadRequest("Ürün adı zorunludur.");
            if (string.IsNullOrWhiteSpace(request.Category)) return BadRequest("Kategori zorunludur.");
            if (request.Price < 0) return BadRequest("Fiyat negatif olamaz.");

            var nextId = Products.Any() ? Products.Max(p => p.Id) + 1 : 1;
            request.Id = nextId;
            request.Image = string.IsNullOrWhiteSpace(request.Image)
                ? "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600"
                : request.Image;

            Products.Add(request);

            _eventPublisher.Publish("product.created", new { request.Id, request.Name });

            return CreatedAtAction(nameof(GetProduct), new { id = request.Id }, request);
        }

        [HttpPut("{id:int}")]
        public IActionResult UpdateProduct(int id, [FromBody] Product request)
        {
            var product = Products.FirstOrDefault(p => p.Id == id);
            if (product == null) return NotFound("Ürün bulunamadı.");
            if (string.IsNullOrWhiteSpace(request.Name)) return BadRequest("Ürün adı zorunludur.");

            product.Name = request.Name;
            product.Price = request.Price;
            product.Category = request.Category;
            product.Stok = request.Stok;
            product.Image = request.Image;
            product.Renk = request.Renk;
            product.Beden = request.Beden;

            _eventPublisher.Publish("product.updated", new { product.Id, product.Name });

            return Ok(product);
        }

        [HttpDelete("{id:int}")]
        public IActionResult DeleteProduct(int id)
        {
            var product = Products.FirstOrDefault(p => p.Id == id);
            if (product == null) return NotFound("Ürün bulunamadı.");

            Products.Remove(product);
            _eventPublisher.Publish("product.deleted", new { product.Id, product.Name });

            return NoContent();
        }
    }
}
