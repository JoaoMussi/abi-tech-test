using Backend.Application.Commands;
using Backend.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("auth")]
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

        return Ok();
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginCommand loginCommand)
    {
        var authToken = await _authService.Login(loginCommand);
        if (authToken == null)
            return Unauthorized("Invalid credentials");

        return Ok(new { authToken });
    }
}