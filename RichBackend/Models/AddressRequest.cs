namespace RichBackend.Models
{
    public class AddressRequest
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string District { get; set; } = string.Empty;
        public string AddressDetail { get; set; } = string.Empty;
    }
}