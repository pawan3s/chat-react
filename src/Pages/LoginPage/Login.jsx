import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import login_svg from "../../Assets/svg/login.svg";
import "./Login.scss";
import { Link } from "react-router-dom";
import Loader from "../../Components/Loader/Loader";

//store
import { login } from "../../Store/actions/userAction";
import { clean } from "../../Store/actions/userAction";
import { useDispatch, useSelector } from "react-redux";
import isEmail from "validator/lib/isEmail";

function SignIn() {
  const navigate = useNavigate();
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

  useEffect(() => {
    if (userInfo) {
      navigate(`/confirm`);
    }
  }, [userInfo, navigate]);

  const clearError = () => {
    dispatch(clean());
  };
  return (
    <div className='login__body'>
      <div className='login__container'>
        {error && (
          <div className='login__error'>
            <span>{error}</span>
            <button onClick={clearError}>ok</button>
          </div>
        )}
        <h1>Sign in</h1>
        <div className='login__form'>
          <form className='login-form' onSubmit={loginHandler}>
            <input
              type='email'
              name='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='E-mail'
              autoComplete="on"
            />
            <span>{emailError}</span>
            <input
              type='password'
              name='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='password'
              autoComplete="on"
            />
            {loading ? (
              <Loader />
            ) : (
              <button type='submit' className='login__btn'>
                Login
              </button>
            )}
            <p className='login__message'>
              Not registered yet?<Link to='/register'> Sign up</Link>
            </p>
          </form>
        </div>
      </div>
      <img src={login_svg} alt='login' />
    </div>
  );
}

export default SignIn;
