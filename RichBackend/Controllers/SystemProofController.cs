using System.Net.Sockets;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using RabbitMQ.Client;

namespace RichBackend.Controllers;

[ApiController]
[Route("api/system-proof")]
public class SystemProofController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<SystemProofController> _logger;

    public SystemProofController(IConfiguration configuration, ILogger<SystemProofController> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    [HttpGet]
    public IActionResult Index()
    {
        return Ok(new
        {
            project = "RICH",
            status = "online",
            purpose = "Mobil arayüzden REST API, Docker, RabbitMQ, Redis ve Jenkins kanıtı göstermek için hazırlanmıştır.",
            time = DateTimeOffset.UtcNow,
            endpoints = new[]
            {
                "GET /api/health",
                "GET /api/products",
                "GET /api/system-proof/rest",
                "POST /api/cart",
                "POST /api/system-proof/rabbit",
                "GET /api/system-proof/redis",
                "GET /api/system-proof/docker",
                "GET /api/system-proof/jenkins"
            }
        });
    }

    [HttpGet("rest")]
    public IActionResult Rest()
    {
        return Ok(new
        {
            status = "REST API aktif",
            baseUrl = GetDisplayBaseUrl(),
            proof = "Mobil uygulama canlı olarak backend REST API endpointlerine istek atabiliyor.",
            mobileFlow = new[]
            {
                "Mobil Mağaza ekranı açılır.",
                "Sepete Ekle butonu POST /api/cart çağırır.",
                "Backend JSON response üretir.",
                "Mobil arayüz sağ üstte işlem özetini, Ayrıntıları Aç modalında JSON cevabını gösterir."
            },
            endpoints = new[]
            {
                new { method = "GET", path = "/api/health", description = "Backend canlılık testi" },
                new { method = "GET", path = "/api/products", description = "Ürün listesi" },
                new { method = "POST", path = "/api/cart", description = "Mobil sepete ekleme REST API kanıtı" },
                new { method = "POST", path = "/api/system-proof/rabbit", description = "RabbitMQ kuyruk testi" },
                new { method = "GET", path = "/api/system-proof/redis", description = "Redis cache testi" },
                new { method = "GET", path = "/api/system-proof/docker", description = "Docker Compose kanıtı" },
                new { method = "GET", path = "/api/system-proof/jenkins", description = "Jenkins dashboard/pipeline kanıtı" }
            },
            testedAt = DateTimeOffset.UtcNow
        });
    }

    [HttpPost("rabbit")]
    public IActionResult Rabbit()
    {
        var host = _configuration["RabbitMq:HostName"] ?? Environment.GetEnvironmentVariable("RABBITMQ_HOST") ?? "localhost";
        var user = _configuration["RabbitMq:UserName"] ?? Environment.GetEnvironmentVariable("RABBITMQ_USER") ?? "guest";
        var pass = _configuration["RabbitMq:Password"] ?? Environment.GetEnvironmentVariable("RABBITMQ_PASS") ?? "guest";
        var queue = _configuration["RabbitMq:QueueName"] ?? Environment.GetEnvironmentVariable("RABBITMQ_QUEUE") ?? "rich.events";

        try
        {
            var factory = new ConnectionFactory
            {
                HostName = host,
                UserName = user,
                Password = pass
            };

            using var connection = factory.CreateConnection();
            using var channel = connection.CreateModel();

            var declareOk = channel.QueueDeclare(
                queue: queue,
                durable: false,
                exclusive: false,
                autoDelete: false,
                arguments: null);

            var messageId = $"RICH-RABBIT-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}";
            var body = Encoding.UTF8.GetBytes($$"""
            {
              "messageId": "{{messageId}}",
              "eventName": "mobile.proof.rabbit",
              "source": "RICH mobile proof screen",
              "createdAt": "{{DateTimeOffset.UtcNow:O}}"
            }
            """);

            channel.BasicPublish(exchange: string.Empty, routingKey: queue, basicProperties: null, body: body);

            return Ok(new
            {
                status = "RabbitMQ bağlantısı başarılı",
                host,
                queue,
                messageId,
                messageCountBeforePublish = declareOk.MessageCount,
                consumerCount = declareOk.ConsumerCount,
                managementPanel = "http://localhost:15672",
                login = "guest / guest",
                proof = "Mobil arayüzden backend'e istek atıldı, backend RabbitMQ kuyruğuna mesaj bıraktı.",
                testedAt = DateTimeOffset.UtcNow
            });
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "RabbitMQ proof failed");
            return StatusCode(503, new
            {
                status = "RabbitMQ bağlantısı başarısız",
                host,
                queue,
                error = ex.Message,
                hint = "Docker Desktop açıldıktan sonra: docker compose up -d rabbitmq komutu çalışmalı. Yönetim paneli: http://localhost:15672",
                note = "REST API ve mobil kanıt çalışıyorsa bu hata Docker/RabbitMQ açılmadan normaldir."
            });
        }
    }

    [HttpGet("redis")]
    public IActionResult Redis()
    {
        var host = _configuration["Redis:Host"] ?? Environment.GetEnvironmentVariable("REDIS_HOST") ?? "localhost";
        var portText = _configuration["Redis:Port"] ?? Environment.GetEnvironmentVariable("REDIS_PORT") ?? "6379";
        var port = int.TryParse(portText, out var parsedPort) ? parsedPort : 6379;
        var key = "rich:proof:last-mobile-check";
        var value = DateTimeOffset.UtcNow.ToString("O");

        try
        {
            using var client = new TcpClient();
            client.Connect(host, port);
            using var stream = client.GetStream();

            var pong = SendRedisCommand(stream, "PING");
            var set = SendRedisCommand(stream, "SET", key, value);
            var get = SendRedisCommand(stream, "GET", key);

            return Ok(new
            {
                status = "Redis bağlantısı başarılı",
                host,
                port,
                ping = pong,
                set,
                get,
                key,
                value,
                proof = "Mobil arayüzden backend'e istek atıldı, backend Redis PING + SET + GET testi yaptı.",
                testedAt = DateTimeOffset.UtcNow
            });
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Redis proof failed");
            return StatusCode(503, new
            {
                status = "Redis bağlantısı başarısız",
                host,
                port,
                error = ex.Message,
                hint = "Docker Desktop açıldıktan sonra: docker compose up -d redis komutu çalışmalı.",
                note = "REST API ve mobil kanıt çalışıyorsa bu hata Docker/Redis açılmadan normaldir."
            });
        }
    }

    [HttpGet("docker")]
    public IActionResult Docker()
    {
        return Ok(new
        {
            status = "Docker Compose kanıtı hazır",
            composeFile = "docker-compose.yml",
            services = new[]
            {
                new { name = "richbackend", purpose = "ASP.NET Core REST API" },
                new { name = "web-frontend", purpose = "React/Vite web frontend" },
                new { name = "redis", purpose = "Cache servisi" },
                new { name = "rabbitmq", purpose = "Queue/message broker + management dashboard" }
            },
            commandsToShowTeacher = new[]
            {
                "docker compose up -d --build",
                "docker compose ps",
                "docker compose logs rabbitmq --tail=50",
                "docker compose logs redis --tail=50"
            },
            rabbitPanel = "http://localhost:15672",
            rabbitLogin = "guest / guest",
            note = "Docker Desktop açılınca RabbitMQ ve Redis canlı testleri de yeşile döner.",
            testedAt = DateTimeOffset.UtcNow
        });
    }

    [HttpGet("jenkins")]
    public IActionResult Jenkins()
    {
        return Ok(new
        {
            status = "Jenkins pipeline kanıtı hazır",
            dashboard = "http://localhost:8080",
            pipelineFile = "Jenkinsfile",
            stages = new[]
            {
                "Checkout",
                "Restore / Install",
                "Backend Build",
                "Frontend Build",
                "Docker Compose Build",
                "Deploy / Smoke Test"
            },
            commandsToShowTeacher = new[]
            {
                "Jenkins dashboard açılır: http://localhost:8080",
                "RICH pipeline/job seçilir.",
                "Build History ve Console Output gösterilir.",
                "Docker Compose ve REST API build adımları gösterilir."
            },
            note = "Jenkins dashboard canlı açılacaksa Jenkins servisi ayrıca çalıştırılmalıdır. Bu endpoint mobil arayüzde Jenkins kanıt ekranını gösterir.",
            testedAt = DateTimeOffset.UtcNow
        });
    }

    private static string SendRedisCommand(NetworkStream stream, params string[] parts)
    {
        var command = new StringBuilder();
        command.Append('*').Append(parts.Length).Append("\r\n");
        foreach (var part in parts)
        {
            var bytes = Encoding.UTF8.GetBytes(part);
            command.Append('$').Append(bytes.Length).Append("\r\n");
            command.Append(part).Append("\r\n");
        }

        var requestBytes = Encoding.UTF8.GetBytes(command.ToString());
        stream.Write(requestBytes, 0, requestBytes.Length);

        var buffer = new byte[4096];
        var read = stream.Read(buffer, 0, buffer.Length);
        return Encoding.UTF8.GetString(buffer, 0, read).Trim();
    }

    private string GetDisplayBaseUrl()
    {
        var request = HttpContext.Request;
        return $"{request.Scheme}://{request.Host}";
    }
}
