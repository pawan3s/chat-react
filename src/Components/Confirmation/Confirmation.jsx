import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./confirmation.scss"; 
import cat from "../../Assets/cat.jpg"
const Confirmation = () => {
    const [date, setDate] = useState("");
    const [hint, setHint] = useState(false);
    const navigate = useNavigate();
    const token = JSON.parse(localStorage.getItem("temp"));

    const handleSubmit = (e) => {
      e.preventDefault();
      if (date.toLowerCase() === "never") {
        alert("Yes, You Are My Valentine! ❤️");
        localStorage.setItem("userInfo", JSON.stringify(token));
        navigate("/ramailo");
      }
      else if(date==""){
        alert("Aha! No skipping please!❤️");
      } 
      else {
        setHint(true);
        alert("Sorry, dear ❤️, My valentine is waiting 😢");
      }
    };

    return (
      <div className="valentine-container">
        <header className="valentine-header">
          <h1 className="animated-text">Happy Valentine’s Day! 💖</h1>
        </header>
        <img className="cat__confrimation" src={cat} alt="cat"/>
        <div className="valentine-body">
          <h2 className="valentine-question">Would you mind confirming when I proposed you?</h2>
          <form onSubmit={handleSubmit} className="valentine-form">
            <input
              type="text"
              placeholder="Enter a date(dd/mm/yy)"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="valentine-input"
            />
            {hint && <p className="valentine__hint">Hint: you know me right?</p>}
            <button type="submit" className="valentine-button">
              Let's Date Babe
            </button>
            <div className="bouncing-heart">❤️❤️❤️❤️</div>
          </form>
        </div>
      </div>
    );
  };
  
  export default Confirmation;
  