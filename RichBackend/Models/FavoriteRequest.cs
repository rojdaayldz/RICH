namespace RichBackend.Models
{
    public class FavoriteRequest
    {
        public int Id { get; set; }
        public int ProductId { get; set; } 
        public string ProductName { get; set; } = string.Empty;
        public decimal ProductPrice { get; set; }
    }
}