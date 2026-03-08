import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./UserLogin.css";

function ResetPassword() {
  const navigate = useNavigate();

  const [uemail, setUemail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/user/reset-password",
        {
          uemail,
          newPassword: password,
        }
      );

      setMessage(res.data.message);

      setTimeout(() => {
        navigate("/user-login");
      }, 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="login-wrapper d-flex justify-content-center align-items-center">
      <div className="login-card shadow-lg p-5">

        <h3 className="text-center fw-bold mb-4">
          🔑 Change Password
        </h3>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-3">
            <label className="form-label">Registered Email</label>
            <input
              type="email"
              className="form-control form-control-lg"
              value={uemail}
              onChange={(e) => setUemail(e.target.value)}
              required
            />
          </div>

          {/* New Password */}
          <div className="mb-3">
            <label className="form-label">New Password</label>
            <input
              type="password"
              className="form-control form-control-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-control form-control-lg"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>

          <button className="btn btn-success btn-lg w-100">
            Update Password
          </button>
        </form>

        {message && (
          <p className="text-center text-warning mt-3">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;