import React from 'react'
import "../../styles/chatStyle.css";
export default function Message({own, text}) {
  return (
    <div className={own ? "message own" : "message"}>
        <p className="messageText">{text}</p>
    </div>
  )
}