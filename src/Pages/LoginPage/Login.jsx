import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import login_svg from "../../Assets/svg/login.svg";
import "./Login.scss";
import { Link } from "react-router-dom";
import Loader from "../../Components/Loader";

//store
import { login } from "../../Store/actions/userAction";
import { clean } from "../../Store/actions/userAction";
import { useDispatch, useSelector } from "react-redux";
import isEmail from "validator/lib/isEmail";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");

  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);

  const { loading, userInfo, error } = userLogin;

  const validate = () => {
    let invalidEmail = "";
    if (!email || !isEmail(email)) {
      invalidEmail = "Please enter a valid email";
    }
    if (invalidEmail) {
      setEmailError(invalidEmail);
      return false;
    }
    return true;
  };

  const loginHandler = (e) => {
    e.preventDefault();
    if (validate()) {
      dispatch(login(email, password));
      setEmailError("");
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo) {
      navigate("/home");
    }
  }, [userInfo, navigate]);

  const clearError = () => {
    dispatch(clean());
  };
  return (
    <form className='base-container' noValidate onSubmit={loginHandler}>
      <div className='header'>Login</div>
      <div className='content'>
        <div className='image'>
          <img src={login_svg} alt='login' />
        </div>
        <div className='form'>
          <div className='form-group'>
            <label htmlFor='email'>E-mail</label>
            <input
              type='email'
              name='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='E-mail'
            />
            <span>{emailError}</span>
          </div>
          <div className='form-group'>
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              name='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='password'
            />
          </div>
        </div>
        <div className='Login-forgetRegister'>
          <Link className='registerUser float-left' to='/register'>
            Not a member yet? Register
          </Link>
        </div>
      </div>
      {loading ? (
        <Loader />
      ) : (
        <div className='login__footer'>
          <button type='submit' className='btn'>
            Login
          </button>
        </div>
      )}
      {error && (
        <div className='login__error'>
          <span>{error}</span>
          <button onClick={clearError}>x</button>
        </div>
      )}
    </form>
  );
}

export default SignIn;
