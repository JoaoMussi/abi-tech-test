using Backend.Core.Entities;
using Backend.Infrastructure.Data;
using Backend.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace Backend.Tests.Repositories
{
    public class EmployeeRepositoryTests
    {
        private async Task<EmployeeManagementContext> GetDbContext()
        {
            var options = new DbContextOptionsBuilder<EmployeeManagementContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            var context = new EmployeeManagementContext(options);

            if (await context.Employees.CountAsync() <= 0)
            {
                for (int i = 1; i <= 10; i++)
                {
                    context.Employees.Add(new Employee
                    {
                        Id = i,
                        Name = $"FirstName{i}",
                        LastName = $"LastName{i}",
                        Email = $"employee{i}@example.com",
                        DocumentCode = $"Document{i % 3 + 1}",
                        BirthDate = DateOnly.FromDateTime(DateTime.Now.AddMonths(-i)),
                    });
                }

                await context.SaveChangesAsync();
            }

            return context;
        }

        [Fact]
        public async Task GetEmployees_ReturnsAllEmployees()
        {
            var context = await GetDbContext();
            var repository = new EmployeeRepository(context);

            var result = await repository.GetEmployees();

            Assert.Equal(10, result.Count());
        }

        [Fact]
        public async Task GetEmployeeById_ReturnsCorrectEmployee()
        {
            var context = await GetDbContext();
            var repository = new EmployeeRepository(context);
            long employeeId = 3;

            var result = await repository.GetEmployeeById(employeeId);

            Assert.NotNull(result);
            Assert.Equal($"FirstName{employeeId}", result.Name);
        }

        [Fact]
        public async Task GetEmployeeById_NonExistingId_ReturnsNull()
        {
            var context = await GetDbContext();
            var repository = new EmployeeRepository(context);
            long nonExistingId = 999;

            var result = await repository.GetEmployeeById(nonExistingId);

            Assert.Null(result);
        }

        [Fact]
        public async Task CreateEmployee_AddsEmployee()
        {
            var context = await GetDbContext();
            var repository = new EmployeeRepository(context);
            var newEmployee = new Employee
            {
                Name = "Another",
                LastName = "Name",
                Email = "anothername@example.com",
                DocumentCode = "123.456.789.00",
                BirthDate = DateOnly.FromDateTime(DateTime.Now),
            };

            var result = await repository.CreateEmployee(newEmployee);

            Assert.NotEqual(0, result.Id);
            Assert.Equal(11, await context.Employees.CountAsync());

            var savedEmployee = await context.Employees.FindAsync(newEmployee.Id);
            Assert.NotNull(savedEmployee);
            Assert.Equal(newEmployee.Name, savedEmployee.Name);
            Assert.Equal(newEmployee.LastName, savedEmployee.LastName);
            Assert.Equal(newEmployee.Email, savedEmployee.Email);
        }

        [Fact]
        public async Task UpdateEmployee_UpdatesExistingEmployee_Correctly()
        {
            var context = await GetDbContext();
            var repository = new EmployeeRepository(context);
            var employee = await context.Employees.FirstAsync();
            employee.Name = "Updated Name";

            await repository.UpdateEmployee(employee);

            var updatedEmployee = await context.Employees.FindAsync(employee.Id);
            Assert.NotNull(updatedEmployee);
            Assert.Equal("Updated Name", updatedEmployee.Name);
        }

        [Fact]
        public async Task DeleteEmployee_RemovesEmployee()
        {
            var context = await GetDbContext();
            var repository = new EmployeeRepository(context);
            long employeeId = 5;
            
            await repository.DeleteEmployee(employeeId);

            var deletedEmployee = await context.Employees.FindAsync(employeeId);
            Assert.Null(deletedEmployee);
        }
    }
}