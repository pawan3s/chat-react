
import React, { useEffect, useState, useRef } from "react";
import Peer from "simple-peer";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import {socket} from "../socket";

const Container = styled.div`
 height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f4f4f4;
`;

const Row = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
`;

const Video = styled.video`
   border: 2px solid #007bff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;
const Button = styled.button`
  padding: 12px 20px;
  font-size: 10px;
  color: #fff;
  background-color:rgb(99, 226, 105);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color:rgb(32, 131, 48);
  }
`;
const EndCallButton = styled(Button)`
  background-color: #dc3545;
  &:hover {
    background-color: #c82333;
  }
`;
const Heading = styled.h1`
  font-size: 1.5rem;
  color: #333;
  text-align: center;
`;
function VideoChatApp() {
  /**
   * initial state: both player is neutral and have the option to call each other
   *
   * player 1 calls player 2: Player 1 should display: 'Calling {player 2 username},' and the
   *                          'CallPeer' button should disappear for Player 1.
   *                          Player 2 should display '{player 1 username} is calling you' and
   *                          the 'CallPeer' button for Player 2 should also disappear.
   *
   * Case 1: player 2 accepts call - the video chat begins and there is no button to end it.
   *
   * Case 2: player 2 ignores player 1 call - nothing happens. Wait until the connection times out.
   *
   */

  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const userVideo = useRef();
  const partnerVideo = useRef();
  const location = useLocation();
  const [currentPeer, setCurrentPeer] = useState(null);

  const { mySocketId, opponentSocketId, myUserName, opponentUserName} = location.state || {};
  const navigate = useNavigate();

  const endCall = () => {
    if (currentPeer) {
      currentPeer.destroy(); // Close the WebRTC peer connection
      setCurrentPeer(null);
    }
    if (stream) {
      stream.getTracks().forEach(track => track.stop()); // Stop all media tracks
      if (userVideo.current) {
        userVideo.current.srcObject = null;
      }
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = null;
      }
      setStream(null);
    }
    navigate("/main");
  };

  useEffect(() => {

    let isMounted2 = true;
    socket.emit("addUser", mySocketId); //added later

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }
      });

    socket.on("hey", (data) => {
      if(isMounted2){
        console.log("Incoming call from:", data.from);
        setReceivingCall(true);
        setCaller(data.from);
        setCallerSignal(data.signal);
      }
      return()=>{
        isMounted2 = false
        socket.off("hey")
      }
    });
  }, []);

  function callPeer(id) {
    console.log(id)
    setIsCalling(true);
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: mySocketId,
      });
    });

    peer.on("stream", (stream) => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });
  }

  function acceptCall() {
    setCallAccepted(true);
    setIsCalling(false);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("acceptCall", { signal: data, to: caller });
    });

    peer.on("stream", (stream) => {
      partnerVideo.current.srcObject = stream;
    });
    peer.signal(callerSignal);
    setCurrentPeer(peer);
  }

  let UserVideo;
  if (stream) {
    UserVideo = (
      <Video
        playsInline
        muted
        ref={userVideo}
        autoPlay
        style={{ width: "50%", height: "50%" }}
      />
    );
  }

  let mainView;

  if (callAccepted) {
    mainView = (
      <div>
      <Video
        playsInline
        ref={partnerVideo}
        autoPlay
        style={{ width: "100%", height: "100%" }}
      />
      <EndCallButton onClick={endCall}>End Call</EndCallButton>
      </div>
    );
  } else if (receivingCall) {
    mainView = (
      <div>
        <Heading>Incoming call from {opponentUserName}</Heading>
        <Button onClick={acceptCall}>
          <h1>Accept</h1>
        </Button>
      </div>
    );
  } else if (isCalling) {
    mainView = (
      <div>
        <Heading>Calling {opponentUserName}...</Heading>
      </div>
    );
  } else {
    mainView = (
      <Button
        onClick={() => {
          callPeer(opponentSocketId);
        }}
      >
        <h1>Call</h1>
      </Button>
    );
  }

  return (
    <Container>
      <Row>
        {mainView}
        {UserVideo}
      </Row>
    </Container>
  );
}

export default VideoChatApp;
