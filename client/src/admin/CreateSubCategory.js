import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function CreateSubCategory() {

  const { cid } = useParams();
  const navigate = useNavigate();

  const [scid, setScid] = useState("");
  const [scname, setScname] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `http://localhost:5000/api/category/create-subcategory/${cid}`,
        { scid, scname }
      );

      alert("Subcategory added successfully 🌿");
      navigate("/read-category");

    } catch (error) {
      console.log("Error adding subcategory", error);
      alert("Error adding subcategory");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Add Subcategory</h2>

      <form onSubmit={handleSubmit}>

        {/* Subcategory ID */}
        <div className="mb-3">
          <label className="form-label fw-semibold">
            Subcategory ID
          </label>
          <input
            type="text"
            className="form-control"
            value={scid}
            onChange={(e) => setScid(e.target.value)}
            required
          />
        </div>

        {/* Subcategory Name */}
        <div className="mb-3">
          <label className="form-label fw-semibold">
            Subcategory Name
          </label>
          <input
            type="text"
            className="form-control"
            value={scname}
            onChange={(e) => setScname(e.target.value)}
            required
          />
        </div>

        <button className="btn btn-success">
          Add Subcategory
        </button>

      </form>
    </div>
  );
}

export default CreateSubCategory;