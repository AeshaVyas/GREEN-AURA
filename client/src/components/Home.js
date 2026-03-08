// import React, { useEffect, useState } from "react";
// import axios from "../axiosConfig";
// import { useNavigate } from "react-router-dom";
// import "./Home.css";

// function Home() {
//   const [user, setUser] = useState(null);
//   const [showWelcome, setShowWelcome] = useState(false);
//   const [categories, setCategories] = useState([]);
//   const [latestProducts, setLatestProducts] = useState([]);

//   const navigate = useNavigate();

//   useEffect(() => {
//     const initializeHome = async () => {
//       try {
//         const sessionRes = await axios.get("/api/user/check-session");

//         if (!sessionRes.data.loggedIn) {
//           navigate("/user-login");
//           return;
//         }

//         setUser(sessionRes.data.user);
//         localStorage.setItem(
//           "user",
//           JSON.stringify(sessionRes.data.user)
//         );
//         setShowWelcome(true);
//         setTimeout(() => setShowWelcome(false), 3000);

//         const categoryRes = await axios.get("/api/category/all");
//         setCategories(categoryRes.data);

//         const productRes = await axios.get("/api/product/latest-eight");
//         setLatestProducts(productRes.data);
//       } catch (error) {
//         console.error("Home error:", error);
//         navigate("/user-login");
//       }
//     };

//     initializeHome();
//   }, [navigate]);

//   return (
//     <div className="home-container">
//       {/* ================= WELCOME ================= */}
//       {showWelcome && (
//         <div className="welcome-overlay">
//           <div className="welcome-popup">
//             <h2>🎉 Welcome {user?.uname}</h2>
//             <p>We’re glad to have you at Green Aura 🌿</p>
//           </div>
//         </div>
//       )}

//       {/* ================= FEATURE SECTION ================= */}
//       <section className="feature-section container">
//         <h1 className="welcome-title">Welcome To Green Aura</h1>

//         <div className="row">
//           {[
//             { img: "home2.jpg", title: "quality you can trust" },
//             { img: "home3.jpg", title: "not your average plants" },
//             { img: "home4.jpg", title: "plant care made simple" },
//           ].map((item, index) => (
//             <div className="col-md-4 mb-4" key={index}>
//               <div className="feature-card">
//                 <img
//                   src={`/images/${item.img}`}
//                   alt={item.title}
//                   className="feature-img"
//                 />
//                 <h3>{item.title}</h3>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* ================= CATEGORIES ================= */}
//       <section className="shop-category-section container">
//         <h2 className="shop-title">Explore Green Categories</h2>

//         <div className="circular-category-wrapper">
//           {categories.map((cat, index) => {
//             const images = [
//               "/images/plant1.jpg",
//               "/images/seeds.jpg",
//               "/images/potandplanter.jpg",
//               "/images/plantcare.jpg",
//               "/images/gardeningtools.jpg",
//             ];

//             return (
//               <div
//                 key={cat.cid}
//                 className="circular-category"
//                 onClick={() => navigate(`/products/${cat.cid}`)}
//               >
//                 <div className="circle-img">
//                   <img
//                     src={images[index % images.length]}
//                     alt={cat.cname}
//                   />
//                 </div>
//                 <h4 className="circle-title">{cat.cname}</h4>
//               </div>
//             );
//           })}
//         </div>
//       </section>

//       {/* ================= LATEST PRODUCTS ================= */}
//       <section className="latest-products-section container">
//         <h2 className="shop-title">New Arrivals</h2>

//         <div className="row">
//           {latestProducts.map((product) => (
//             <div className="col-md-3 mb-4" key={product.pid}>
//               <div className="modern-product-card">
//                 {/* Wishlist */}
//                 <div className="wishlist-btn hover-only">♡</div>

//                 {/* IMAGE SLIDER */}
//                 <div
//                   className="image-slider"
//                   onClick={() =>
//                     navigate(`/productdetail/${product.pid}`)
//                   }
//                 >
//                   <div className="image-track">
//                     {product.images?.map((img, i) => (
//                       <img
//                         key={i}
//                         src={`http://localhost:5000/uploads/${img}`}
//                         alt={product.pname}
//                       />
//                     ))}
//                   </div>
//                 </div>

//                 {/* PRODUCT INFO */}
//                 <div className="card-body">
//                   <h6 className="product-name">{product.pname}</h6>
//                   <div className="rating">
//                     {Array.from({ length: 5 }, (_, index) => {
//                       const rating = Math.round(product.avgRating);
//                       return (
//                         <span key={index}>
//                           {index < rating ? "★" : "☆"}
//                         </span>
//                       );
//                     })}
//                     <span className="review-count">
//                       ({product.reviewCount})
//                     </span>
//                   </div>
//                   <div className="price">₹{product.price}</div>
//                 </div>

