import React, { useEffect, useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./TopNav.css";

export default function TopNav() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("bus_token");
    if (token) {
      fetch("http://localhost:3000/api/auth/me", {
        headers: { Authorization: "Bearer " + token }
      })
        .then(res => res.json())
        .then(data => {
          if (data.email) setUser(data);
        });
    }
  }, []);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logout = () => {
    localStorage.removeItem("bus_token");
    navigate("/login");
  };

  return (
    <header className="topnav-root">
      <div className="topnav-inner">

        <div className="topnav-logo">
          <span className="topnav-logo-dot" />
          <span>SmartBus </span>
        </div>

        <nav className="topnav-links">
          <NavLink to="/" className="topnav-link">Trang chủ</NavLink>
          <NavLink to="/map" className="topnav-link">Bản đồ</NavLink>
          <NavLink to="/admin" className="topnav-link">Quản trị</NavLink>
        </nav>

        {/* User Area */}
        <div className="topnav-right" ref={dropdownRef}>
          {user ? (
            <div className="topnav-user-box">
              <div
                className="topnav-user"
                onClick={() => setOpen(!open)}
              >
                <div className="avatar">{user.full_name.charAt(0)}</div>
                <span className="username">{user.full_name}</span>
              </div>

              {open && (
                <div className="topnav-dropdown show">
                  <button onClick={() => navigate("/profile")}>Hồ sơ</button>
                  <button onClick={logout}>Đăng xuất</button>
                </div>
              )}
            </div>
          ) : (
            <button className="login-btn" onClick={() => navigate("/login")}>
              Đăng nhập
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
