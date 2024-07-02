import React, { useEffect, useContext } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import ChatContext from "../context/ChatContext";

const SnackMessage = ({ message, duration = 3000, onClose }) => {
  const { showAlert, setShowAlert } = useContext(ChatContext);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setShowAlert({ show: false });
        if (onClose) {
          setTimeout(onClose, 500); // Wait for the animation to finish
        }
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose, setShowAlert]);
  console.log("error ", showAlert.error);

  return (
    showAlert.show && (
      <div
        className={`fixed top-4 right-4 z-50 p-4 ${
          showAlert.error === true ? "bg-red-500" : "bg-green-500"
        } text-white rounded-lg shadow-lg transform transition-transform ${
          showAlert.show ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex items-center">
          <FaCheck className="mr-2" />
          <span className="flex-1">{message}</span>
          <button
            onClick={() => setShowAlert({ show: false })}
            className="ml-4"
          >
            <FaTimes />
          </button>
        </div>
      </div>
    )
  );
};

export default SnackMessage;
