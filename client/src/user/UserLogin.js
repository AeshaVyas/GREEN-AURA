import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./UserLogin.css";
import SuccessPopup from "../components/SuccessPopup";

function UserLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    uemail: "",
    upassword: "",
    captchaInput: "",
  });

  const [captchaText, setCaptchaText] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  // 🔴 Track wrong login attempts
  // eslint-disable-next-line
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [showChangePassword, setShowChangePassword] = useState(false);

  // 🔐 Generate CAPTCHA
  const generateCaptcha = () => {
    const chars = "1234567890";
    let newCaptcha = "";
    for (let i = 0; i < 4; i++) {
      newCaptcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(newCaptcha);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔥 CAPTCHA VALIDATION
    if (form.captchaInput !== captchaText) {
      alert("Invalid Captcha");
      generateCaptcha();
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/user/login",
        {
          uemail: form.uemail,
          upassword: form.upassword,
        },
        { withCredentials: true }
      );

      // ✅ Reset attempts on success
      setWrongAttempts(0);
      setShowChangePassword(false);

      // ✅ Show success popup
      setShowPopup(true);

      // ✅ Redirect after popup
      setTimeout(() => {
        navigate("/");
        window.location.reload();
      }, 2000);
    } catch (error) {
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Login Failed");
      }

      generateCaptcha();

      // ❌ Increase wrong attempts
      setWrongAttempts((prev) => {
        const attempts = prev + 1;
        if (attempts >= 2) {
          setShowChangePassword(true);
        }
        return attempts;
      });
    }
  };

  return (
    <div className="login-wrapper d-flex justify-content-center align-items-center">
      <div className="login-card shadow-lg p-5">
        <h3 className="text-center mb-4 fw-bold">
          🌿 Green Aura Login
        </h3>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-4">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="uemail"
              className="form-control form-control-lg"
              value={form.uemail}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="upassword"
              className="form-control form-control-lg"
              value={form.upassword}
              onChange={handleChange}
              required
            />
          </div>

          {/* CAPTCHA */}
          <div className="mb-3">
            <label className="form-label">Enter Captcha</label>

            <div className="captcha-box d-flex align-items-center mb-2">
              <span className="captcha-text">{captchaText}</span>
              <button
                type="button"
                className="btn btn-sm btn-outline-success ms-3"
                onClick={generateCaptcha}
              >
                ↻
              </button>
            </div>

            <input
              type="text"
              name="captchaInput"
              className="form-control form-control-lg"
              value={form.captchaInput}
              onChange={handleChange}
              required
            />
          </div>

          {/* 🔐 SHOW CHANGE PASSWORD ONLY AFTER 2 WRONG ATTEMPTS */}
          {showChangePassword && (
            <div className="text-center mt-3">
              <Link
                to="/reset-password"
                className="text-light fw-semibold d-block"
              >
                Change Password
              </Link>
            </div>
          )}

          <button className="btn btn-success btn-lg w-100 mt-3">
            Login
          </button>
        </form>

        <div className="text-center mt-4">
          Don't have an account?{" "}
          <Link to="/user-register" className="text-light fw-semibold">
            Register
          </Link>
        </div>
      </div>

      <SuccessPopup
        show={showPopup}
        title="Thank You!"
        message="You have logged in successfully."
        onClose={() => setShowPopup(false)}
      />
    </div>
  );
}

export default UserLogin;