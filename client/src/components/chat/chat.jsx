
// }
import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

function Chat({socket,username,room}) {
        const params = new Proxy(new URLSearchParams(window.location.search),{
            get : (searchParams,prop) => searchParams.get(prop),
        })
        let contactName = params.name;
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
          new Date(Date.now()).getMinutes(),
      };
      setMessageList((list) => [...list, messageData]);
      socket.emit("send_message", messageData);
      setCurrentMessage("");
    }
  };
  //useEffect(()=>{
  
    socket.on('history', (messages) => {
      //if(Object.keys(messages).length > 0){
      //console.log(messages);
      setMessageList((list) => messages);
      //}
    });

  //})
  //useEffect(() => {
    socket.on("receive_message", (data) => {
      //console.log(data);
      if(data && !messageList.includes(data)){
      setMessageList((list) => [...list, data]);}
    });
 // }, [socket]);

//   useEffect(()=>{
//     socket.emit("join_room", room);
//     socket.emit("join_room", userId);
//   })
//console.log(messageList);
  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>{contactName}</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent) => {
            return (
              <div
                className="message"
                id={username === messageContent.from ? "you" : "other"}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.messageBody}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p>{messageContent.from}</p>
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
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}

export default Chat;