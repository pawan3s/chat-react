import React from "react";
import Illustration from "./llustration.svg";
import "./Login.scss";
import { Link } from "react-router-dom";

function Login() {
  const loginHandler = () => {
    console.log("loggedIn");
  };
  return (
    <div className='base-container'>
      <div className='header'>Login</div>
      <div className='content'>
        <div className='image'>
          <img src={Illustration} alt='login' />
        </div>
        <div className='form'>
          <div className='form-group'>
            <label htmlFor='username'>Username</label>
            <input type='text' name='username' placeholder='username' />
          </div>
          <div className='form-group'>
            <label htmlFor='password'>Password</label>
            <input type='password' name='password' placeholder='password' />
          </div>
        </div>
        <div className='Login-forgetRegister'>
          <Link className='registerUser float-left' to='/register'>
            Not a member yet? Register
          </Link>
        </div>
      </div>
      <div className='footer'>
        <Link to='/login'>
          {" "}
          <button type='button' className='btn' onClick={loginHandler}>
            Login
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Login;
