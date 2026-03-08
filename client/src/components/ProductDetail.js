import React, { useEffect, useState } from "react";
import axios from "../axiosConfig";
import { useParams, useNavigate } from "react-router-dom";
import "./ProductDetail.css";

function ProductDetail() {
  const { pid } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);

  // GET LOGGED-IN USER
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // FETCH PRODUCT
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        // ✅ Dedicated single-product API
        const res = await axios.get(`/api/product/${pid}`);
        const foundProduct = res.data;

        if (!foundProduct) {
          navigate("/");
          return;
        }

        setProduct(foundProduct);
        setSelectedImage(foundProduct.images?.[0]);

        const relatedRes = await axios.get(`/api/product/related/${foundProduct.cid}/${foundProduct.pid}`);
        setRelatedProducts(relatedRes.data);

        const reviewRes = await axios.get(`/api/review/product/${pid}`);
        setReviews(reviewRes.data);

        window.scrollTo(0, 0);
      } catch (err) {
        console.error("Product detail error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (pid) fetchProduct();
  }, [pid, navigate]);

  // SUBMIT REVIEW
  const handleSubmit = async () => {
    if (!user) return alert("Please login first");
    if (rating === 0) return alert("Please select rating");
    if (!comment.trim()) return alert("Please write your review");

    try {
      await axios.post("/api/review/create", { uid: user.uid, pid, rating, comment });
      const reviewRes = await axios.get(`/api/review/product/${pid}`);
      setReviews(reviewRes.data);
      setComment("");
      setRating(0);
    } catch (err) {
      alert(err.response?.data?.message || "Error submitting review");
    }
  };

  if (loading) return <p className="loading">Loading product...</p>;
  if (!product) return null;

  return (
    <div className="product-detail-container container">
      <div className="row product-main">
        <div className="col-md-1 thumbnail-column">
          {product.images?.map((img, index) => (
            <img
              key={index}
              src={`http://localhost:5000/uploads/${img}`}
              alt="thumb"
              className={`thumbnail-img ${selectedImage === img ? "active" : ""}`}
              onClick={() => setSelectedImage(img)}
            />
          ))}
        </div>

        <div className="col-md-5">
          <img src={`http://localhost:5000/uploads/${selectedImage}`} alt={product.pname} className="product-main-img" />
        </div>

        <div className="col-md-6 product-info-section">
          <h2>{product.pname}</h2>
          <p className="price">₹{product.price}</p>
          <p className="description">{product.pdescription}</p>
          <p className={product.stock === 0 ? "out" : "in"}>
            {product.stock === 0 ? "Out of Stock" : "In Stock"}
          </p>
          <button className="add-to-cart-btn" disabled={product.stock === 0}>
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>

      {/* Reviews */}
      <section className="reviews-section">
        <h3>Customer Reviews</h3>
        {user && <p>Reviewing as: <strong>{user.uname}</strong></p>}

        <div style={{ marginBottom: "10px" }}>
          {[1,2,3,4,5].map(star => (
            <span key={star} style={{ cursor: "pointer", fontSize: "24px", color: star <= rating ? "#ffc107" : "#e4e5e9" }} onClick={() => setRating(star)}>★</span>
          ))}
        </div>

        <textarea placeholder="Write your review..." value={comment} onChange={(e) => setComment(e.target.value)} style={{ width: "100%", height: "80px" }} />
        <button className="review-btn" onClick={handleSubmit} style={{ marginTop: "10px" }}>Submit</button>

        <hr />
        {reviews.length === 0 && <p>No reviews yet</p>}
        {reviews.map(rev => (
          <div key={rev.rid}>
            <strong>{rev.uname}</strong>
            <p style={{ color: "#ffc107" }}>{"★".repeat(rev.rating)}{"☆".repeat(5-rev.rating)}</p>
            <p>{rev.comment}</p>
            <small>{new Date(rev.createdAt).toLocaleString()}</small>
            <hr />
          </div>
        ))}
      </section>

      {/* Related Products */}
      <section className="related-products-section">
        <h3>Related Products</h3>
        <div className="row">
          {relatedProducts.map(p => (
            <div key={p.pid} className="col-md-3 mb-4" onClick={() => navigate(`/productdetail/${p.pid}`)} style={{ cursor: "pointer" }}>
              <div className="product-card">
                <img src={`http://localhost:5000/uploads/${p.images?.[0]}`} alt={p.pname} className="product-img" />
                <h6>{p.pname}</h6>
                <p className="price">₹{p.price}</p>
                <button className="add-to-cart-btn" disabled={p.stock === 0}>{p.stock === 0 ? "Out of Stock" : "Add to Cart"}</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default ProductDetail;