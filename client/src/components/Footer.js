import React from "react";
import { Link } from "react-router-dom";
import {
    FaFacebookF,
    FaInstagram,
    FaTwitter,
    FaYoutube,
    FaLeaf,
    FaPhoneAlt,
    FaEnvelope,
    FaMapMarkerAlt,
} from "react-icons/fa";
import "./Footer.css";

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">

                {/* COLUMN 1 - ABOUT */}
                <div className="footer-col">
                    <div className="footer-logo">
                        <FaLeaf className="leaf-icon" />
                        <span>GreenAura</span>
                    </div>

                    <p className="footer-about">
                        GreenAura brings nature closer to you. Discover indoor plants,
                        outdoor plants, pots, seeds and everything you need to grow a
                        greener lifestyle.
                    </p>

                    <div className="footer-contact">
                        <p><FaPhoneAlt /> +91 98765 43210</p>
                        <p><FaEnvelope /> support@greenaura.com</p>
                        <p><FaMapMarkerAlt /> Surat, Gujarat, India</p>
                    </div>
                </div>

                {/* COLUMN 2 - QUICK LINKS */}
                <div className="footer-col">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/profile">My Account</Link></li>
                        <li><Link to="/orders">Orders</Link></li>
                        <li><Link to="/wishlist">Wishlist</Link></li>
                        <li><Link to="/cart">Cart</Link></li>
                    </ul>
                </div>

                {/* COLUMN 3 - CUSTOMER SERVICE */}
                <div className="footer-col">
                    <h4>Customer Service</h4>
                    <ul>
                        {/* <li><Link to="#">FAQs</Link></li> */}
                        {/* <li><Link to="#">Shipping Policy</Link></li> */}
                        {/* <li><Link to="#">Return Policy</Link></li> */}
                        {/* <li><Link to="#">Privacy Policy</Link></li> */}
                        <li><Link to="#">Terms & Conditions</Link></li>
                    </ul>
                </div>

                {/* COLUMN 4 - CATEGORIES */}
                <div className="footer-col">
                    <h4>Categories</h4>
                    <ul>
                        <li><Link to="#">Indoor Plants</Link></li>
                        <li><Link to="#">Outdoor Plants</Link></li>
                        <li><Link to="#">Succulents</Link></li>
                        <li><Link to="#">Seeds</Link></li>
                        <li><Link to="#">Pots & Planters</Link></li>
                    </ul>

                    {/* SOCIAL ICONS */}
                    <div className="social-icons">
                        <Link to="#"><FaFacebookF /></Link>
                        <Link to="#"><FaInstagram /></Link>
                        <Link to="#"><FaTwitter /></Link>
                        <Link to="#"><FaYoutube /></Link>
                    </div>
                </div>

            </div>

            {/* BOTTOM */}
            <div className="footer-bottom">
                © {new Date().getFullYear()} GreenAura. All Rights Reserved.
            </div>
        </footer>
    );
}

export default Footer;