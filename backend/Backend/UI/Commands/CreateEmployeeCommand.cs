namespace Backend.UI.Commands
{
    public class CreateEmployeeCommand
    {
        public required string Name { get; set; }
        public required string LastName { get; set; }
        public required string Email { get; set; }
        public required string DocumentCode { get; set; }
        public string? ManagerName { get; set; }
        public required DateOnly BirthDate { get; set; }
    }
}