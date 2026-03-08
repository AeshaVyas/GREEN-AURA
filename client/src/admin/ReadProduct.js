import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ReadProduct.css";

const ReadProduct = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // =========================
  // Fetch Products
  // =========================
  const fetchProducts = async (page = 1) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/product/read?page=${page}`
      );

      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);
      setCurrentPage(res.data.currentPage);

    } catch (err) {
      console.error("FETCH PRODUCTS ERROR:", err);
      alert("Error fetching products");
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  // =========================
  // Edit Product
  // =========================
  const handleEdit = (pid) => {
    navigate(`/update-product/${pid}`);
  };

  // =========================
  // Delete Product
  // =========================
  const handleDelete = async (pid) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await axios.delete(`http://localhost:5000/api/product/delete/${pid}`);
      alert("Product deleted successfully");
      fetchProducts();
    } catch (err) {
      console.error("DELETE PRODUCT ERROR:", err);
      alert("Error deleting product");
    }
  };

  // =========================
  // 🔍 SEARCH FILTER
  // =========================
  const filteredProducts = products.filter(
    (p) =>
      p.pname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.pid.toString().includes(searchTerm) ||
      p.cid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.scid.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // =========================
  // 🔄 Toggle Status (Backend Controlled)
  // =========================
  const handleToggleStatus = async (pid) => {
    try {
      await axios.put(`http://localhost:5000/api/product/update-status/${pid}`);

      fetchProducts(); // refresh list
    } catch (err) {
      console.error("STATUS UPDATE ERROR:", err);
      alert("Error updating status");
    }
  };

  return (
    <div className="container mt-5">
      <div>
        <h3 className="page-title">🌿 Manage Products</h3>

        {/* ========================= */}
        {/* 🔍 Search Bar */}
        {/* ========================= */}
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search by PID, Name, Category..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* ========================= */}
        {/* Products Table */}
        {/* ========================= */}
        <div className="table-responsive">
          <table className="table table-striped main-table">
            <thead>
              <tr>
                <th>PID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Subcategory</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Colors</th>
                <th>Sizes</th>
                <th>Images</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p._id}>
                  <td>{p.pid}</td>
                  <td>{p.pname}</td>
                  <td>{p.cid}</td>
                  <td>{p.scid}</td>
                  <td>₹{p.price}</td>
                  <td>{p.stock}</td>

                  {/* STATUS BADGE */}
                  <td>
                    <span
                      className={
                        p.status === "isavailable"
                          ? "status-available"
                          : "status-out"
                      }
                      style={{ cursor: "pointer" }}
                      onClick={() => handleToggleStatus(p.pid)}
                    >
                      {p.status === "isavailable"
                        ? "Available"
                        : "Out of Stock"}
                    </span>
                  </td>

                  <td>{p.color.join(", ")}</td>
                  <td>{p.size.join(", ")}</td>

                  {/* Images */}
                  {/* <td>
                    {p.images.length > 0 ? (
                      p.images.map((img, i) => (
                        // <img
                        //   key={i}
                        //   src={`http://localhost:5000/uploads/${img}`}
                        //   alt={p.pname}
                        // />
                        <img
                          key={i}
                          src={`http://localhost:5000/uploads/${encodeURIComponent(img)}`}
                          alt={p.pname}
                          className="table-product-img"
                        />
                      ))
                    ) : (
                      <span>No Image</span>
                    )}
                  </td> */}
                  <td>
                    {p.images.length > 0 ? (
                      p.images.map((img, i) => {
                        console.log("IMAGE FILE:", img);
                        return (
                          <img
                            key={i}
                            src={`http://localhost:5000/uploads/${encodeURIComponent(img)}`}
                            alt={p.pname}
                            style={{
                              width: "60px",
                              height: "60px",
                              objectFit: "cover",
                              border: "1px solid #ccc",
                            }}
                          />
                        );
                      })
                    ) : (
                      <span>No Image</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-primary btn-sm action-btn"
                        onClick={() => handleEdit(p.pid)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-danger btn-sm action-btn"
                        onClick={() => handleDelete(p.pid)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="11" className="text-center">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="pagination-wrapper">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>

          <span>Page {currentPage} of {totalPages}</span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReadProduct;
