using Backend.Core.Entities;
using Backend.Core.Interfaces;

namespace Backend.Infrastructure.Repositories
{
    public class AuthRepository : IAuthRepository
    {
        private readonly IEmployeeRepository _employeeRepository;

        public AuthRepository(IEmployeeRepository employeeRepository)
        {
            _employeeRepository = employeeRepository;
        }

        public async Task<Employee?> Register(Employee employee)
        {
            return await _employeeRepository.CreateEmployee(employee);
        }

        public async Task<Employee?> GetUserByEmail(string email)
        {
            return await _employeeRepository.GetEmployeeByEmail(email);
        }
    }
}