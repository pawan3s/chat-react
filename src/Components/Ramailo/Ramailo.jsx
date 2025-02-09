import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ramailo.scss"; 
import cat from "../../Assets/cat2.jpeg"
import cat_request from "../../Assets/cat_request.jpg"
import cat_yes from "../../Assets/cat_yes.jpg"

const Confirmation = () => {
    const [clickNo, setClickNo] = useState(0);
    const [clickYes, setClickYes] = useState(false);
    const [noButtonStyle, setNoButtonStyle] = useState({});
    const navigate = useNavigate();

    const handleYes = () => {
        setClickYes(true)
        setTimeout(() => {
            navigate("/gallery"); // Navigate after 3 seconds
          }, 3000);

    };
    const handleNo = () => {
        setClickNo(clickNo + 1);
    };

    const moveButton = () => {
        if (clickNo > 0) {
          // Change position randomly
          setNoButtonStyle({
            position: "absolute",
            top: `${Math.random() * 70 + 10}%`,
            left: `${Math.random() * 70 + 10}%`,
            transition: "top 0.2s, left 0.2s",
          });
        }
      };
      const token = JSON.parse(localStorage.getItem("temp"));
      useEffect(()=>{
        if (!token){
          navigate("/")
        }
      },[])
    return (
      <div className="ramailo-container">
        {clickYes?<h1 className="I_knew">I knew it Babe 💖</h1>:
        <header className="valentine-header">
        {clickNo>0?
        <h1 className="animated-text">Socha hai Socha ajai time chha</h1>
        :<h1 className="animated-text">Hey Paaste will you be my Valentine 💖?</h1>}
        </header>}
        {clickNo>0? !clickYes &&
        <img className="cat__request" src={cat_request} alt="cat_request"/>:!clickYes &&
        <img className="cat__confrimation" src={cat} alt="cat"/>}
        {clickYes && <img className="cat__confrimation" src={cat_yes} alt="cat_yes"/>}
        {!clickYes && <div className="ramailo-body">
          <div className="ramailo-form">
            <button type="submit" className="ramailo-button" onClick={handleYes}>
              Yes
            </button>
            <button 
            type="submit" 
            className="ramailo-button" 
            onClick={handleNo}
            onMouseEnter={moveButton}
            style={noButtonStyle}>
              No
            </button>
          </div>
          <div className="bouncing-heart">❤️❤️❤️❤️</div>
        </div>}
      </div>
    );
  };
  
  export default Confirmation;
  