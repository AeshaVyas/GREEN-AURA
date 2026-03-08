import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ReadCategory.css";

function ReadCategory() {
  const [categories, setCategories] = useState([]);
  const [openCid, setOpenCid] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/category/read");
      setCategories(res.data);
    } catch (error) {
      console.log("Error fetching categories", error);
    }
  };

  const deleteCategory = async (cid) => {
    await axios.delete(`http://localhost:5000/api/category/delete/${cid}`);
    fetchCategories();
  };

  const deleteSubCategory = async (cid, scid) => {
    await axios.delete(
      `http://localhost:5000/api/category/delete-subcategory/${cid}/${scid}`,
    );
    fetchCategories();
  };

  return (
    <div className="container-fluid mt-5 px-5">
      <div className="d-flex justify-content-between mb-4">
        <h2 className="page-title">Category List 🌿</h2>

        <button
          className="btn btn-success"
          onClick={() => navigate("/create-category")}
        >
          Add Category
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-striped main-table">
          <thead>
            <tr>
              <th>CID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Subcategories</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((cat) => (
              <React.Fragment key={cat.cid}>
                {/* Main Category Row */}
                <tr>
                  <td>{cat.cid}</td>
                  <td>{cat.cname}</td>
                  <td>{cat.cdescription}</td>

                  <td>
                    <button
                      className="btn btn-outline-dark btn-sm"
                      onClick={() =>
                        setOpenCid(openCid === cat.cid ? null : cat.cid)
                      }
                    >
                      {openCid === cat.cid
                        ? "Hide Subcategories"
                        : `View Subcategories (${cat.subcategories?.length || 0})`}
                    </button>
                  </td>

                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-sm action-btn"
                        style={{backgroundColor : "blue" , color : "white"}}
                        onClick={() =>
                          navigate(`/update-category/${cat.cid}`)
                        }
                      >
                        Update
                      </button>

                      {/* <button
                        className="btn btn-sm action-btn"
                        style={{ backgroundColor: "#0d6efd", color: "#fff" }}
                        onClick={() => navigate(`/update-category/${cat.cid}`)}
                      >
                        Update
                      </button> */}

                      <button
                        className="btn btn-danger btn-sm action-btn"
                        onClick={() => deleteCategory(cat.cid)}
                      >
                        Delete
                      </button>

                      <button
                        className="btn btn-success btn-sm action-btn"
                        onClick={() =>
                          navigate(`/create-subcategory/${cat.cid}`)
                        }
                      >
                        Add Sub
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Expanded Subcategory Row */}
                {openCid === cat.cid && (
                  <tr className="sub-row">
                    <td colSpan="5">
                      {cat.subcategories && cat.subcategories.length > 0 ? (
                        <table className="sub-table">
                          <thead>
                            <tr>
                              <th>Sub ID</th>
                              <th>Subcategory Name</th>
                              <th>Actions</th>
                            </tr>
                          </thead>

                          <tbody>
                            {cat.subcategories.map((sub) => (
                              <tr key={sub.scid}>
                                <td>{sub.scid}</td>
                                <td>{sub.scname}</td>
                                <td>
                                  <button
                                    className="btn btn-sm btn-outline-success me-2"
                                    onClick={() =>
                                      navigate(
                                        `/update-subcategory/${cat.cid}/${sub.scid}`,
                                      )
                                    }
                                  >
                                    Update
                                  </button>

                                  <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() =>
                                      deleteSubCategory(cat.cid, sub.scid)
                                    }
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className="text-muted">No Subcategories Found</div>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReadCategory;
