import React from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const nav = useNavigate();

  return (
    <div className="page-container">

      <div className="card" style={{ 
        background: "linear-gradient(135deg, #0d6efd, #4ba3ff)", 
        color: "white"
      }}>
        <h1 style={{ margin: 0, fontSize: 28 }}>Chào buổi tối! 👋</h1>
        <p>Chúc bạn một ngày tốt lành</p>

        <button
          className="btn"
          style={{ background: "white", color: "#0d6efd" }}
          onClick={() => nav("/admin")}
        >
          Quản trị viên
        </button>
      </div>

      <div className="card">
        <h2>SmartBus Đà Nẵng</h2>
        <p>Ứng dụng xe buýt </p>

        <button className="btn" onClick={() => nav("/map")}>
          Xem bản đồ
        </button>

        <button className="btn" onClick={() => nav("/admin")}>
          Quản trị viên
        </button>

       
      </div>

    </div>
  );
}

export default HomePage;
