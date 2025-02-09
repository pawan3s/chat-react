import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./Pages/LoginPage/Login";
import Register from "./Pages/Register/Register";
import Profile from "./Pages/ProfilePage/Profile";
import Confirmation from "./Components/Confirmation/Confirmation";
import Gallery from "./Components/Gallery/Gallery";
import Ramailo from "./Components/Ramailo/Ramailo"
import VideoChatApp from "./Components/VideoChat";

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/register' element={<Register />} />
        <Route path='/main' element={<Profile />} />
        <Route path='/confirm' element={<Confirmation />} />
        <Route path='/gallery' element={<Gallery />} />
        <Route path='/ramailo' element={<Ramailo />} />
        <Route path='/video' element={<VideoChatApp />} />
      </Routes>
    </Router>
  );
}

export default App;
