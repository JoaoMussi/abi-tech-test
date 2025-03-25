using Backend.Application.Commands;
using Backend.Core.Entities;
using Backend.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Threading.Tasks;
using Xunit;

public class AuthControllerTests
{
    private readonly Mock<IAuthService> _authServiceMock;
    private readonly AuthController _authController;

    public AuthControllerTests()
    {
        _authServiceMock = new Mock<IAuthService>();
        _authController = new AuthController(_authServiceMock.Object);
    }

    [Fact]
    public async Task Register_ShouldReturnOk_WhenEmployeeIsRegistered()
    {
        var employeeCommand = new CreateEmployeeCommand
        {
            Name = "John",
            LastName = "Doe",
            Email = "john.doe@example.com",
            DocumentCode = "DOC123",
            Role = "Manager",
            BirthDate = new DateTime(1990, 1, 1),
            Phone = "(99) 99999-9999",
            Password = "HashedValue"
        };
        _authServiceMock.Setup(service => service.Register(employeeCommand)).ReturnsAsync(true);

        var result = await _authController.Register(employeeCommand);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal("User registered successfully", okResult.Value);
    }

    [Fact]
    public async Task Register_ShouldReturnBadRequest_WhenEmployeeAlreadyExists()
    {
        var employeeCommand = new CreateEmployeeCommand
        {
            Name = "John",
            LastName = "Doe",
            Email = "john.doe@example.com",
            DocumentCode = "DOC123",
            Role = "Manager",
            BirthDate = new DateTime(1990, 1, 1),
            Phone = "(99) 99999-9999",
            Password = "HashedValue"
        };
        _authServiceMock.Setup(service => service.Register(employeeCommand)).ReturnsAsync(false);

        var result = await _authController.Register(employeeCommand);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Employee already exists with this email", badRequestResult.Value);
    }

    [Fact]
    public async Task Login_ShouldReturnOk_WithToken_WhenCredentialsAreValid()
    {
        var loginCommand = new LoginCommand { Email = "test@example.com", Password = "password123" };
        var employee = new Employee
        {
            Id = 1,
            Name = "John",
            LastName = "Doe",
            Email = "john.doe@example.com",
            DocumentCode = "DOC456",
            Role = "Manager",
            BirthDate = new DateOnly(1991, 5, 10),
            Phone = "(99) 99999-9999",
            PasswordHash = "HashedValue"
        };

        _authServiceMock.Setup(service => service.ValidateUser(loginCommand.Email, loginCommand.Password)).ReturnsAsync(true);
        _authServiceMock.Setup(service => service.GetUserByEmail(loginCommand.Email)).ReturnsAsync(employee);
        _authServiceMock.Setup(service => service.GenerateToken(employee)).Returns("mocked-jwt-token");

        var result = await _authController.Login(loginCommand);

        var okResult = Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public async Task Login_ShouldReturnUnauthorized_WhenCredentialsAreInvalid()
    {
        var loginCommand = new LoginCommand { Email = "test@example.com", Password = "wrongpassword" };

        _authServiceMock.Setup(service => service.ValidateUser(loginCommand.Email, loginCommand.Password)).ReturnsAsync(false);

        var result = await _authController.Login(loginCommand);

        var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
        Assert.Equal("Invalid credentials", unauthorizedResult.Value);
    }
}
