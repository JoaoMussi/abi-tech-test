namespace Backend.Application.Commands
{
    public class EditEmployeeCommand
    {
        public required long Id { get; set; }
        public required string Name { get; set; }
        public required string LastName { get; set; }
        public required string Email { get; set; }
        public required string DocumentCode { get; set; }
        public required string Role { get; set; }
        public string? ManagerName { get; set; }
        public required DateTime BirthDate { get; set; }
        public DateTime? HiringDate { get; set; }
        public double? Salary { get; set; }
        public required string Phone { get; set; }
    }
}