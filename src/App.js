import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./Pages/LoginPage/Login";
import Register from "./Pages/Register/Register";
import Profile from "./Pages/ProfilePage/Profile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/register' element={<Register />} />
        <Route path='/main' element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
