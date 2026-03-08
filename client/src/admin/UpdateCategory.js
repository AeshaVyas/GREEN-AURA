import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function UpdateCategory() {

  const { cid } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    cname: "",
    cdescription: ""
  });

  useEffect(() => {
    fetchCategory();
    // eslint-disable-next-line
  }, []);

  const fetchCategory = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/category/read"
      );

      const category = res.data.find((cat) => cat.cid === cid);

      if (category) {
        setForm({
          cname: category.cname,
          cdescription: category.cdescription
        });
      }

    } catch (error) {
      console.log("Error fetching category", error);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.put(
      `http://localhost:5000/api/category/update/${cid}`,
      form
    );

    alert("Category updated successfully!!🌿");
    navigate("/read-category");
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Update Category</h2>

      <form onSubmit={handleSubmit}>

        {/* Category Name Field */}
        <div className="mb-3">
          <label className="form-label fw-semibold">
            Category Name
          </label>
          <input
            type="text"
            name="cname"
            value={form.cname}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        {/* Description Field */}
        <div className="mb-3">
          <label className="form-label fw-semibold">
            Category Description
          </label>
          <textarea
            name="cdescription"
            value={form.cdescription}
            onChange={handleChange}
            className="form-control"
            rows="4"
            required
          />
        </div>

        <button className="btn btn-success">
          Update Category
        </button>

      </form>
    </div>
  );
}

export default UpdateCategory;