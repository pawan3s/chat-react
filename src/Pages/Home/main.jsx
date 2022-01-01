import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Main() {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("userInfo");
  };

  const userInfo = localStorage.getItem("userInfo");

  useEffect(() => {
    if (!userInfo) {
      navigate("/");
    }
  }, [userInfo, navigate]);

  return (
    <div>
      <h1>Hello Pawan</h1>
      <Link to='/'>
        <button onClick={logout}>LogOut</button>
      </Link>
    </div>
  );
}

export default Main;
