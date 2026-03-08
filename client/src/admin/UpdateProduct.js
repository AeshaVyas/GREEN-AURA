import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./CreateProduct.css";
// import Header from "./AdminHeader";

const UpdateProduct = () => {
  const { pid } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const [oldImages, setOldImages] = useState([]);

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

  /* ========================= */
  /* Fetch Categories + Product */
  /* ========================= */
  useEffect(() => {
    fetchCategories();
    fetchProduct();
    // eslint-disable-next-line
  }, []);

  const fetchCategories = async () => {
    const res = await axios.get("http://localhost:5000/api/category/read");
    setCategories(res.data);
  };

  const fetchProduct = async () => {
    const res = await axios.get("http://localhost:5000/api/product/read");
    const product = res.data.find((p) => p.pid === pid);

    if (!product) {
      alert("Product not found");
      navigate("/read-product");
      return;
    }

    setForm({
      pid: product.pid,
      pname: product.pname,
      pdescription: product.pdescription,
      cid: product.cid,
      scid: product.scid,
      price: product.price,
      stock: product.stock,
      status: product.status,
      color: product.color.join(","),
      size: product.size.join(","),
    });

    setOldImages(product.images || []);

    const cat = categories.find((c) => c.cid === product.cid);
    setSelectedCategory(cat);
  };

  /* ========================= */
  /* Handle Inputs */
  /* ========================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "cid") {
      const cat = categories.find((c) => c.cid === value);
      setSelectedCategory(cat);
      setForm({ ...form, cid: value, scid: "" });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    setNewImages(e.target.files);
  };

  const removeOldImage = (index) => {
    setOldImages(oldImages.filter((_, i) => i !== index));
  };

  /* ========================= */
  /* Submit Update */
  /* ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("pname", form.pname);
    formData.append("pdescription", form.pdescription);
    formData.append("cid", form.cid);
    formData.append("scid", form.scid);
    formData.append("price", form.price);
    formData.append("stock", form.stock);
    formData.append("status", form.status);
    formData.append("color", JSON.stringify(form.color.split(",")));
    formData.append("size", JSON.stringify(form.size.split(",")));
    formData.append("imagesToKeep", JSON.stringify(oldImages));

    for (let i = 0; i < newImages.length; i++) {
      formData.append("images", newImages[i]);
    }

    try {
      await axios.put(
        `http://localhost:5000/api/product/update/${pid}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("Product updated successfully! 🌿");
      navigate("/read-product");
    } catch (err) {
      console.error("UPDATE PRODUCT ERROR:", err);
      alert("Error updating product");
    }
  };

  /* ========================= */
  /* UI */
  /* ========================= */
  return (
    
    <div className="container mt-5">
      <div className="card shadow-lg p-4">
        <h3 className="text-center mb-4 text-success">
          Update Product 🌱
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label>Product ID</label>
                <input
                  type="text"
                  value={form.pid}
                  className="form-control"
                  disabled
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
                <label>Category</label>
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
                <label>Subcategory</label>
                <select
                  name="scid"
                  value={form.scid}
                  onChange={handleChange}
                  className="form-select"
                  required
                  disabled={!selectedCategory}
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
                <label>Colors (comma separated)</label>
                <input
                  type="text"
                  name="color"
                  value={form.color}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="mb-3">
                <label>Sizes (comma separated)</label>
                <input
                  type="text"
                  name="size"
                  value={form.size}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="mb-3">
                <label>Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  className="form-control"
                  required
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
              rows="3"
              required
            ></textarea>
          </div>

          {/* OLD IMAGE PREVIEW */}
          {oldImages.length > 0 && (
            <div className="mb-3">
              <label>Existing Images</label>
              <div className="d-flex flex-wrap gap-2">
                {oldImages.map((img, index) => (
                  <div key={index} style={{ position: "relative" }}>
                    <img
                      src={`http://localhost:5000/uploads/${img}`}
                      alt="product"
                      width="80"
                      className="rounded border"
                    />
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      style={{
                        position: "absolute",
                        top: "-8px",
                        right: "-8px",
                        borderRadius: "50%",
                      }}
                      onClick={() => removeOldImage(index)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-4">
            <label>Add New Images</label>
            <input
              type="file"
              multiple
              className="form-control"
              onChange={handleImageChange}
            />
          </div>

          <div className="text-center">
            <button type="submit" className="btn btn-success px-5">
              Update Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;