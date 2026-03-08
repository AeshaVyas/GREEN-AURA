import React from "react";
import AdminHeader from "./AdminHeader";

function AdminLayout({ children }) {
  return (
    <>
      <AdminHeader />
      <div style={{ padding: "30px" }}>
        {children}
      </div>
    </>
  );
}

export default AdminLayout;
