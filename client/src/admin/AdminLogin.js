import React, { useState } from "react";
import axios from "axios";
import "./AdminLogin.css";
import { useNavigate, Link } from "react-router-dom";

function AdminLogin() {
  const [aemail, setAemail] = useState("");
  const [apassword, setApassword] = useState("");

  const [captcha, setCaptcha] = useState(
    Math.floor(1000 + Math.random() * 9000)
  );
  const [captchaInput, setCaptchaInput] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔐 Captcha Check
    if (captchaInput !== captcha.toString()) {
      alert("Invalid Captcha!!🌿");
      setCaptcha(Math.floor(1000 + Math.random() * 9000));
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/admin/login",
        { aemail, apassword }
      );

      // ✅ Save admin session
      localStorage.setItem("isAdmin", "true");
      localStorage.setItem("adminEmail", aemail);

      // ✅ Save last login for AdminHeader
      if (res.data.lastLogin) {
        localStorage.setItem("lastLogin", res.data.lastLogin);
      }

      alert(
        `Login Successful\nLast Login: ${
          res.data.lastLogin
            ? new Date(res.data.lastLogin).toLocaleString()
            : "First Time Login"
        }`
      );

      navigate("/read-category");

    } catch (error) {
      alert("Invalid Credentials!!🌿");
    }
  };

  return (
    <div className="admin-wrapper">
      <div className="admin-card">

        {/* Logo */}
        <div className="logo-section">
          <div className="leaf-icon">🌿</div>
          <h1 className="brand-name">Green Aura</h1>
        </div>

        <h3 className="admin-title">Admin Login🌿</h3>

        <form onSubmit={handleSubmit}>

          <div className="form-group text-white">
            <label className="text white">Email Address</label>
            <input
              type="email"
              value={aemail}
              onChange={(e) => setAemail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={apassword}
              onChange={(e) => setApassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Captcha : <b>{captcha}</b></label>
            <input
              type="text"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>

        </form>

        <p className="text-center mt-3">
          <Link to="/admin-forgot-password">Forgot Password?</Link>
        </p>

      </div>
    </div>
  );
}

export default AdminLogin;