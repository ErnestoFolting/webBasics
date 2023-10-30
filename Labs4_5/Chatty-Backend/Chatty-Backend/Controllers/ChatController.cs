using Chatty_Backend.Chat;
using Chatty_Backend.Hubs;
using Chatty_Backend.UserData;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Chatty_Backend.Controllers
{
    [Route("/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly ChatHub _hub;
        public ChatController(ChatHub hub)
        {
            _hub = hub;
        }

        [HttpGet]
        public IEnumerable<ChatMessage> Get()
        {
            string jsonContent = System.IO.File.ReadAllText("messages.json");
            List<ChatMessage> messages = JsonConvert.DeserializeObject<List<ChatMessage>>(jsonContent);
            return messages;
        }
    }
}
