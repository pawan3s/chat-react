import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Register_svg from "../../Assets/svg/register.svg";
import "./Register.scss";
import { Link } from "react-router-dom";
import Loader from "../../Components/Loader";
import isEmail from "validator/lib/isEmail";

//store
import { login } from "../../Store/actions/userAction";
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
  const userLogin = useSelector((state) => state.userLogin);

  const { loading, userInfo, error } = userLogin;

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

  const loginHandler = (e) => {
    e.preventDefault();
    if (validate()) {
      dispatch(login(email, password));
      setErrorState({
        usernameError: "",
        emailError: "",
        passwordError: "",
        matchpasswordError: "",
      });
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
      <div className='header'>Register</div>
      <div className='content'>
        <div className='image'>
          <img src={Register_svg} alt='register' />
        </div>
        <div className='form'>
          <div className='form-group'>
            <label htmlFor='email'>E-mail</label>
            <input
              type='text'
              name='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='E-mail'
            />
            <span>{errorState.emailError}</span>
          </div>
          <div className='form-group'>
            <label htmlFor='username'>User-Name</label>
            <input
              type='text'
              name='UserName'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder='UserName'
            />
            <span>{errorState.usernameError}</span>
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
            <span>{errorState.passwordError}</span>
          </div>
          <div className='form-group'>
            <label htmlFor='password'> Confirm Password</label>
            <input
              type='password'
              name='password'
              value={confirmPassword}
              onChange={(e) => setConformPassword(e.target.value)}
              placeholder='Confirm Passowrd'
            />
            <span>{errorState.matchpasswordError}</span>
          </div>
        </div>
        <div className='already__registered'>
          <Link className='registerUser float-left' to='/'>
            Already a member?Login
          </Link>
        </div>
      </div>
      {loading ? (
        <Loader />
      ) : (
        <div className='footer'>
          <button type='submit' className='btn'>
            Register
          </button>
        </div>
      )}
      {error && (
        <div className='error'>
          <span>{error}</span>
          <button onClick={clearError}>x</button>
        </div>
      )}
    </form>
  );
}

export default SignUP;
