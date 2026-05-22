using Microsoft.EntityFrameworkCore;

namespace RichBackend.Models
{
    public class RichContext : DbContext
    {
        public RichContext(DbContextOptions<RichContext> options) : base(options) { }

        public DbSet<PaymentRequest> Payments { get; set; }
        public DbSet<AddressRequest> Addresses { get; set; }
        public DbSet<FavoriteRequest> Favorites { get; set; }
        public DbSet<Product> Products { get; set; } 
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AddressRequest>().ToTable("Addresses");
            modelBuilder.Entity<PaymentRequest>().ToTable("Payments");
            modelBuilder.Entity<FavoriteRequest>().ToTable("Favorites");
            modelBuilder.Entity<Product>().ToTable("Products");
        }
    }
}