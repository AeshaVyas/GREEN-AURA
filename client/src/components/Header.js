import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../axiosConfig";
import {
  FaBars,
  FaSearch,
  FaShoppingCart,
  FaHeart,
  FaUser,
  FaLeaf,
  FaBoxOpen,
  FaSignOutAlt,
} from "react-icons/fa";
import "./Header.css";

/* ================= STATIC SUBCATEGORY IMAGES ================= */
const SUBCATEGORY_IMAGES = {
  101: "/subcategories/indoorplants.jpg",
  102: "/subcategories/sculents.jpg",
  103: "/subcategories/cactus.jpg",
  104: "/subcategories/air-purify.jpg",
  105: "/subcategories/outdoor.jpg",
  106: "/subcategories/adenium.jpg",
  201: "/subcategories/summerseeds.jpg",
  202: "/subcategories/winterseeds.jpg",
  203: "/subcategories/fruitseeds.jpg",
  204: "/subcategories/herbseeds.jpg",
  301: "/subcategories/indoorplants.jpg",
  302: "/subcategories/selfwatering.jpg",
  303: "/subcategories/hangingpots.jpg",
  304: "/subcategories/plasticnurserypots.jpg",
  401: "/subcategories/fertilizersoil.jpg",
  402: "/subcategories/manure.jpg",
  default: "/subcategories/default.png",
};

function Header() {
  /* ================= STATE ================= */
  const [categories, setCategories] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  // ✅ SEARCH STATES (FIXED)
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const navigate = useNavigate();

  /* ================= INIT ================= */
  useEffect(() => {
    fetchCategories();
    checkSession();
    updateCounts();

    window.addEventListener("cartUpdated", updateCounts);
    window.addEventListener("wishlistUpdated", updateCounts);

    return () => {
      window.removeEventListener("cartUpdated", updateCounts);
      window.removeEventListener("wishlistUpdated", updateCounts);
    };
  }, []);

  /* ================= API ================= */
  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/category/all");
      setCategories(res.data);
    } catch (err) {
      console.log("Category error", err);
    }
  };

  const checkSession = async () => {
    try {
      const res = await axios.get("/api/user/check-session");
      setUser(res.data.loggedIn ? res.data.user : null);
    } catch {
      setUser(null);
    }
  };

  /* ================= SEARCH ================= */
  const handleSearch = async (value) => {
    setSearchTerm(value);

    if (value.trim() === "") {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    try {
      const res = await axios.get(`/api/product/search?name=${value}`);
      setSearchResults(res.data);
      setShowResults(true);
    } catch (err) {
      console.log("Search error", err);
    }
  };

  /* ================= COUNTS ================= */
  const updateCounts = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    setCartCount(cart.length);
    setWishlistCount(wishlist.length);
  };

  /* ================= LOGOUT ================= */
  const handleLogout = async () => {
    try {
      await axios.get("/api/user/logout");
    } catch {}

    setUser(null);
    setCartCount(0);
    setWishlistCount(0);
    localStorage.removeItem("userEmail");

    navigate("/user-login");
  };

  return (
    <>
      <header className="ps-header">
        {/* LEFT */}
        <div className="ps-left">
          <button className="menu-btn" onClick={() => setShowMenu(true)}>
            <FaBars />
          </button>

          <div className="logo">
            <FaLeaf className="leaf-icon" />
            <span>GreenAura</span>
          </div>
        </div>

        {/* CENTER */}
        <div className="ps-center">
          <button className="category-btn" onClick={() => setShowMenu(true)}>
            All categories
          </button>

          <div className="search-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Search for products"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />

            {showResults && (
              <div className="search-dropdown">
                {searchResults.length > 0 ? (
                  searchResults.map((product) => (
                    <div
                      key={product._id}
                      className="search-item"
                      onClick={() => {
                        navigate(`/productdetail/${product.pid}`); // ✅ FIXED ROUTE
                        setShowResults(false);
                        setSearchTerm("");
                      }}
                    >
                      {product.pname}
                    </div>
                  ))
                ) : (
                  <div className="search-item">No products found</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="ps-right">
          <Link to="/wishlist" className="nav-item icon-wrapper">
            <FaHeart />
            {wishlistCount > 0 && (
              <span className="icon-count">{wishlistCount}</span>
            )}
          </Link>

          <Link to="/cart" className="nav-item icon-wrapper">
            <FaShoppingCart />
            {cartCount > 0 && <span className="icon-count">{cartCount}</span>}
          </Link>

          <Link to="/orders" className="nav-item">
            <FaBoxOpen />
          </Link>

          {!user ? (
            <Link to="/user-login" className="nav-item">
              <FaUser />
              Login / Register
            </Link>
          ) : (
            <>
              <Link to="/profile" className="nav-item">
                <FaUser />
              </Link>

              <button className="nav-item logout-btn" onClick={handleLogout}>
                <FaSignOutAlt />
              </button>
            </>
          )}
        </div>
      </header>

      {/* ================= MEGA MENU ================= */}
      {showMenu && (
        <div
          className="mega-wrapper"
          onMouseLeave={() => {
            setShowMenu(false);
            setActiveCategory(null);
          }}
        >
          <div className="mega-left">
            <div className="mega-menu-title">Menu</div>

            {/* {categories.map((cat) => (
              <div
                key={cat.cid}
                className={`mega-category ${
                  activeCategory?.cid === cat.cid ? "active" : ""
                }`}
                onMouseEnter={() => setActiveCategory(cat)}
              >
                {cat.cname}
                <span className="arrow">›</span>
              </div>
            ))} */}
            {categories.map((cat) => (
              <Link
                key={cat.cid}
                to={`/products/${cat.cid}`}
                className={`mega-category ${
                  activeCategory?.cid === cat.cid ? "active" : ""
                }`}
                onMouseEnter={() => setActiveCategory(cat)}
                onClick={() => setShowMenu(false)}
              >
                {cat.cname}
                <span className="arrow">›</span>
              </Link>
            ))}
          </div>

          <div className="mega-right">
            {activeCategory ? (
              <>
                <h3>{activeCategory.cname}</h3>

                <div className="mega-grid">
                  {activeCategory.subcategories?.map((sub) => {
                    const img =
                      SUBCATEGORY_IMAGES[sub.scid] ||
                      SUBCATEGORY_IMAGES.default;

                    return (
                      // <Link
                      //   key={sub.scid}
                      //   to={`/category/${activeCategory.cid}/${sub.scid}`}
                      //   className="mega-item"
                      // >
                      <Link
                        key={sub.scid}
                        to={`/products/${activeCategory.cid}/${sub.scid}`}
                        className="mega-item"
                        onClick={() => setShowMenu(false)}
                      >
                        <img src={img} alt={sub.scname} className="mega-img" />
                        <span>{sub.scname}</span>
                      </Link>
                    );
                  })}
                </div>
              </>
            ) : (
              <p>Hover on a category</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
