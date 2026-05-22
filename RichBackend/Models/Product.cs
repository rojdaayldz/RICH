namespace RichBackend.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string Category { get; set; } = string.Empty;
        public int Stok { get; set; }
        public string Image { get; set; } = string.Empty;
        public string Renk { get; set; } = string.Empty;
        public string Beden { get; set; } = string.Empty;
    }
}