import React, { useState } from "react";
import Register_svg from "../../Assets/svg/register.svg";
import "./Register.scss";
import { Link } from "react-router-dom";
import Loader from "../../Components/Loader";
import isEmail from "validator/lib/isEmail";

//store
import { register } from "../../Store/actions/userAction";
import { clean } from "../../Store/actions/userAction";
import { useDispatch, useSelector } from "react-redux";

function SignUP() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConformPassword] = useState("");
  const [errorState, setErrorState] = useState({
    usernameError: "",
    emailError: "",
    passwordError: "",
    matchpasswordError: "",
  });

  const dispatch = useDispatch();
  const userRegister = useSelector((state) => state.userRegister);

  const { loading, error, message } = userRegister;

  const validate = () => {
    let usernameError = "";
    let emailError = "";
    let passwordError = "";
    let matchpasswordError = "";
    if (!username) {
      usernameError = "Username is required";
    }
    if (!email || !isEmail(email)) {
      emailError = "Please Enter a valid email ";
    }
    if (!password || password.length < 8) {
      passwordError = "Password must be of 8 characters";
    }
    if (password !== confirmPassword) {
      matchpasswordError = "Passowrd didnot match";
    }
    if (emailError || usernameError || passwordError || matchpasswordError) {
      setErrorState({
        usernameError,
        emailError,
        passwordError,
        matchpasswordError,
      });
      return false;
    }
    return true;
  };

  const registerHandler = (e) => {
    e.preventDefault();
    if (validate()) {
      dispatch(register(email, username, password));
      setErrorState({
        usernameError: "",
        emailError: "",
        passwordError: "",
        matchpasswordError: "",
      });
    }
  };

  const clearError = () => {
    dispatch(clean());
  };
  return (
    <div className='register__body'>
      <div className='register__container'>
        <h1>Sign Up</h1>
        <div className='register__form'>
          <form className='register-form' onSubmit={registerHandler}>
            <input
              type='email'
              name='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='E-mail'
            />
            <span>{errorState.emailError}</span>
            <input
              type='text'
              name='UserName'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder='UserName'
            />
            <span>{errorState.usernameError}</span>
            <input
              type='password'
              name='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='password'
            />
            <span>{errorState.passwordError}</span>
            <input
              type='password'
              name='password'
              value={confirmPassword}
              onChange={(e) => setConformPassword(e.target.value)}
              placeholder='Confirm Passowrd'
            />
            <span>{errorState.matchpasswordError}</span>
            {loading ? (
              <Loader />
            ) : (
              <button type='submit' className='register__btn'>
                Register
              </button>
            )}
            <p className='register__message'>
              Already registered?<Link to='/'> Sign in</Link>
            </p>
          </form>
          {message && (
            <div className='register__success'>
              <span>{message}</span>
            </div>
          )}
          {error && (
            <div className='register__error'>
              <span>{error}</span>
              <button onClick={clearError}>ok</button>
            </div>
          )}
        </div>
      </div>
      <img src={Register_svg} alt='register' />
    </div>
  );
}

export default SignUP;
