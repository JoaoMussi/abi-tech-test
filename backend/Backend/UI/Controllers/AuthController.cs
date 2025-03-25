using Backend.Application.Commands;
using Backend.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] CreateEmployeeCommand employeeCommand)
    {
        bool success = await _authService.Register(employeeCommand);

        if (!success)
            return BadRequest("Employee already exists with this email");

        return Ok("User registered successfully");
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginCommand loginDto)
    {
        if (await _authService.ValidateUser(loginDto.Email, loginDto.Password))
        {
            var employee = await _authService.GetUserByEmail(loginDto.Email);
            var token = _authService.GenerateToken(employee!);
            return Ok(new { token });
        }
        return Unauthorized("Invalid credentials");
    }
}