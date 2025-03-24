using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Application.Services;
using Backend.UI.Controllers;
using Backend.Core.Entities;
using Backend.Core.Interfaces;
using Backend.Infrastructure.Data;
using Backend.Application.Commands;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;

namespace Backend.Tests.Controllers
{
    public class EmployeeControllerTests
    {
        private readonly Mock<IEmployeeService> _mockEmployeeService;
        private readonly EmployeeController _controller;

        public EmployeeControllerTests()
        {
            _mockEmployeeService = new Mock<IEmployeeService>(MockBehavior.Strict);
            _controller = new EmployeeController(_mockEmployeeService.Object);
        }

        [Fact]
        public async Task GetEmployees_ReturnsOkResult_WithListOfEmployees()
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

            _mockEmployeeService
                .Setup(service => service.GetEmployees())
                .ReturnsAsync(expectedEmployees);

            var result = await _controller.GetEmployees();

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedEmployees = Assert.IsAssignableFrom<IEnumerable<Employee>>(okResult.Value);
            Assert.Equal(2, (returnedEmployees as List<Employee>).Count);
        }

        [Fact]
        public async Task GetEmployees_ReturnsOkResult_WithEmptyList_WhenNoEmployees()
        {
            var employees = new List<Employee>();

            _mockEmployeeService
                .Setup(service => service.GetEmployees())
                .ReturnsAsync(employees);

            var result = await _controller.GetEmployees();

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedEmployees = Assert.IsAssignableFrom<IEnumerable<Employee>>(okResult.Value);
            Assert.Empty(returnedEmployees);
        }

        [Fact]
        public async Task GetEmployee_ReturnsEmployee_WhenEmployeeExists()
        {
            var employee = new Employee
            {
                Id = 1,
                Name = "John",
                LastName = "Doe",
                Email = "john.doe@example.com",
                DocumentCode = "DOC123",
                BirthDate = new DateOnly(1990, 1, 1)
            };

            _mockEmployeeService
                .Setup(service => service.GetEmployeeById(1))
                .ReturnsAsync(employee);

            var result = await _controller.GetEmployee(1);

            var actionResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedEmployee = Assert.IsType<Employee>(actionResult.Value);
            Assert.Equal(1, returnedEmployee.Id);
            Assert.Equal("John", returnedEmployee.Name);
            Assert.Equal("Doe", returnedEmployee.LastName);
        }

        [Fact]
        public async Task GetEmployee_ReturnsNotFound_WhenEmployeeDoesNotExist()
        {
            _mockEmployeeService
                .Setup(service => service.GetEmployeeById(999))
                .ReturnsAsync((Employee)null);

            var result = await _controller.GetEmployee(999);

            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task CreateEmployee_ReturnsCreatedAtAction_WithNewEmployee()
        {
            var command = new CreateEmployeeCommand
            {
                Name = "John",
                LastName = "Doe",
                Email = "john.doe@example.com",
                DocumentCode = "DOC123",
                BirthDate = new DateTime(1990, 1, 1)
            };

            var createdEmployee = new Employee
            {
                Id = 1,
                Name = "John",
                LastName = "Doe",
                Email = "john.doe@example.com",
                DocumentCode = "DOC456",
                BirthDate = new DateOnly(1991, 5, 10)
            };

            _mockEmployeeService
                .Setup(service => service.CreateEmployee(command))
                .ReturnsAsync(createdEmployee);

            var result = await _controller.CreateEmployee(command);

            var actionResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedEmployee = Assert.IsType<Employee>(actionResult.Value);
            Assert.Equal(returnedEmployee.Id, createdEmployee.Id);
            Assert.Equal(returnedEmployee.Name, createdEmployee.Name);
        }

        [Fact]
        public async Task UpdateEmployee_ReturnsNoContent_WhenUpdateSucceeds()
        {
            var command = new EditEmployeeCommand
            {
                Name = "John",
                LastName = "Updated",
                Email = "john.updated@example.com",
                DocumentCode = "DOC987",
                BirthDate = new DateTime(1990, 1, 1)
            };

            _mockEmployeeService
                .Setup(service => service.UpdateEmployee(1, command))
                .Returns(Task.CompletedTask);

            var result = await _controller.UpdateEmployee(1, command);

            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task DeleteEmployee_ReturnsNoContent_WhenDeleteSucceeds()
        {
            _mockEmployeeService
                .Setup(service => service.DeleteEmployee(1))
                .Returns(Task.CompletedTask);

            var result = await _controller.DeleteEmployee(1);

            Assert.IsType<NoContentResult>(result);
        }
    }
}