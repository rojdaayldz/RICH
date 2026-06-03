namespace RichBackend.Services;

// Redis ürün cache katmanı için not dosyası.
// Docker Compose üzerinde redis:7-alpine servisi kullanılacaktır.
public static class RedisCacheNote
{
    public const string CacheKeyPrefix = "rich:products:";
}
