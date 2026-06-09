using Microsoft.AspNetCore.Mvc;
using RichBackend.Services;

namespace RichBackend.Controllers;

[ApiController]
[Route("api/cart")]
public class CartController : ControllerBase
{
    private readonly IEventPublisher _eventPublisher;
    private readonly ILogger<CartController> _logger;

    public CartController(IEventPublisher eventPublisher, ILogger<CartController> logger)
    {
        _eventPublisher = eventPublisher;
        _logger = logger;
    }

    public record AddCartItemRequest(int ProductId, string? ProductName, int Quantity, decimal Price);

    [HttpGet]
    public IActionResult Info()
    {
        return Ok(new
        {
            service = "RICH Cart API",
            endpoint = "POST /api/cart",
            status = "online",
            purpose = "Mobil Sepete Ekle butonunun REST API üzerinden backend'e bağlandığını kanıtlar.",
            exampleBody = new
            {
                productId = 1,
                productName = "Elegant Lacivert Elbise",
                quantity = 1,
                price = 1250
            },
            time = DateTimeOffset.UtcNow
        });
    }

    [HttpPost]
    public IActionResult AddToCart([FromBody] AddCartItemRequest request)
    {
        var quantity = request.Quantity <= 0 ? 1 : request.Quantity;
        var productName = string.IsNullOrWhiteSpace(request.ProductName)
            ? $"Product #{request.ProductId}"
            : request.ProductName.Trim();

        var cartId = $"RICH-CART-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}";
        var rabbitStatus = "attempted";
        var rabbitMessage = "RabbitMQ publisher denendi.";

        try
        {
            _eventPublisher.Publish("cart.item.added", new
            {
                cartId,
                productId = request.ProductId,
                productName,
                quantity,
                price = request.Price,
                source = "mobile-frontend",
                proof = "Sepete Ekle butonu REST API üzerinden backend'e ulaştı."
            });
        }
        catch (Exception ex)
        {
            rabbitStatus = "publisher-error-ignored";
            rabbitMessage = ex.Message;
            _logger.LogWarning(ex, "Cart event publisher failed but REST API response will continue.");
        }

        return Ok(new
        {
            success = true,
            cartId,
            message = "Ürün mobil Sepete Ekle butonu ile REST API üzerinden backend'e gönderildi.",
            endpoint = "POST /api/cart",
            item = new
            {
                productId = request.ProductId,
                productName,
                quantity,
                price = request.Price
            },
            infrastructure = new
            {
                restApi = "200 OK",
                rabbitMq = rabbitStatus,
                rabbitEvent = "cart.item.added",
                rabbitMessage,
                redis = "Kanıt Merkezi sekmesinde /api/system-proof/redis ile test edilir.",
                docker = "Kanıt Merkezi sekmesinde /api/system-proof/docker ile gösterilir.",
                jenkins = "Kanıt Merkezi sekmesinde /api/system-proof/jenkins ile gösterilir."
            },
            testedAt = DateTimeOffset.UtcNow
        });
    }
}