//                 {/* CART BAR */}
//                 <div className="cart-bar hover-only">
//                   <button className="qty-btn">−</button>
//                   <span className="qty">1</span>
//                   <button className="qty-btn">+</button>

//                   <button
//                     className="add-cart-btn"
//                     disabled={product.stock === 0}
//                   >
//                     {product.stock === 0
//                       ? "Out of Stock"
//                       : "Add To Cart"}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// }

// export default Home;

import React, { useEffect, useState } from "react";
import axios from "../axiosConfig";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const [user, setUser] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [categories, setCategories] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const initializeHome = async () => {
      try {
        const sessionRes = await axios.get("/api/user/check-session");
        if (!sessionRes.data.loggedIn) {
          navigate("/user-login");
          return;
        }

        setUser(sessionRes.data.user);
        localStorage.setItem("user", JSON.stringify(sessionRes.data.user));
        setShowWelcome(true);
        setTimeout(() => setShowWelcome(false), 3000);

        const categoryRes = await axios.get("/api/category/all");
        setCategories(categoryRes.data);

        const productRes = await axios.get("/api/product/latest-eight");
        setLatestProducts(productRes.data);
      } catch (error) {
        console.error("Home error:", error);
        navigate("/user-login");
      }
    };

    initializeHome();
  }, [navigate]);

  return (
    <div className="home-container">
      {showWelcome && (
        <div className="welcome-overlay">
          <div className="welcome-popup">
            <h2>🎉 Welcome {user?.uname}</h2>
            <p>We’re glad to have you at Green Aura 🌿</p>
          </div>
        </div>
      )}

      {/* Feature Section */}
      <section className="feature-section container">
        <h1 className="welcome-title">Welcome To Green Aura</h1>
        <div className="row">
          {[
            { img: "home2.jpg", title: "quality you can trust" },
            { img: "home3.jpg", title: "not your average plants" },
            { img: "home4.jpg", title: "plant care made simple" },
          ].map((item, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <div className="feature-card">
                <img src={`/images/${item.img}`} alt={item.title} className="feature-img" />
                <h3>{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="shop-category-section container">
        <h2 className="shop-title">Explore Green Categories</h2>
        <div className="circular-category-wrapper">
          {categories.map((cat, index) => {
            const images = [
              "/images/plant1.jpg",
              "/images/seeds.jpg",
              "/images/potandplanter.jpg",
              "/images/plantcare.jpg",
              "/images/gardeningtools.jpg",
            ];
            return (
              <div
                key={cat.cid}
                className="circular-category"
                onClick={() => navigate(`/products/${cat.cid}`, { state: { cid: cat.cid, cname: cat.cname } })}
              >
                <div className="circle-img">
                  <img src={images[index % images.length]} alt={cat.cname} />
                </div>
                <h4 className="circle-title">{cat.cname}</h4>
              </div>
            );
          })}
        </div>
      </section>

      {/* Latest Products */}
      <section className="latest-products-section container">
        <h2 className="shop-title">New Arrivals</h2>
        <div className="row">
          {latestProducts.map((product) => (
            <div
              className="col-md-3 mb-4"
              key={product.pid}
              style={{ cursor: "pointer" }}
            >
              <div className="modern-product-card">
                {/* WISHLIST BUTTON */}
                <div
                  className="wishlist-btn hover-only"
                  onClick={(e) => {
                    e.stopPropagation(); // ✅ prevent card click
                    navigate("/wishlist"); // ✅ go to wishlist page
                  }}
                >
                  ♡
                </div>

                {/* IMAGE SLIDER */}
                <div
                  className="image-slider"
                  onClick={() => navigate(`/productdetail/${product.pid}`)}
                >
                  <div className="image-track">
                    {product.images?.map((img, i) => (
                      <img key={i} src={`http://localhost:5000/uploads/${img}`} alt={product.pname} />
                    ))}
                  </div>
                </div>

                {/* PRODUCT INFO */}
                <div className="card-body">
                  <h6 className="product-name">{product.pname}</h6>
                  <div className="rating">
                    {Array.from({ length: 5 }, (_, index) => {
                      const rating = Math.round(product.avgRating);
                      return <span key={index}>{index < rating ? "★" : "☆"}</span>;
                    })}
                    <span className="review-count">({product.reviewCount})</span>
                  </div>
                  <div className="price">₹{product.price}</div>
                </div>

                {/* CART BAR */}
                <div className="cart-bar hover-only">
                  <button className="qty-btn">−</button>
                  <span className="qty">1</span>
                  <button className="qty-btn">+</button>
                  <button
                    className="add-cart-btn"
                    disabled={product.stock === 0}
                  >
                    {product.stock === 0 ? "Out of Stock" : "Add To Cart"}
                  </button>
                </div>
              </div>
            </div>))}
        </div>
      </section>
    </div>
  );
}

export default Home;