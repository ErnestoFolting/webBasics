using Microsoft.AspNetCore.SignalR;

namespace Chatty
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }
        public override Task OnConnectedAsync()
        {
            var connectionId = Context.ConnectionId;
            Console.WriteLine(connectionId);
            return base.OnConnectedAsync();
        }
    }
}
