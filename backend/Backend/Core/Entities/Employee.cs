namespace Backend.Core.Entities;

public class Employee
{
    public long Id { get; set; }
    public required string Name { get; set; }
    public required string LastName { get; set; }
    public required string Email { get; set; }
    public required string DocumentCode { get; set; }
    public string? Manager { get; set; }
    public required DateOnly BirthDate { get; set; }

}