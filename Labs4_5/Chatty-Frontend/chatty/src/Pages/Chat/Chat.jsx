import { HubConnectionBuilder } from "@microsoft/signalr";
import { useState, useContext } from "react";
import { Observer } from "mobx-react-lite";
import { Context } from "../..";

let myHubConnection = null;

const Chat = () => {
  const { store } = useContext(Context);

  const [messages, setMessages] = useState([]);

  let connect = async () => {
    const hubConnection = new HubConnectionBuilder()
      .withUrl(store?.url + "/chatHub")
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
    <div>
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

export default Chat;
