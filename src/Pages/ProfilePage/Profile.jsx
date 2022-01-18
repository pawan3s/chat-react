import React, { useEffect, useState } from "react";
import image from "../../Assets/defaultimg.png";
import icon from "../../Assets/svg/camera.svg";
import loop from "../../Assets/svg/loop.svg";
import send from "../../Assets/svg/send.svg";
import { useNavigate } from "react-router";
// import messages from "./message.json";
import Message from "../../Components/Message/Message";
import Loader from "../../Components/Loader/Loader";

import "./Profile.scss";

import baseURL from "../../api/baseURL";
import axios from "axios";
import Conversation from "../../Components/Conversation/Conversation";
import { useRef } from "react";

export default function Profile() {
  const navigate = useNavigate();
  const [updating, setUpdating] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [userData, setUserData] = useState({});
  const [friendList, setFriendList] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [chatHeading, setChatHeading] = useState("");
  const [fethching, setFetching] = useState(false);
  const scrollRef = useRef();

  const id = JSON.parse(
    atob(localStorage.getItem("userInfo").split(".")[1])
  ).id;

  useEffect(() => {
    if (localStorage.getItem("userInfo") === null) {
      navigate(`/`);
    }
  }, [navigate]);
  useEffect(() => {
    const fetchMe = async () => {
      try {
        await axios
          .get(baseURL + "/users/" + id)
          .then((response) => setUserData(response.data.data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchMe();
  }, [id]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await axios
          .get(baseURL + "/users?_id[ne]=" + id)
          .then((response) => setFriendList(response.data.data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, [id]);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("userInfo"));
    const fetchConversations = async () => {
      try {
        const { data } = await axios.get(baseURL + "/conversations/" + id, {
          headers: { Authorization: "Bearer " + token },
        });
        setConversations(data.conversations);
      } catch (error) {
        console.log(error);
      }
    };
    fetchConversations();
  }, [id]);

  useEffect(() => {
    setFetching(true);
    const token = JSON.parse(localStorage.getItem("userInfo"));
    const getMessages = async () => {
      if (currentChat !== null) {
        try {
          const { data } = await axios.get(
            baseURL + "/messages/" + currentChat?._id,
            {
              headers: { Authorization: "Bearer " + token },
            }
          );
          setMessages(data.messages);
          setFetching(false);
        } catch (error) {
          console.log(error);
        }
      }
    };
    getMessages();
  }, [currentChat]);
  const updateProfile = async (e) => {
    if (!e.target.files.length) return;
    setUpdating(true);

    const formData = new FormData();
    formData.append("profilePicture", e.target.files[0]);
    await axios
      .put(baseURL + "/users/" + id, formData)
      .then(({ data }) => {
        setUserData(data.data);
        setUpdating(false);
      })
      .catch((error) => {
        console.log(error);
        setUpdating(false);
      });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    const token = JSON.parse(localStorage.getItem("userInfo"));
    const message = {
      conversation: currentChat._id,
      user: id,
      message: newMessage,
    };
    try {
      const { data } = await axios.post(baseURL + "/messages", message, {
        headers: { Authorization: "Bearer " + token },
      });
      setMessages([...messages, data.message]);
      setNewMessage("");
    } catch (error) {}
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [messages]);

  const logout = () => {
    localStorage.removeItem("userInfo");
  };

  return (
    <div className='Profile__container'>
      {/* @section => main content */}
      <div className='Profile__container__main__userimage'>
        <div className='profile__area'>
          <div className='picture'>
            <img
              className='user__img'
              alt='user'
              src={userData.profilePicture ? userData.profilePicture : image}
            />
            {updating ? (
              <label>
                <img
                  src={loop}
                  alt='loop'
                  style={{ width: "20px", height: "20px" }}
                />
              </label>
            ) : (
              <label>
                <img
                  src={icon}
                  alt='cam'
                  style={{ width: "20px", height: "20px" }}
                />
                <input type='file' onChange={updateProfile} accept='image/*' />
              </label>
            )}
          </div>

          <div className='name'>{userData.full_Name}</div>
          <div className='user__em'>{userData.username}</div>
          <div className='user__em'>{userData.email}</div>
          {/* <div className='user__em'>{userData._id}</div> */}
          <a href='/'>
            <button className='logout' onClick={logout}>
              Logout
            </button>
          </a>
        </div>

        <div className='conversation__list__area'>
          {/* <input
            type='text'
            placeholder='Search for friends'
            className='search__field'
          /> */}
          <div className='conversation__list'>
            {conversations.map((c, index) => (
              <div>
                <Conversation
                  conversation={c}
                  myId={id}
                  setCurrentChat={setCurrentChat}
                  setChatHeading={setChatHeading}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className='chat__area'>
        {currentChat ? (
          <>
            <div className='chat__header'>
              <h3>{chatHeading}</h3>
            </div>
            <div className='chat__area__content'>
              {!fethching ? (
                messages.map((m, index) => (
                  <div ref={scrollRef} key={index}>
                    <Message message={m} own={m.user === id} />
                  </div>
                ))
              ) : (
                <Loader />
              )}
            </div>
            <form onSubmit={sendMessage} className='form'>
              <div className='input__field__footer'>
                <input
                  type='text'
                  placeholder='Message...'
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button className='send' type='submit'>
                  <img src={send} alt='send' />
                </button>
              </div>
            </form>
          </>
        ) : (
          <span className='noCurrentChat'>
            Open a Conversation to start chatting
          </span>
        )}
      </div>
      {/* allusers */}
      <div className='users__container__main'>
        <span className='all__users'>Start New Chat</span>
        <div className='user__list'>
          {friendList.map((friend, index) => (
            <div className='user' key={index}>
              <img src={friend.profilePicture} alt='friend' />{" "}
              <span>{friend.full_Name}</span>
            </div>
          ))}
        </div>
      </div>
      {/* allusers end */}
    </div>
  );
}

// yo kai pani haina
