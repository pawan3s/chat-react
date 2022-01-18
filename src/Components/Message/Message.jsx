import React from "react";
import "./message.scss";
function Message({ own, message }) {
  return (
    <div className={own ? "message own" : "message"}>
      <span className='messageText'>{message.message}</span>
    </div>
  );
}

export default Message;
