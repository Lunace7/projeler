using Microsoft.EntityFrameworkCore;
using StoreApp.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews();

var connectionString = builder.Configuration.GetConnectionString("sqlconnection");
if (connectionString == null)
{
    throw new InvalidOperationException("Veritabanı bağlantı cümlesi bulunamadı.");
}

builder.Services.AddDbContext<RepositoryContext>(options =>
{
    options.UseSqlite(connectionString);
});


var app = builder.Build();

app.UseHttpsRedirection();
app.UseRouting();

app.MapControllerRoute(
    name:"default",
    pattern:"{Controller=Home}/{Action=Index}/{id?}");

app.Run();
