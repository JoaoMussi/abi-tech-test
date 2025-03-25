using Backend.Core.Entities;

namespace Backend.Core.Interfaces
{
    public interface IAuthRepository
    {
        Task<Employee?> Register(Employee employee);
        Task<Employee?> GetUserByEmail(string email);
    }
}