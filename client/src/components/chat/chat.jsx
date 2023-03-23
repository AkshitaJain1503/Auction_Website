
import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

function Chat({socket,username,room,contactName,product}) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  socket.emit("join_room", room);
  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        roomId: room,
        from: username,
        to: contactName,
        messageBody: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          String(new Date(Date.now()).getMinutes()).padStart(2, "0"),
      };
      setMessageList((list) => [...list, messageData]);
      await socket.emit("send_message", messageData);
      setCurrentMessage("");
    }
  };
  
    socket.on('history', (messages) => {
      setMessageList((list) => messages);
    });
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Name : {contactName} </p>
        <p>Product :{product}</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent) => {
            return (
              <div
                className="message"
                id={username === messageContent.from ? "other" : "you"}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.messageBody}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.from}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyUp={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}

export default Chat;