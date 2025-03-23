using Backend.Models;
using Microsoft.EntityFrameworkCore;

public class EmployeeManagementContext : DbContext
{
    public DbSet<Employee> Employees { get; set; }

    public EmployeeManagementContext(DbContextOptions<EmployeeManagementContext> options) : base(options)
    {
    }
}
