import React, { useEffect } from "react";
import "./SuccessPopup.css";
import { FaCheck } from "react-icons/fa";

function SuccessPopup({ show, title, message, onClose, autoClose = true }) {
  useEffect(() => {
    if (show && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000); // ⏱ auto close after 2 sec

      return () => clearTimeout(timer);
    }
  }, [show, autoClose, onClose]);

  if (!show) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-card animate-scale">
        <div className="popup-icon">
          <FaCheck />
        </div>

        <h2>{title}</h2>
        <p>{message}</p>

        <button onClick={onClose}>OK</button>
      </div>
    </div>
  );
}

export default SuccessPopup;