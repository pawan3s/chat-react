import React, { useState, useEffect } from "react";
import "./conversation.scss";
import baseURL from "../../api/baseURL";
import axios from "axios";

function Conversation({ conversation, myId, setCurrentChat, setChatHeading,onSelectUser }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const friendId = conversation.members.find((user) => user !== myId);

    const getUser = async () => {
      try {
        const res = await axios.get(baseURL + "/users/" + friendId);
        setUser(res.data.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [myId, conversation]);

  const changeSates = () => {
    setChatHeading(user.full_Name);
    setCurrentChat(conversation);
    onSelectUser(user)
  };

  return (
    <div className='conversation' onClick={changeSates}>
      <img
        draggable='false'
        className='conversationImg'
        src={user?.profilePicture}
        alt='user'
      />
      <div className='online'></div>
      <span className='conversationName'>{user?.full_Name}</span>
    </div>
  );
}

export default Conversation;
