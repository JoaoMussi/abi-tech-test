using Backend.Application.Commands;
using Backend.Core.Entities;
using Backend.Core.Interfaces;
using Microsoft.Extensions.Configuration;
using Moq;
using System;
using System.Threading.Tasks;
using Xunit;

public class AuthServiceTests
{
    private readonly Mock<IAuthRepository> _mockAuthRepository;
    private readonly Mock<IConfiguration> _mockConfig;
    private readonly AuthService _authService;

    public AuthServiceTests()
    {
        _mockAuthRepository = new Mock<IAuthRepository>();
        _mockConfig = new Mock<IConfiguration>();

        _mockConfig.Setup(c => c["Jwt:Key"]).Returns("supersecretkeysupersecretkeysupersecretkey");
        _mockConfig.Setup(c => c["Jwt:Issuer"]).Returns("testIssuer");

        _authService = new AuthService(_mockConfig.Object, _mockAuthRepository.Object);
    }

    [Fact]
    public async Task Register_ShouldReturnFalse_WhenUserAlreadyExists()
    {
        var command = new CreateEmployeeCommand
        {
            Name = "John",
            LastName = "Doe",
            Email = "newuser@example.com",
            DocumentCode = "123456",
            Role = "User",
            BirthDate = DateTime.UtcNow,
            Phone = "1234567890",
            Password = "password123"
        };
        _mockAuthRepository.Setup(repo => repo.GetUserByEmail(command.Email)).ReturnsAsync(new Employee
        {
            Id = 1,
            Name = "John",
            LastName = "Doe",
            Email = "test@example.com",
            DocumentCode = "DOC456",
            Role = "Manager",
            BirthDate = new DateOnly(1991, 5, 10),
            Phone = "(99) 99999-9999",
            PasswordHash = "password123"
        });

        var result = await _authService.Register(command);

        Assert.False(result);
    }

    [Fact]
    public async Task Register_ShouldReturnTrue_WhenUserDoesNotExist()
    {
        var command = new CreateEmployeeCommand
        {
            Name = "John",
            LastName = "Doe",
            Email = "newuser@example.com",
            DocumentCode = "123456",
            Role = "User",
            BirthDate = DateTime.UtcNow,
            Phone = "1234567890",
            Password = "password123"
        };

        _mockAuthRepository.Setup(repo => repo.GetUserByEmail(command.Email)).ReturnsAsync((Employee)null);
        _mockAuthRepository.Setup(repo => repo.Register(It.IsAny<Employee>())).ReturnsAsync(new Employee
        {
            Id = 1,
            Name = "John",
            LastName = "Doe",
            Email = "test@example.com",
            DocumentCode = "DOC456",
            Role = "Manager",
            BirthDate = new DateOnly(1991, 5, 10),
            Phone = "(99) 99999-9999",
            PasswordHash = "password123"
        });

        var result = await _authService.Register(command);

        Assert.True(result);
    }

    [Fact]
    public async Task ValidateUser_ShouldReturnFalse_WhenUserDoesNotExist()
    {
        _mockAuthRepository.Setup(repo => repo.GetUserByEmail("invalid@example.com")).ReturnsAsync((Employee)null);

        var result = await _authService.ValidateUser("invalid@example.com", "password123");

        Assert.False(result);
    }

    [Fact]
    public async Task ValidateUser_ShouldReturnTrue_WhenPasswordMatches()
    {
        var hashedPassword = BCrypt.Net.BCrypt.HashPassword("password123");
        var employee = new Employee
        {
            Id = 1,
            Name = "John",
            LastName = "Doe",
            Email = "test@example.com",
            DocumentCode = "DOC456",
            Role = "Manager",
            BirthDate = new DateOnly(1991, 5, 10),
            Phone = "(99) 99999-9999",
            PasswordHash = hashedPassword
        };

        _mockAuthRepository.Setup(repo => repo.GetUserByEmail("test@example.com")).ReturnsAsync(employee);

        var result = await _authService.ValidateUser("test@example.com", "password123");

        Assert.True(result);
    }

    [Fact]
    public void GenerateToken_ShouldReturnToken_WhenValidEmployee()
    {
        var employee = new Employee
        {
            Id = 1,
            Name = "John",
            LastName = "Doe",
            Email = "test@example.com",
            DocumentCode = "DOC456",
            Role = "Manager",
            BirthDate = new DateOnly(1991, 5, 10),
            Phone = "(99) 99999-9999",
            PasswordHash = "HashedValue"
        };

        var token = _authService.GenerateToken(employee);

        Assert.False(string.IsNullOrEmpty(token));
    }
}