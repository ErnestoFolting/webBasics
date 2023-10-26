using Newtonsoft.Json;

namespace Chatty_Backend.Chat
{
    [Serializable]
    public class ChatMessage
    {
        public string username { get; set; }
        public string message { get; set; }
        public ChatMessage(string username, string message)
        {
            this.username = username; 
            this.message = message;
        }
    }
}
