import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CreateProduct.css";

const CreateProduct = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);

  const [form, setForm] = useState({
    pid: "",
    pname: "",
    pdescription: "",
    cid: "",
    scid: "",
    price: "",
    color: "",
    size: "",
    stock: "",
    status: "isavailable",
  });

  // Fetch categories
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/category/read")
      .then((res) => setCategories(res.data))
      .catch((err) => console.log(err));
  }, []);

  // const handleChange = (e) => {
  //   const { name, value } = e.target;

  //   if (name === "cid") {
  //     const cat = categories.find(c => c.cid === value);
  //     setSelectedCategory(cat);
  //     setForm({ ...form, cid: value, scid: "" });
  //   } else {
  //     setForm({ ...form, [name]: value });
  //   }
  // };
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "cid") {
      const cat = categories.find((c) => c.cid === value);
      setSelectedCategory(cat);
      setForm({ ...form, cid: value, scid: "" });
    } else if (name === "status") {
      setForm({
        ...form,
        status: value,
        stock: value === "outofstock" ? 0 : form.stock,
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };
  const handleImageChange = (e) => {
    setImageFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.cid || !form.scid) {
      alert("Please select category and subcategory");
      return;
    }

    const formData = new FormData();
    formData.append("pid", form.pid);
    formData.append("pname", form.pname);
    formData.append("pdescription", form.pdescription);
    formData.append("cid", form.cid);
    formData.append("scid", form.scid);
    formData.append("price", form.price);
    formData.append("stock", form.stock);
    formData.append("status", form.status);

    // Split colors/sizes safely
    formData.append(
      "color",
      JSON.stringify(form.color ? form.color.split(",") : []),
    );
    formData.append(
      "size",
      JSON.stringify(form.size ? form.size.split(",") : []),
    );

    // Append images
    for (let i = 0; i < imageFiles.length; i++) {
      formData.append("images", imageFiles[i]);
    }

    try {
      // eslint-disable-next-line
      const res = await axios.post(
        "http://localhost:5000/api/product/create",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      alert("Product created successfully!🌿");
      navigate("/read-product");
    } catch (err) {
      console.error("CREATE PRODUCT ERROR:", err.response || err);
      alert("Error creating product!!🌿");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4">
        <h3 className="text-center mb-4 text-success">Add New Product 🌿</h3>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label>Product ID</label>
                <input
                  type="text"
                  name="pid"
                  value={form.pid}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <label>Product Name</label>
                <input
                  type="text"
                  name="pname"
                  value={form.pname}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <label>Category (cid)</label>
                <select
                  name="cid"
                  value={form.cid}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.cid} value={c.cid}>
                      {c.cname}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label>Subcategory (scid)</label>
                <select
                  name="scid"
                  value={form.scid}
                  onChange={handleChange}
                  className="form-select"
                  disabled={!selectedCategory}
                  required
                >
                  <option value="">Select Subcategory</option>
                  {selectedCategory?.subcategories.map((s) => (
                    <option key={s.scid} value={s.scid}>
                      {s.scname}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label>Price</label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <label>Color</label>
                <input
                  type="text"
                  name="color"
                  value={form.color}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label>Sizes</label>
                <input
                  type="text"
                  name="size"
                  value={form.size}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              {/* <div className="mb-3">
                <label>Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  className="form-control"
                  required
                /> */}
              <div className="mb-3">
                <label>Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  className="form-control"
                  disabled={form.status === "outofstock"}
                  required={form.status !== "outofstock"}
                />
              </div>
            </div>
          </div>

          <div className="mb-3">
            <label>Description</label>
            <textarea
              name="pdescription"
              value={form.pdescription}
              onChange={handleChange}
              className="form-control"
              rows={3}
              required
            ></textarea>
          </div>

          <div className="mb-3">
            <label>Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="form-select"
            >
              <option value="isavailable">Available</option>
              <option value="outofstock">Out of Stock</option>
            </select>
          </div>

          <div className="mb-4">
            <label>Upload Images</label>
            <input
              type="file"
              multiple
              onChange={handleImageChange}
              className="form-control"
            />
          </div>

          <div className="text-center">
            <button type="submit" className="btn btn-success px-5">
              Create Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
