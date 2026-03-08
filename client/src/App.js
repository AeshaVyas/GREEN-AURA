import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import AdminLogin from "./admin/AdminLogin";
import ReadCategory from "./admin/ReadCategory";
import CreateCategory from "./admin/CreateCategory";
import CreateSubCategory from "./admin/CreateSubCategory";
import UpdateCategory from "./admin/UpdateCategory";
import UpdateSubCategory from "./admin/UpdateSubCategory";
import CreateProduct from "./admin/CreateProduct";
import ReadProduct from "./admin/ReadProduct";
import ProtectedRoute from "./admin/ProtectedRoute";
import AdminLayout from "./admin/AdminLayout";
import UpdateProduct from "./admin/UpdateProduct";
import AdminForgotPassword from "./admin/AdminForgotPassword";
import ManageUsers from "./admin/ManageUsers";
import ProductList from "./components/ProductList";
import UserRegister from "./user/UserRegister";
import UserLogin from "./user/UserLogin";
import ResetPassword from "./user/ResetPassword";
import Header from "./components/Header";
import Home from "./components/Home";
import ProductDetail from "./components/ProductDetail";
import Footer from "./components/Footer";
import ManageReview from "./admin/ManageReview";


// ================= LAYOUT WRAPPER =================
function LayoutWrapper({ children }) {
  const location = useLocation();

  // All admin + auth routes
  const adminRoutes = [
    "/admin-login",
    "/read-category",
    "/create-category",
    "/create-subcategory",
    "/update-category",
    "/update-subcategory",
    "/create-product",
    "/read-product",
    "/update-product",
    "/admin-forgot-password",
    "/manage-users",
    "/user-register",
    "/user-login",
    "/reset-password",
    "/manage-review"
  ];

  const isAdminRoute = adminRoutes.some(route =>
    location.pathname.startsWith(route)
  );

  return (
    <>
      {/* Show Header only on user pages */}
      {!isAdminRoute && <Header />}

      {children}

      {/* Show Footer only on user pages */}
      {!isAdminRoute && <Footer />}
    </>
  );
}


// ================= MAIN APP =================
function App() {
  return (
    <Router>
      <LayoutWrapper>
        <Routes>

          {/* ================= USER ROUTES ================= */}
          <Route path="/" element={<Home />} />
          {/* // USER PRODUCT LIST (category / subcategory) */}
          <Route path="/products/:cid" element={<ProductList />} />
          <Route path="/products/:cid/:scid" element={<ProductList />} />
          <Route path="/productdetail/:pid" element={<ProductDetail />} />
          <Route path="/user-register" element={<UserRegister />} />
          <Route path="/user-login" element={<UserLogin />} />
          {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* ================= ADMIN ROUTES ================= */}
          <Route path="/admin-login" element={<AdminLogin />} />

          <Route
            path="/read-category"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <ReadCategory />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/create-category"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <CreateCategory />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/create-subcategory/:cid"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <CreateSubCategory />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/update-category/:cid"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <UpdateCategory />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/update-subcategory/:cid/:scid"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <UpdateSubCategory />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/create-product"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <CreateProduct />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/read-product"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <ReadProduct />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/update-product/:pid"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <UpdateProduct />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route path="/admin-forgot-password" element={<AdminForgotPassword />} />

          <Route
            path="/manage-users"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <ManageUsers />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/manage-reviews"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <ManageReview />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

        </Routes>
      </LayoutWrapper>
    </Router>
  );
}

export default App;