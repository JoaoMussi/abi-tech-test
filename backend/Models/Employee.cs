namespace Backend.Models;

public class Employee
{
    public long Id { get; set; }
    public string Name { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string DocumentCode { get; set; }
    public string? ManagerName { get; set; }
    public DateOnly BirthDate { get; set; }

}