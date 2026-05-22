using System.Text;
using System.Text.Json;
using RabbitMQ.Client;

namespace RichBackend.Services
{
    public class RabbitMqEventPublisher : IEventPublisher
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<RabbitMqEventPublisher> _logger;

        public RabbitMqEventPublisher(IConfiguration configuration, ILogger<RabbitMqEventPublisher> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public void Publish(string eventName, object payload)
        {
            try
            {
                var hostName = _configuration["RabbitMq:HostName"] ?? Environment.GetEnvironmentVariable("RABBITMQ_HOST") ?? "localhost";
                var userName = _configuration["RabbitMq:UserName"] ?? Environment.GetEnvironmentVariable("RABBITMQ_USER") ?? "guest";
                var password = _configuration["RabbitMq:Password"] ?? Environment.GetEnvironmentVariable("RABBITMQ_PASS") ?? "guest";
                var queueName = _configuration["RabbitMq:QueueName"] ?? Environment.GetEnvironmentVariable("RABBITMQ_QUEUE") ?? "rich.events";

                var factory = new ConnectionFactory
                {
                    HostName = hostName,
                    UserName = userName,
                    Password = password
                };

                using var connection = factory.CreateConnection();
                using var channel = connection.CreateModel();

                channel.QueueDeclare(
                    queue: queueName,
                    durable: false,
                    exclusive: false,
                    autoDelete: false,
                    arguments: null);

                var message = JsonSerializer.Serialize(new
                {
                    eventName,
                    occurredAt = DateTimeOffset.UtcNow,
                    payload
                });

                var body = Encoding.UTF8.GetBytes(message);

                channel.BasicPublish(
                    exchange: string.Empty,
                    routingKey: queueName,
                    basicProperties: null,
                    body: body);

                _logger.LogInformation("RabbitMQ event published: {EventName}", eventName);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "RabbitMQ event could not be published: {EventName}", eventName);
            }
        }
    }
}
