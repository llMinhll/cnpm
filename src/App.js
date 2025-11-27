import "./style.css";

import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import MapPage from "./pages/MapPage";
import AdminPage from "./pages/AdminPage";


function App() {
  return (
    <Router>
      {/* Navbar giống Flutter */}
      <nav className="navbar">
        <Link to="/">Trang chủ</Link>
        <Link to="/map">Bản đồ</Link>
        <Link to="/admin">Admin</Link>
       
      </nav>

      {/* Nội dung trang */}
      <div className="page-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
