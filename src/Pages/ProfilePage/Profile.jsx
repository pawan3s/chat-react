import React, { useEffect, useState } from "react";
import image from "../../Assets/defaultimg.png";
import icon from "../../Assets/svg/camera.svg";
import loop from "../../Assets/svg/loop.svg";
import send from "../../Assets/svg/send.svg";
import video_icon from "../../Assets/svg/video_icon.svg"
import { useNavigate } from "react-router";
import Message from "../../Components/Message/Message";
import Loader from "../../Components/Loader/Loader";
// import Button from "@mui/material/Button";
// import Modal from "@mui/material/Modal";
import "./Profile.scss";

//emojis
import Picker from '@emoji-mart/react'


import baseURL from "../../api/baseURL";
import axios from "axios";
import Conversation from "../../Components/Conversation/Conversation";
import { useRef } from "react";
import { io } from "socket.io-client";

export default function Profile() {
  // const [open, setOpen] = useState(false);
  // const [confrimChat, setConfrimChat] = useState(false);
  const navigate = useNavigate();
  const [updating, setUpdating] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [userData, setUserData] = useState({});
  const [friendList, setFriendList] = useState([]);
  const [onlineFriendList, setOnlineFriendList] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [strangers, setStrangers] = useState([]);
  const [friendSocketId, setFriendSocketId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [socketUsers, setSocketUsers] = useState([]);

  const socket = useRef();

  const [chatHeading, setChatHeading] = useState("");
  const [fethching, setFetching] = useState(false);
  const scrollRef = useRef();

  const [showPicker, setShowPicker] = useState(false);

  const token = localStorage.getItem('userInfo');
  let id
  if(token){
    id = JSON.parse(
      atob(localStorage.getItem("userInfo").split(".")[1])
    ).id;
  }


  const handleEmojiSelect = (emoji) => {
    setNewMessage((prev) => prev + emoji.native); // Append emoji to the message
  };

  useEffect(()=>{
    if (!token){
      navigate("/")
    }
  },[])

  //socket
  useEffect(() => {
    // socket.current = io("https://faith.zapto.org");
    socket.current = io("http://localhost:8000");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        user: data.senderId,
        message: data.message,
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage && currentChat?.members.includes(arrivalMessage.user);
    setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    socket.current.emit("addUser", id);
    socket.current.on("getUsers", (users) => {
      setOnlineFriendList(
        friendList.filter((f) => users.some((u) => u.userId === f._id))
      );
      setSocketUsers(users)
    });
    

  }, [id]);
  
  useEffect(()=>{
    const friendId = selectedUser?._id;
      const friend = socketUsers?.find((user) => user?.userId == friendId);
      if (friend) {
        setFriendSocketId(friend?.socketId);
      }
      else{
        setFriendSocketId("offline");
      }
  },[selectedUser])
  
  //fetch activities
  useEffect(() => {
    if (localStorage.getItem("userInfo") === null) {
      navigate(`/`);
    }
    localStorage.removeItem("temp");
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
    if(id){
      fetchMe();
    }
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
    if(id){
      fetchUsers();
    }
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
    if(id){
    fetchConversations();

    }
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

  useEffect(() => {
    const convId = [];
    conversations.forEach((element) => {
      element.members.filter((m) => convId.push(m));
    });
    const finalId = convId.filter((m) => m !== id);
    setStrangers(friendList.filter((f) => !finalId.includes(f._id)));
  }, [conversations, id, friendList]);

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
    if (newMessage !== "") {
      const receiverId = currentChat.members.find((member) => member !== id);
      socket.current.emit("sendMessage", {
        senderId: id,
        receiverId: receiverId,
        message: newMessage,
      });
      try {
        const { data } = await axios.post(baseURL + "/messages", message, {
          headers: { Authorization: "Bearer " + token },
        });
        setMessages([...messages, data.message]);
        setNewMessage("");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const createChat = async (receiveId) => {
    // setOpen(true);
    const token = JSON.parse(localStorage.getItem("userInfo"));
    const conversation = {
      senderId: id,
      receiverId: receiveId,
    };
    try {
      const { data } = await axios.post(
        baseURL + "/conversations",
        conversation,
        {
          headers: { Authorization: "Bearer " + token },
        }
      );
      setConversations([...conversations, data.newConversation]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [messages]);

  const logout = () => {
    localStorage.removeItem("userInfo");
  };
  const pickerRef = useRef(null); 
  const handleClickOutside = (event) => {
    if (pickerRef.current && !pickerRef.current.contains(event.target)) {
      setShowPicker(false); // Close the picker if clicked outside
    }
  };

  useEffect(() => {
    if (showPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPicker]);

  const videoCall= ()=>{
    if(friendSocketId !=="offline"){
      navigate("/video",{
        state: {
          mySocketId: socket.current.id,
          opponentSocketId: friendSocketId,
          myUserName: userData.full_Name,
          opponentUserName: chatHeading
        }
      });
    }
    else{
      alert(`${chatHeading} is offline!`)
    }
    console.log(friendSocketId)
  }

  return (
    <div className='main__container'>
      {/* <header className="header">
        <img src="faith.png" alt="Faith" className="header-image" />
      </header> */}
    <div className='Profile__container'>
      {/* @section => main content */}

      <div className='Profile__container__main__userimage'>
        <div className='profile__area'>
          <div className='picture'>
            <img
              draggable='false'
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
            placeholder='Search for friends'`
            className='search__field'
          /> */}
          <span className='your__valentine'>Your Valentines</span>
          <div className='conversation__list'>
            {conversations.map((c, index) => (
              <div key={index}>
                <Conversation
                  conversation={c}
                  myId={id}
                  setCurrentChat={setCurrentChat}
                  setChatHeading={setChatHeading}
                  onSelectUser={setSelectedUser}
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
              <img className="video__icon" draggable='false' src={video_icon} alt='friend' onClick={() => videoCall()}/>
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
                <div className='emoji__container' ref={pickerRef}>
                  <button 
                    className='emoji-button' 
                    onClick={(e) => {
                      e.preventDefault();
                      setShowPicker((prev) => !prev)
                    }}>
                      😊
                    </button>
                  {showPicker && (
                    <div className="emoji-picker">
                      <Picker onEmojiSelect={handleEmojiSelect} />
                    </div>
                  )}
                </div>
                
                <button className='send' type='submit'>
                  <img src={send} alt='send' />
                </button>
              </div>
            </form>
          </>
        ) : (
            <div className="background-container">
              <div className="overlay"></div>
              <div className="content">
                <h1>Click your valentines on the left to chat</h1>
              </div>
            </div>
          // <span className='noCurrentChat'>
          //   Open a Conversation to start chatting
          // </span>
        )}
      </div>
      {/* allusers */}
      {strangers.length > 0 && (
      <div className='users__container__main'>
        <span className='all__users'>Stranger Friends</span>
        <div className='user__list'>
          {strangers.map((friend, index) => (
            <div
              className='user'
              key={index}
              onClick={() => createChat(friend._id)}
            >
              <img draggable='false' src={friend.profilePicture} alt='friend' />
              <span>{friend.full_Name}</span>
            </div>
          ))}
        </div>
      </div>
      )}
    </div>
    <footer className='footer'>
    <p>© 2025 ChatApp. All rights reserved.</p>
    <p>
      Built with ❤️ by <a href='https://portfoliopawan29s.web.app/'>Pawan Subedi</a>
    </p>
  </footer>
    </div>
  );
}

// yo kai pani haina
