using Backend.Application.Services;
using Backend.Core.Entities;
using Backend.Core.Interfaces;
using Backend.UI.Commands;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace Backend.Tests.Application.Services
{
    public class EmployeeServiceTests
    {
        private readonly Mock<IEmployeeRepository> _mockRepository;
        private readonly EmployeeService _service;

        public EmployeeServiceTests()
        {
            _mockRepository = new Mock<IEmployeeRepository>();
            _service = new EmployeeService(_mockRepository.Object);
        }

        [Fact]
        public async Task GetEmployees_ShouldReturnAllEmployees()
        {
            var expectedEmployees = new List<Employee>
            {
                new Employee
                {
                    Id = 1,
                    Name = "John",
                    LastName = "Doe",
                    Email = "john.doe@example.com",
                    DocumentCode = "DOC123",
                    BirthDate = new DateOnly(1990, 1, 1)
                },
                new Employee
                {
                    Id = 2,
                    Name = "Jane",
                    LastName = "Smith",
                    Email = "jane.smith@example.com",
                    DocumentCode = "DOC456",
                    BirthDate = new DateOnly(1992, 5, 15)
                }
            };

            _mockRepository.Setup(repo => repo.GetEmployees())
                .ReturnsAsync(expectedEmployees);

            var result = await _service.GetEmployees();

            Assert.Equal(expectedEmployees.Count, result.Count());
            Assert.Equal(expectedEmployees, result);
            _mockRepository.Verify(repo => repo.GetEmployees(), Times.Once);
        }

        [Fact]
        public async Task GetEmployeeById_WithValidId_ShouldReturnEmployee()
        {
            long employeeId = 1;
            var expectedEmployee = new Employee
            {
                Id = employeeId,
                Name = "John",
                LastName = "Doe",
                Email = "john.doe@example.com",
                DocumentCode = "DOC123",
                BirthDate = new DateOnly(1990, 1, 1)
            };

            _mockRepository.Setup(repo => repo.GetEmployeeById(employeeId))
                .ReturnsAsync(expectedEmployee);

            var result = await _service.GetEmployeeById(employeeId);

            Assert.NotNull(result);
            Assert.Equal(expectedEmployee, result);
            _mockRepository.Verify(repo => repo.GetEmployeeById(employeeId), Times.Once);
        }

        [Fact]
        public async Task GetEmployeeById_WithInvalidId_ShouldReturnNull()
        {
            long nonExistentId = 999;
            _mockRepository.Setup(repo => repo.GetEmployeeById(nonExistentId))
                .ReturnsAsync((Employee)null);

            var result = await _service.GetEmployeeById(nonExistentId);

            Assert.Null(result);
            _mockRepository.Verify(repo => repo.GetEmployeeById(nonExistentId), Times.Once);
        }

        [Fact]
        public async Task CreateEmployee_WithValidData_ShouldCreateAndReturnEmployee()
        {
            var command = new CreateEmployeeCommand
            {
                Name = "John",
                LastName = "Doe",
                Email = "john.doe@example.com",
                DocumentCode = "DOC123",
                BirthDate = new DateTime(1990, 1, 1)
            };

            var expectedEmployee = new Employee
            {
                Id = 1,
                Name = command.Name,
                LastName = command.LastName,
                Email = command.Email,
                DocumentCode = command.DocumentCode,
                BirthDate = DateOnly.FromDateTime(command.BirthDate)
            };

            _mockRepository.Setup(repo => repo.CreateEmployee(It.IsAny<Employee>()))
                .ReturnsAsync((Employee emp) =>
                {
                    emp.Id = 1; // Simulate ID generation
                    return emp;
                });

            var result = await _service.CreateEmployee(command);

            Assert.NotNull(result);
            Assert.Equal(1, result.Id);
            Assert.Equal(command.Name, result.Name);
            Assert.Equal(command.LastName, result.LastName);
            Assert.Equal(command.Email, result.Email);
            Assert.Equal(command.DocumentCode, result.DocumentCode);
            Assert.Equal(DateOnly.FromDateTime(command.BirthDate), result.BirthDate);

            _mockRepository.Verify(repo => repo.CreateEmployee(
                It.Is<Employee>(e =>
                    e.Name == command.Name &&
                    e.LastName == command.LastName &&
                    e.Email == command.Email &&
                    e.DocumentCode == command.DocumentCode &&
                    e.BirthDate == DateOnly.FromDateTime(command.BirthDate)
                )),
                Times.Once);
        }

        [Fact]
        public async Task UpdateEmployee_WithExistingEmployee_ShouldUpdateEmployee()
        {
            long employeeId = 1;
            var existingEmployee = new Employee
            {
                Id = employeeId,
                Name = "John",
                LastName = "Doe",
                Email = "john.doe@example.com",
                DocumentCode = "DOC123",
                BirthDate = new DateOnly(1990, 1, 1)
            };

            var command = new EditEmployeeCommand
            {
                Name = "Johnny",
                LastName = "Johnson",
                Email = "johnny.johnson@example.com",
                DocumentCode = "DOC789",
                BirthDate = new DateTime(1990, 5, 10)
            };

            _mockRepository.Setup(repo => repo.GetEmployeeById(employeeId))
                .ReturnsAsync(existingEmployee);

            await _service.UpdateEmployee(employeeId, command);

            _mockRepository.Verify(repo => repo.GetEmployeeById(employeeId), Times.Once);
            _mockRepository.Verify(repo => repo.UpdateEmployee(
                It.Is<Employee>(e =>
                    e.Id == employeeId &&
                    e.Name == command.Name &&
                    e.LastName == command.LastName &&
                    e.Email == command.Email &&
                    e.DocumentCode == command.DocumentCode &&
                    e.BirthDate == DateOnly.FromDateTime(command.BirthDate)
                )),
                Times.Once);
        }

        [Fact]
        public async Task UpdateEmployee_WithNonExistentId_ShouldNotCallUpdateRepository()
        {
            long nonExistentId = 999;
            var command = new EditEmployeeCommand
            {
                Name = "Johnny",
                LastName = "Johnson",
                Email = "johnny.johnson@example.com",
                DocumentCode = "DOC789",
                BirthDate = new DateTime(1990, 1, 1),
            };

            _mockRepository.Setup(repo => repo.GetEmployeeById(nonExistentId))
                .ReturnsAsync((Employee)null);

            await _service.UpdateEmployee(nonExistentId, command);

            _mockRepository.Verify(repo => repo.GetEmployeeById(nonExistentId), Times.Once);
            _mockRepository.Verify(repo => repo.UpdateEmployee(It.IsAny<Employee>()), Times.Never);
        }

        [Fact]
        public async Task DeleteEmployee_ShouldCallRepositoryDelete()
        {
            long employeeId = 1;
            _mockRepository.Setup(repo => repo.DeleteEmployee(employeeId))
                .Returns(Task.CompletedTask);

            await _service.DeleteEmployee(employeeId);

            _mockRepository.Verify(repo => repo.DeleteEmployee(employeeId), Times.Once);
        }
    }
}