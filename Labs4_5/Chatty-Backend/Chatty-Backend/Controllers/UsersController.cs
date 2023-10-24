using Chatty_Backend.Hubs;
using Chatty_Backend.UserData;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Chatty_Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UsersController : ControllerBase
    {
        private List<User> users;
        private readonly ChatHub _hub;
        public UsersController()
        {
            try
            {
                string usersFilePath = "data.json";

                string jsonContent = System.IO.File.ReadAllText(usersFilePath);
                var users = JsonConvert.DeserializeObject<List<User>>(jsonContent);

                this.users = users;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }

        [Authorize]
        [HttpGet]
        public IEnumerable<User> Get()
        {
            return users;
        }

        [HttpGet("{username}")]
        public async Task<ActionResult<User>> Get(string username)
        {
            User? user = users.FirstOrDefault(el => el.Username == username);
            if(user != null)
            {
                return Ok(user);
            }
            else
            {
                return BadRequest("User not found");
            }
        }

        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            if (!users.Any(el => el.Username == user.Username))
            {
                user.Password = Helpers.CreateMD5(user.Password);
                users.Add(user);
                string updatedJson = JsonConvert.SerializeObject(users, Formatting.Indented);
                System.IO.File.WriteAllText("data.json", updatedJson);
                return Ok("Created new user");
            }
            else
            {
                return Conflict("An user with this username already existing");
            }
        }

        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login([FromBody] LoginData loginData)
        {
            string username = loginData.username;
            string password = Helpers.CreateMD5(loginData.password);
            if (username != null && password != null)
            {
                User? loggedUser = users.Find(el => el.Username == username && el.Password == password);
                if (loggedUser != null)
                {
                    string token = Helpers.GenerateJwtToken(loggedUser.Username, loggedUser.Role);

                    var accessOption = new CookieOptions
                    {
                        HttpOnly = true,
                        Expires = DateTime.UtcNow.AddDays(1),
                        SameSite = SameSiteMode.None,
                        Secure = true
                    };
                    Response.Cookies.Append("accessToken", token, accessOption);
                    return Ok();
                }
                else
                {
                    return BadRequest("User not found");
                }
            }
            else
            {
                return BadRequest("Login or pass is empty");
            }
        }

        [Authorize(Policy = "AdminPolicy")]
        [HttpDelete("{username}")]
        public async Task<IActionResult> Login(string username)
        {
            var userToDelete = users.Find(el => el.Username == username);
            if (userToDelete != null)
            {
                users.Remove(userToDelete);
                string updatedJson = JsonConvert.SerializeObject(users, Formatting.Indented);
                System.IO.File.WriteAllText("data.json", updatedJson);
                return Ok("User deleted");
            }
            return BadRequest("User not found");
        }

        [Authorize]
        [HttpPost]
        [Route("message")]
        public async Task SendMessage()
        {
            await _hub.SendMessage("user","messsage");
        }

        [Authorize]
        [HttpPost]
        [Route("checkAuth")]
        public IActionResult checkAuth()
        {
            return Ok();
        }

        [Authorize]
        [HttpPost]
        [Route("logout")]
        public IActionResult logout()
        {
            var cookieOption = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.Now,
                SameSite = SameSiteMode.None,
                Secure = true
            };
            Response.Cookies.Append("accessToken", "", cookieOption);
            return Ok();
        }
    }
}