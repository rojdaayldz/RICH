namespace RichBackend.Services
{
    public interface IEventPublisher
    {
        void Publish(string eventName, object payload);
    }
}
