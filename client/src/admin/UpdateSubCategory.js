import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function UpdateSubCategory() {

  const { cid, scid } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    scid: "",
    scname: ""
  });

  useEffect(() => {
    fetchSubCategory();
    // eslint-disable-next-line
  }, []);

  const fetchSubCategory = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/category/read"
      );

      const category = res.data.find(
        (cat) => cat.cid.toString() === cid
      );

      if (category) {
        const sub = category.subcategories.find(
          (sub) => sub.scid.toString() === scid
        );

        if (sub) {
          setFormData({
            scid: sub.scid,
            scname: sub.scname
          });
        }
      }

    } catch (error) {
      console.log("Error fetching subcategory", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `http://localhost:5000/api/category/update-subcategory/${cid}/${scid}`,
        formData
      );

      alert("Subcategory updated successfully 🌿");
      navigate("/read-category");

    } catch (error) {
      console.log("Error updating subcategory", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Update Subcategory</h2>

      <form onSubmit={handleSubmit}>

        {/* Subcategory ID */}
        <div className="mb-3">
          <label className="form-label fw-semibold">
            Sub-Category ID
          </label>

          <input
            type="text"
            name="scid"
            value={formData.scid}
            onChange={handleChange}
            className="form-control"
            readOnly
          />
        </div>

        {/* Subcategory Name */}
        <div className="mb-3">
          <label className="form-label fw-semibold">
            Sub-Category Name
          </label>

          <input
            type="text"
            name="scname"
            value={formData.scname}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <button className="btn btn-success">
          Update Subcategory
        </button>

      </form>
    </div>
  );
}

export default UpdateSubCategory;