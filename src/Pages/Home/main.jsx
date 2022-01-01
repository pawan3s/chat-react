import React from "react";
import { Link } from "react-router-dom";

function Main() {
  const logout = () => {
    localStorage.removeItem("userInfo");
  };

  // console.log(userInfo);
  // useEffect(() => {

  // }, [userInfo, navigate]);

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
