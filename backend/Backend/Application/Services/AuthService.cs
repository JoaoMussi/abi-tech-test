using Backend.Application.Commands;
using Backend.Core.Entities;
using Backend.Core.Interfaces;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

public class AuthService : IAuthService
{
    private readonly IConfiguration _config;
    private readonly IAuthRepository _authRepository;

    public AuthService(IConfiguration config, IAuthRepository authRepository)
    {
        _config = config;
        _authRepository = authRepository;
    }

    public string GenerateToken(Employee employee)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, employee.Email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.Name, employee.Email)
        };

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: null,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public async Task<string?> Login(LoginCommand loginCommand)
    {
        if (await ValidateUser(loginCommand.Email, loginCommand.Password))
        {
            var employee = await GetUserByEmail(loginCommand.Email);
            return GenerateToken(employee!);
        }

        return null;
    }

    public async Task<bool> Register(CreateEmployeeCommand employeeCommand)
    {
        var employee = await _authRepository.GetUserByEmail(employeeCommand.Email);
        if (employee != null)
            return false;

        string hashedPassword = BCrypt.Net.BCrypt.HashPassword(employeeCommand.Password);

        employee = new Employee
        {
            Name = employeeCommand.Name,
            LastName = employeeCommand.LastName,
            Email = employeeCommand.Email,
            DocumentCode = employeeCommand.DocumentCode,
            Role = employeeCommand.Role,
            BirthDate = DateOnly.FromDateTime(employeeCommand.BirthDate),
            HiringDate = employeeCommand.HiringDate == null ? null : DateOnly.FromDateTime((DateTime)employeeCommand.HiringDate),
            Salary = employeeCommand.Salary,
            Phone = employeeCommand.Phone,
            PasswordHash = hashedPassword
        };

        await _authRepository.Register(employee);
        return true;
    }

    public async Task<Employee?> GetUserByEmail(string email)
    {
        return await _authRepository.GetUserByEmail(email);
    }

    public async Task<bool> ValidateUser(string email, string password)
    {
        var employee = await _authRepository.GetUserByEmail(email);
        return employee != null && BCrypt.Net.BCrypt.Verify(password, employee.PasswordHash);
    }
}
