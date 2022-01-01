import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./Pages/LoginPage/Login";
import Home from "./Pages/Home/main";
import Register from "./Pages/Register/Register";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path='/register' element={<Register />} />
          <Route path='/home' element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
