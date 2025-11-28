import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// COMPONENTS
import TopNav from "./components/TopNav";

// PAGES
import HomePage from "./pages/HomePage";     // nếu bạn có
import MapPage from "./pages/MapPage";       // nếu bạn có
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <BrowserRouter>
      {/* Navbar luôn hiển thị */}
      <TopNav />

      {/* Nội dung trang */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
