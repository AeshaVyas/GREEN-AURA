import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ManageUsers.css";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/user/all",
      { withCredentials: true }
    );
    setUsers(res.data);
  };

  const blockUser = async (id) => {
    await axios.put(
      `http://localhost:5000/api/user/block/${id}`,
      {},
      { withCredentials: true }
    );
    fetchUsers();
  };

  const activateUser = async (id) => {
    await axios.put(
      `http://localhost:5000/api/user/activate/${id}`,
      {},
      { withCredentials: true }
    );
    fetchUsers();
  };

  const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await axios.delete(
        `http://localhost:5000/api/user/delete/${id}`,
        { withCredentials: true }
      );
      fetchUsers();
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.uname.toLowerCase().includes(search.toLowerCase()) ||
      u.uemail.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="green-aura-wrapper">
      <div className="container py-5">

        <div className="card shadow-lg border-0">
          <div className="card-body">

            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="page-title">Manage Users</h2>

              <input
                type="text"
                className="form-control search-bar"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="table-responsive">
              <table className="table align-middle text-center custom-table">
                <thead>
                  <tr>
                    <th>UID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Gender</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u._id}>
                      <td>{u.uid}</td>
                      <td>{u.uname}</td>
                      <td>{u.uemail}</td>
                      <td>{u.phone}</td>
                      <td className="text-capitalize">{u.gender}</td>

                      <td>
                        {u.ustatus === "active" ? (
                          <span className="badge bg-success px-3 py-2">
                            Active
                          </span>
                        ) : (
                          <span className="badge bg-danger px-3 py-2">
                            Blocked
                          </span>
                        )}
                      </td>

                      <td>
                        {u.ustatus === "active" ? (
                          <button
                            className="btn btn-sm btn-warning me-2"
                            onClick={() => blockUser(u._id)}
                          >
                            Block
                          </button>
                        ) : (
                          <button
                            className="btn btn-sm btn-success me-2"
                            onClick={() => activateUser(u._id)}
                          >
                            Activate
                          </button>
                        )}

                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => deleteUser(u._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan="7">No users found</td>
                    </tr>
                  )}
                </tbody>

              </table>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default ManageUsers;