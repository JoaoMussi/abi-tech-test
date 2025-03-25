using Backend.Core.Entities;
using Backend.Core.Interfaces;
using Backend.Infrastructure.Repositories;
using Moq;
using System.Threading.Tasks;
using Xunit;

public class AuthRepositoryTests
{
    private readonly AuthRepository _authRepository;
    private readonly Mock<IEmployeeRepository> _employeeRepositoryMock;

    public AuthRepositoryTests()
    {
        _employeeRepositoryMock = new Mock<IEmployeeRepository>();
        _authRepository = new AuthRepository(_employeeRepositoryMock.Object);
    }

    [Fact]
    public async Task Register_ShouldReturnEmployee_WhenCreatedSuccessfully()
    {
        var employee = new Employee
        {
            Id = 1,
            Name = "John",
            LastName = "Doe",
            Email = "john.doe@example.com",
            DocumentCode = "123456",
            Role = "Admin",
            BirthDate = new DateOnly(1990, 1, 1),
            Phone = "1234567890",
            PasswordHash = "HashedValue"
        };

        _employeeRepositoryMock.Setup(repo => repo.CreateEmployee(employee))
            .ReturnsAsync(employee);

        var result = await _authRepository.Register(employee);

        Assert.NotNull(result);
        Assert.Equal(employee.Email, result.Email);
    }

    [Fact]
    public async Task GetUserByEmail_ShouldReturnEmployee_WhenEmployeeExists()
    {
        var email = "john.doe@example.com";
        var employee = new Employee
        {
            Id = 1,
            Name = "John",
            LastName = "Doe",
            Email = email,
            DocumentCode = "DOC123",
            Role = "Manager",
            BirthDate = new DateOnly(1990, 1, 1),
            Phone = "(99) 99999-9999",
            PasswordHash = "HashedValue"
        };

        _employeeRepositoryMock.Setup(repo => repo.GetEmployeeByEmail(email))
            .ReturnsAsync(employee);

        var result = await _authRepository.GetUserByEmail(email);

        Assert.NotNull(result);
        Assert.Equal(email, result.Email);
    }

    [Fact]
    public async Task GetUserByEmail_ShouldReturnNull_WhenEmployeeDoesNotExist()
    {
        var email = "nonexistent@example.com";

        _employeeRepositoryMock.Setup(repo => repo.GetEmployeeByEmail(email))
            .ReturnsAsync((Employee?)null);

        var result = await _authRepository.GetUserByEmail(email);

        Assert.Null(result);
    }
}
