namespace Backend.Application.Dto
{
    public class EmployeeDto
    {
        public required long Id { get; set; }
        public required string Name { get; set; }
        public required string LastName { get; set; }
        public required string Email { get; set; }
        public required string DocumentCode { get; set; }
        public required string Role { get; set; }
        public string? ManagerName { get; set; }
        public required DateTime BirthDate { get; set; }
        public required string Phone { get; set; }
    }
}