using Backend.Core.Interfaces;
using Backend.Core.Entities;
using Backend.Application.Commands;
using Backend.Application.Dto;

namespace Backend.Application.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly IEmployeeRepository _employeeRepository;

        public EmployeeService(IEmployeeRepository employeeRepository)
        {
            _employeeRepository = employeeRepository;
        }

        public async Task<IEnumerable<Employee>> GetEmployees()
        {
            return await _employeeRepository.GetEmployees();
        }

        public async Task<EmployeeDto?> GetEmployeeById(long id)
        {
            var employee = await _employeeRepository.GetEmployeeById(id);

            return employee == null ? null : new EmployeeDto
            {
                Id = employee.Id,
                Name = employee.Name,
                LastName = employee.LastName,
                Email = employee.Email,
                DocumentCode = employee.DocumentCode,
                Role = employee.Role,
                ManagerName = employee.ManagerName,
                Phone = employee.Phone,
                BirthDate = new DateTime(employee.BirthDate, new TimeOnly()),
            };
        }

        public async Task<Employee> CreateEmployee(CreateEmployeeCommand employeeCommand)
        {
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(employeeCommand.Password);
            var employee = new Employee
            {
                Name = employeeCommand.Name,
                LastName = employeeCommand.LastName,
                Email = employeeCommand.Email,
                DocumentCode = employeeCommand.DocumentCode,
                Role = employeeCommand.Role,
                ManagerName = employeeCommand.ManagerName,
                HiringDate = employeeCommand.HiringDate == null ? null : DateOnly.FromDateTime((DateTime)employeeCommand.HiringDate),
                Salary = employeeCommand.Salary,
                Phone = employeeCommand.Phone,
                PasswordHash = hashedPassword,
                BirthDate = DateOnly.FromDateTime(employeeCommand.BirthDate),
            };

            return await _employeeRepository.CreateEmployee(employee);
        }

        public async Task UpdateEmployee(long id, EditEmployeeCommand employeeCommand)
        {
            var employee = await _employeeRepository.GetEmployeeById(id);

            if (employee != null)
            {
                employee.Name = employeeCommand.Name;
                employee.LastName = employeeCommand.LastName;
                employee.Email = employeeCommand.Email;
                employee.DocumentCode = employeeCommand.DocumentCode;
                employee.Role = employeeCommand.Role;
                employee.ManagerName = employeeCommand.ManagerName;
                employee.BirthDate = DateOnly.FromDateTime(employeeCommand.BirthDate);
                employee.HiringDate = employeeCommand.HiringDate == null ? null : DateOnly.FromDateTime((DateTime)employeeCommand.HiringDate);
                employee.Salary = employeeCommand.Salary;
                employee.Phone = employeeCommand.Phone;

                await _employeeRepository.UpdateEmployee(employee);
            }
        }

        public async Task DeleteEmployee(long id)
        {
            await _employeeRepository.DeleteEmployee(id);
        }
    }
}