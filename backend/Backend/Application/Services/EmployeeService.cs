using Backend.Core.Interfaces;
using Backend.Core.Entities;
using Backend.UI.Commands;

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

        public async Task<Employee?> GetEmployeeById(long id)
        {
            return await _employeeRepository.GetEmployeeById(id);
        }

        public async Task<Employee> CreateEmployee(CreateEmployeeCommand employeeCommand)
        {
            var employee = new Employee
            {
                Name = employeeCommand.Name,
                LastName = employeeCommand.LastName,
                Email = employeeCommand.Email,
                DocumentCode = employeeCommand.DocumentCode,
                ManagerName = employeeCommand.ManagerName,
                BirthDate = employeeCommand.BirthDate,
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
                employee.ManagerName = employeeCommand.ManagerName;
                employee.BirthDate = employeeCommand.BirthDate;

                await _employeeRepository.UpdateEmployee(employee);
            }
        }

        public async Task DeleteEmployee(long id)
        {
            await _employeeRepository.DeleteEmployee(id);
        }
    }
}