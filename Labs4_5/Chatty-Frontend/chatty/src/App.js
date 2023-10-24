import { HubConnectionBuilder } from "@microsoft/signalr";
import { useState } from "react";
import { url } from "./Store/store";

let myHubConnection = null;

const App = () => {
  const [messages, setMessages] = useState([]);

  let connect = async () => {
    const hubConnection = new HubConnectionBuilder()
      .withUrl(url + "/chatHub")
      .withAutomaticReconnect()
      .build();
    try {
      await hubConnection?.start();
      myHubConnection = hubConnection;
      myHubConnection?.on("ReceiveMessage", (user, msg) => {
        const newMsg = { user, msg };
        setMessages((prevMessages) => [...prevMessages, newMsg]);
      });
    } catch (e) {
      console.log("errorHub", e);
    }
  };

  let sendMsg = () => {
    myHubConnection?.invoke("SendMessage", "user", new Date());
  };

  return (
    <div className="wrapper">
      <button onClick={connect}>Connect</button>
      <button onClick={sendMsg}>Send</button>
      {messages.map((message, index) => (
        <div key={message.msg}>
          {message.user} : {message.msg}
        </div>
      ))}
    </div>
  );
};

export default App;
