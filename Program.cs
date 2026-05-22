using Microsoft.EntityFrameworkCore;
using RichBackend.Models;
using RichBackend.Services;

var builder = WebApplication.CreateBuilder(args);

var port = Environment.GetEnvironmentVariable("PORT") ?? "5227";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

// 1. SWAGGER VE API AYARLARI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 2. SQL SERVER BAĞLANTISI (RICHDB)
builder.Services.AddDbContext<RichContext>(options =>
    options.UseSqlServer("Server=localhost\\SQLEXPRESS;Database=RichDB;Trusted_Connection=True;TrustServerCertificate=True;"));

// 3. CONTROLLER SERVİSİNİ EKLE
builder.Services.AddControllers();
builder.Services.AddSingleton<IEventPublisher, RabbitMqEventPublisher>();

// 4. CORS AYARI (React'ın Backend'e her türlü erişebilmesi için en geniş izinler)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
});

var app = builder.Build();

// 5. GELİŞTİRME ORTAMI AYARLARI
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ⚠️ SIRALAMA ÇOK ÖNEMLİ: CORS mutlaka MapControllers'dan ÖNCE gelmeli!
app.UseCors("AllowReact"); 

// app.UseHttpsRedirection(); // Eğer yerelde hata alıyorsan bunu yorum satırı yapabilirsin

app.UseAuthorization();

app.MapControllers();

app.Run();
