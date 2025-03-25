using Microsoft.AspNetCore.Mvc;
using Backend.Core.Entities;
using Backend.Application.Commands;
using Backend.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace Backend.UI.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;

        public EmployeeController(IEmployeeService employeeService)
        {
            _employeeService = employeeService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Employee>>> GetEmployees()
        {
            return Ok(await _employeeService.GetEmployees());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Employee>> GetEmployee(long id)
        {
            var employee = await _employeeService.GetEmployeeById(id);

            if (employee == null)
            {
                return NotFound();
            }

            return Ok(employee);
        }

        [HttpPost]
        public async Task<ActionResult<Employee>> CreateEmployee(CreateEmployeeCommand employeeCommand)
        {
            return Ok(await _employeeService.CreateEmployee(employeeCommand));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEmployee(long id, EditEmployeeCommand employeeCommand)
        {
            await _employeeService.UpdateEmployee(id, employeeCommand);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployee(long id)
        {
            await _employeeService.DeleteEmployee(id);
            return NoContent();
        }
    }
}
