import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminHeader.css";

function AdminHeader() {
  const navigate = useNavigate();

  const [adminEmail, setAdminEmail] = useState("");
  const [lastLogin, setLastLogin] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("adminEmail");
    const loginTime = localStorage.getItem("lastLogin");

    if (email) setAdminEmail(email);

    if (loginTime) {
      const formatted = new Date(loginTime).toLocaleString();
      setLastLogin(formatted);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("lastLogin");
    navigate("/admin-login");
  };

  return (
    <div className="admin-header">

      {/* LEFT */}
      <div className="left-section">
        {/* <div className="leaf-icon">🌿</div> */}
        <div className="logo-box">GREEN AURA 🌿</div>
        
        <div className="admin-info">
          <h6>Admin</h6>
          <small>{adminEmail}</small>

          {lastLogin && (
            <small
              style={{
                display: "block",
                fontSize: "11px",
                opacity: 0.8
              }}
            >
              Last Login: {lastLogin}
            </small>
          )}
        </div>
      </div>

      {/* RIGHT */}
      <div className="right-section">

        <div className="dropdown">
          <button
            className="btn dropdown-toggle custom-dropdown-btn"
            type="button"
            data-bs-toggle="dropdown"
          >
            Category
          </button>
          <ul className="dropdown-menu">
            <li>
              <Link className="dropdown-item" to="/create-category">
                Create 
              </Link>
            </li>
            <li>
              <Link className="dropdown-item" to="/read-category">
                Read 
              </Link>
            </li>
          </ul>
        </div>

        <div className="dropdown">
          <button
            className="btn dropdown-toggle custom-dropdown-btn"
            type="button"
            data-bs-toggle="dropdown"
          >
            Product
          </button>
          <ul className="dropdown-menu">
            <li>
              <Link className="dropdown-item" to="/create-product">
                Create
              </Link>
            </li>
            <li>
              <Link className="dropdown-item" to="/read-product">
                Read 
              </Link>
            </li>
          </ul>
        </div>

        <Link to="/manage-users" className="nav-link-custom">User</Link>
        <Link to="/orders" className="nav-link-custom">Order</Link>
        <Link to="/manage-reviews" className="nav-link-custom">Review</Link>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>

      </div>
    </div>
  );
}

export default AdminHeader;