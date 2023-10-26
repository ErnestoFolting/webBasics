using Chatty_Backend.Chat;
using Chatty_Backend.UserData;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;

namespace Chatty_Backend.Hubs
{
    public class ChatHub : Hub
    {
        public List<ChatMessage> chatMessages = new List<ChatMessage>();
        public List<string> chatUsers = new List<string>();

        public ChatHub()
        {
            chatMessages.Add(new ChatMessage("123", "123"));
            updateFile();
        }

        public async Task SendMessage (string message)
        {
            string user = Context.User.Claims.FirstOrDefault(claim => claim.Type == "user")?.Value;
            if(user != null) {
                chatMessages.Add(new ChatMessage(user, message));
                await Clients.All.SendAsync("ReceiveMessage", user, message);
                updateFile();
            }
        }

        public override async Task OnConnectedAsync()
        {
            string connectedUserName = Context.User.Claims.FirstOrDefault(claim => claim.Type == "user")?.Value;
            if(!chatUsers.Contains(connectedUserName))chatUsers.Add(connectedUserName);
            string combinedUserNames = string.Join(";", chatUsers);
            File.WriteAllText("chatusers.txt", combinedUserNames);
            await Clients.All.SendAsync("UserConnected", connectedUserName, chatUsers);
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            Console.WriteLine("Disconnected");
            string disconnectedUserName = Context.User.Claims.FirstOrDefault(claim => claim.Type == "user")?.Value;
            chatUsers.Remove(disconnectedUserName);
            string combinedUserNames = string.Join(";", chatUsers);
            File.WriteAllText("chatusers.txt", combinedUserNames);
            await Clients.All.SendAsync("UserDisconnected", disconnectedUserName, chatUsers);
            await base.OnDisconnectedAsync(exception);
        }

        private void updateFile()
        {
            string updatedJson = JsonConvert.SerializeObject(chatMessages, Formatting.Indented);
            System.IO.File.WriteAllText("messages.json", updatedJson);
        }
    }
}
