using Microsoft.EntityFrameworkCore;
using Backend.Infrastructure.Data;
using Backend.Core.Interfaces;
using Backend.Infrastructure.Repositories;
using Backend.Application.Services;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

builder.Configuration.AddEnvironmentVariables();
var connectionString =
    builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<EmployeeManagementContext>(opt => opt.UseNpgsql(connectionString));
builder.Services.AddScoped<IEmployeeRepository, EmployeeRepository>();
builder.Services.AddScoped<IEmployeeService, EmployeeService>();
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
    app.UseCors(options => options.AllowAnyOrigin().AllowAnyMethod());
}

app.UseAuthorization();

app.MapControllers();

app.Run();
