import { useState, useContext, useEffect } from "react";
import { Context } from "../..";
import { observer } from "mobx-react-lite";
import s from "./Chat.module.css";
import $api from "../../HTTP";
import { v4 as uuidv4 } from "uuid";

const Chat = () => {
  const { store } = useContext(Context);
  const [messages, setMessages] = useState([]);
  const [messageToSend, setMessageToSend] = useState("");

  useEffect(() => {
    if (store?.myHubConnection) {
      store.myHubConnection?.on("ReceiveMessage", (user, msg) => {
        setMessages((prevData) => [
          ...prevData,
          { username: user, message: msg },
        ]);
      });

      store.myHubConnection?.on("UserConnected", (connectedUser, chatUsers) => {
        store.setUsersInChat(chatUsers);
      });

      store.myHubConnection?.on(
        "UserDisconnected",
        (connectedUser, chatUsers) => {
          console.log(chatUsers);
          store.setUsersInChat(chatUsers);
        }
      );
    }
    initializeMessages();
    async function initializeMessages() {
      const initialChatMessages = await $api.get("/chat");
      setMessages(initialChatMessages.data);
    }
  }, [store, store.myHubConnection]);

  let sendMsg = () => {
    if (messageToSend !== "") {
      store.myHubConnection?.invoke("SendMessage", messageToSend);
      setMessageToSend("");
    }
  };

  return (
    <div>
      <div className={s.wrapper}>
        <div className={s.users}>
          <h2>Зараз в чаті</h2>
          {store.usersInChat.map((user) => (
            <div key={user}>{user}</div>
          ))}
        </div>

        <div className={s.messages}>
          <h2>Повідомлення</h2>
          {messages.map((message, index) => (
            <div key={uuidv4()}>
              {message.username} : {message.message}
            </div>
          ))}
          <div className={s.controls}>
            <input
              value={messageToSend}
              onChange={(e) => setMessageToSend(e.target.value)}
              placeholder="Повідомлення"
            />
            <button onClick={sendMsg}>Надіслати</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(Chat);
