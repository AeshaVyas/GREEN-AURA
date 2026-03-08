import React, { useEffect, useState } from "react";
import axios from "../axiosConfig"; // ✅ use same axios config
import "./ManageReview.css";

function ManageReview() {
  const [reviews, setReviews] = useState([]);
  const [search, setSearch] = useState("");

  // ================= FETCH ALL REVIEWS =================
  const fetchReviews = async () => {
    try {
      const res = await axios.get(
        "/api/review/all",   // ✅ FIXED (singular)
        { withCredentials: true }
      );
      setReviews(res.data);
    } catch (error) {
      console.error("FETCH REVIEWS ERROR:", error);
      alert("Failed to load reviews");
    }
  };

  // ================= DELETE REVIEW =================
  const deleteReview = async (rid) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      await axios.delete(
        `/api/review/${rid}`,   // ✅ FIXED (singular)
        { withCredentials: true }
      );
      fetchReviews();
    } catch (error) {
      console.error("DELETE REVIEW ERROR:", error);
      alert("Delete failed");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // ================= SEARCH FILTER =================
  const filteredReviews = reviews.filter((r) =>
    (
      r.rid +
      r.pid +
      r.uname +
      r.pname +
      r.comment +
      r.rating
    )
      .toString()
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h3 className="fw-bold mb-3">🛠 Manage Reviews</h3>

      {/* SEARCH */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by RID, PID, user, product, rating or comment..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="table-responsive">
        <table className="table align-middle">
          <thead className="table-light">
            <tr>
              <th>RID</th>
              <th>PID</th>
              <th>User</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredReviews.length > 0 ? (
              filteredReviews.map((r) => (
                <tr key={r.rid}>
                  <td>{r.rid}</td>
                  <td>{r.pid}</td>
                  <td>{r.uname || "Unknown"}</td>
                  <td>{r.rating} ⭐</td>
                  <td style={{ maxWidth: "260px" }}>
                    {r.comment}
                  </td>
                  <td>
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteReview(r.rid)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No Reviews Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageReview;