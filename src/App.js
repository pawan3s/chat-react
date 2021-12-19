import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./Pages/LoginPage/Login";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path='/' element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
