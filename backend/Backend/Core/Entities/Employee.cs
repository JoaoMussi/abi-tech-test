namespace Backend.Core.Entities
{
    public class Employee
    {
        public long Id { get; set; }
        public required string Name { get; set; }
        public required string LastName { get; set; }
        public required string Email { get; set; }
        public required string DocumentCode { get; set; }
        public required string Role { get; set; }
        public string? ManagerName { get; set; }
        public required DateOnly BirthDate { get; set; }
        public DateOnly? HiringDate { get; set; }
        public double? Salary { get; set; }
        public required string Phone { get; set; }
        public required string PasswordHash { get; set; }
        public bool Deleted { get; set; } = false;
    }
}
