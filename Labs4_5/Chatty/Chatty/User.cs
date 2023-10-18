namespace Chatty;
public class User
{
    public string Username { get; set; }
    public string Password { get; set; }
    public string Name { get; set; }
    public UserRolesEnum Role{ get; set; }
    public User()
    {
        Role = UserRolesEnum.user;
    }
    public User(string username, string pass, string name)
    {
        Username = username;
        Password = pass;
        Name = name;
        Role = UserRolesEnum.user;
    }
}