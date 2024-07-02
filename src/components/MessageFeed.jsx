import React, { useState, useEffect, useContext } from "react";
import ChatContext from "../context/ChatContext"; // Import ChatContext
import { FaTimes } from "react-icons/fa";

const MessageFeed = () => {
  const { visiblePopupMessages, setVisiblePopupMessages } =
    useContext(ChatContext);

  return (
    <div className="fixed bottom-10 left-20 max-w-xs z-50">
      {visiblePopupMessages.map((msg, index) => (
        <div key={index} className="relative mb-4 flex items-center">
          <div className="absolute -left-10 w-10 h-10 bg-gray-400 shadow-lg  rounded-full flex items-center justify-center text-gray-800 font-bold">
            {msg.sender?.username?.charAt(0)}
          </div>
          <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg ml-6 relative">
            <div className="absolute -left-3 top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-gray-800"></div>
            <div>{msg.message}</div>
            <button
              className="absolute top-1 right-1 text-white"
              onClick={() =>
                setVisiblePopupMessages((prevMessages) =>
                  prevMessages.filter((_, i) => i !== index)
                )
              }
            >
              <FaTimes />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageFeed;
