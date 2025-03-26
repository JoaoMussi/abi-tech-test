using Backend.Application.Commands;
using Backend.Core.Entities;

namespace Backend.Core.Interfaces
{
    public interface IAuthService
    {
        string GenerateToken(Employee employee);
        Task<bool> Register(CreateEmployeeCommand employeeCommand);
        Task<string?> Login(LoginCommand loginCommand);
        Task<bool> ValidateUser(string email, string password);
        Task<Employee?> GetUserByEmail(string email);
    }
}