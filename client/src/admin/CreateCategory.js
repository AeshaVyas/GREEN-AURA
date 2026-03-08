import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CreateCategory.css";

function CreateCategory() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    cid: "",
    cname: "",
    cdescription: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/category/create",
        form
      );

      alert("Category Created Successfully 🌿");
      navigate("/read-category");

    } catch (error) {
      console.log(error);
      alert("Error creating category 🌿");
    }
  };

  return (
    <div className="category-wrapper">
      <div className="category-card">

        <h3 className="form-title">
          🌿 Create New Category
        </h3>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Category ID</label>
            <input
              type="text"
              name="cid"
              value={form.cid}
              onChange={handleChange}
              placeholder="Enter Category ID"
              required
            />
          </div>

          <div className="form-group">
            <label>Category Name</label>
            <input
              type="text"
              name="cname"
              value={form.cname}
              onChange={handleChange}
              placeholder="Enter Category Name"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="cdescription"
              rows="4"
              value={form.cdescription}
              onChange={handleChange}
              placeholder="Enter Description"
              required
            />
          </div>

          <button className="submit-btn">
            Create Category
          </button>

        </form>

      </div>
    </div>
  );
}

export default CreateCategory;
