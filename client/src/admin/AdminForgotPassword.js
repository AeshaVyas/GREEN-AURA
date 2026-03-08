import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./AdminLogin.css";

function AdminForgotPassword() {
  const [aemail, setAemail] = useState("");
  const [result, setResult] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/admin/forgot-password",
        { aemail }
      );

      setResult(`Your Password: ${res.data.apassword}`);
    } catch (err) {
      alert("Admin not found");
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

        <h3 className="admin-title">Forgot Password</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Admin Email</label>
            <input
              type="email"
              value={aemail}
              onChange={(e) => setAemail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Recover Password
          </button>
        </form>

        {result && (
          <p style={{ marginTop: "15px", color: "green", textAlign: "center" }}>
            {result}
          </p>
        )}

        <p className="text-center mt-3">
          <Link to="/admin-login">Back to Admin Login</Link>
        </p>

      </div>
    </div>
  );
}

export default AdminForgotPassword;