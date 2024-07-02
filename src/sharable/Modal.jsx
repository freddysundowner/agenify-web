import { useContext, useState } from "react";
import ChatContext from "../context/ChatContext";
import Select from "react-select";
import { FaTimes, FaUserCircle } from "react-icons/fa";

const AcceptRejectOffer = ({ title, children, isOpen, onClose }) => {
  if (isOpen === false) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-4 rounded-md shadow-md w-1/2 mx-10">
        <div className="flex justify-between items-center ">
          <h3 className="text-lg font-semibold mb-4">{title}</h3>
          <button onClick={onClose} className="text-red-500">
            Close
          </button>
        </div>
        {children}
      </div>
      <div className="flex  justify-end mt-10">
        <div className="flex gap-4">
          <button
            onClick={() => {
              // let message = messages.filter((msg) => msg.id == id);
              // if (message) {
              //   const rejectionMessage = {
              //     id: Date.now(),
              //     sender: "System",
              //     text: `Booking rejected.`,
              //     timestamp: new Date().toLocaleTimeString(),
              //     type: "info",
              //   };
              //   addMessage(rejectionMessage);
              //   setMessages((prevMessages) =>
              //     prevMessages.map((msg) =>
              //       msg.id === id ? { ...msg, status: "rejected" } : msg
              //     )
              //   );
              // }
              // closeModal();
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-md"
          >
            Cancel
          </button>
          <button
            // onClick={() => positiveClick}
            className="px-4 py-2 bg-green-500 text-white rounded-md"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};
export default AcceptRejectOffer;
