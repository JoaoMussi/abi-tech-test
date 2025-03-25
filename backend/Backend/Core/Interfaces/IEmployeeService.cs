using Backend.Core.Entities;
using Backend.Application.Commands;
using Backend.Application.Dto;

namespace Backend.Core.Interfaces
{
    public interface IEmployeeService
    {
        Task<IEnumerable<Employee>> GetEmployees();
        Task<EmployeeDto?> GetEmployeeById(long id);
        Task<Employee> CreateEmployee(CreateEmployeeCommand employeeCommand);
        Task UpdateEmployee(long id, EditEmployeeCommand employeeCommand);
        Task DeleteEmployee(long id);
    }
}