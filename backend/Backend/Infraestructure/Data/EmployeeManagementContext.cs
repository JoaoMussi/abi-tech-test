using Backend.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Infrastructure.Data
{
    public class EmployeeManagementContext : DbContext
    {
        public DbSet<Employee> Employees { get; set; }

        public EmployeeManagementContext(DbContextOptions<EmployeeManagementContext> options) : base(options)
        {
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            foreach (var entry in ChangeTracker.Entries())
            {
                if (entry.State == EntityState.Deleted && entry.Entity is Employee)
                {
                    entry.State = EntityState.Modified;
                    ((Employee)entry.Entity).Deleted = true;
                }
            }
            return await base.SaveChangesAsync(cancellationToken);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Employee>()
                .HasIndex(e => e.Email)
                .IsUnique();
            modelBuilder.Entity<Employee>()
                .HasIndex(e => e.DocumentCode)
                .IsUnique();
            modelBuilder.Entity<Employee>().HasQueryFilter(p => !p.Deleted);
        }
    }
}