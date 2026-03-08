import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./UserRegister.css";

function UserRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    uname: "",
    uemail: "",
    upassword: "",
    phone: "",
    address: "",
    gender: ""
  });

  const [loading, setLoading] = useState(false);

  // Handle Input Change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/user/register",
        form
      );

      alert(res.data.message || "Registration Successful 🌿");

      // Clear form
      setForm({
        uname: "",
        uemail: "",
        upassword: "",
        phone: "",
        address: "",
        gender: ""
      });

      // Redirect to login
      navigate("/user-login");

    } catch (error) {
      console.log("REGISTER ERROR:", error);

      if (error.response && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-wrapper d-flex justify-content-center align-items-center">
      <div className="register-card shadow-lg p-5">

        {/* Logo */}
        <div className="text-center mb-4">
          <h2 className="brand-title" align="center">  Green Aura🌿</h2>
          <h4 className="text">Create Your Account</h4>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row">

            {/* LEFT SIDE */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="uname"
                  value={form.uname}
                  className="form-control"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="uemail"
                  value={form.uemail}
                  className="form-control"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="upassword"
                  value={form.upassword}
                  className="form-control"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  className="form-control"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  className="form-control"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Gender</label>
                <select
                  name="gender"
                  value={form.gender}
                  className="form-select"
                  onChange={handleChange}
                  required
                >
                  <option value="" className="text-dark">Select Gender</option>
                  <option value="male" className="text-dark">Male</option>
                  <option value="female" className="text-dark">Female</option>
                </select>
              </div>
            </div>

          </div>

          {/* <button
            type="submit"
            className="btn register-btn w-100 mt-3"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button> */}
          <button   type="submit" disabled={loading} className="btn btn-success w-100 register-btn">
                 {/* Register */}{loading ? "Registering..." : "Register"}
           </button>
        </form>

        <div className="text-center mt-3">
          Already have an account?{" "}
          <Link to="/user-login" className="login-link text-success">
            Login
          </Link>
        </div>

      </div>
    </div>
  );
}

export default UserRegister;