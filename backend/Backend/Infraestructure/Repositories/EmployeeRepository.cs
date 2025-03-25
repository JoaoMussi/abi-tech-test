using Backend.Core.Entities;
using Backend.Core.Interfaces;
using Backend.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Backend.Infrastructure.Repositories
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly EmployeeManagementContext _context;

        public EmployeeRepository(EmployeeManagementContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Employee>> GetEmployees() => await _context.Employees.ToListAsync();

        public async Task<Employee?> GetEmployeeById(long id) => await _context.Employees.FindAsync(id);

        public async Task<Employee> CreateEmployee(Employee employee)
        {
            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();
            return employee;
        }

        public async Task UpdateEmployee(Employee employee)
        {
            _context.Employees.Update(employee);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteEmployee(long id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee != null)
            {
                _context.Employees.Remove(employee);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<Employee?> GetEmployeeByEmail(string email)
        {
            return await _context.Employees.SingleOrDefaultAsync(e => e.Email == email);
        }
    }
}