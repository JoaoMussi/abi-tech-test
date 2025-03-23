using Microsoft.EntityFrameworkCore;
using Backend.Models;
using Microsoft.CodeAnalysis.Scripting.Hosting;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

builder.Configuration.AddEnvironmentVariables();
builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.ListenAnyIP(5058);
});
var connectionString =
    builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<EmployeeManagementContext>(opt => opt.UseNpgsql(connectionString));
builder.Services.AddControllers();
builder.Services.AddOpenApi();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<EmployeeManagementContext>();
    context.Database.Migrate();
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUi(options =>
    {
        options.DocumentPath = "/openapi/v1.json";
    });
}

app.UseAuthorization();

app.MapControllers();

app.Run();
