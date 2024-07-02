// Drawer.js
import React from "react";
import { FaTimes, FaUserCircle } from "react-icons/fa";

const Drawer = ({
  title,
  children,
  isOpen,
  onClose,
  // width = "w-full md:w-2/3 lg:w-2/3 xl:w-1/2 2xl:w-1/2 3xl:w-1/2 h-full",
  width = "2xl:w-2/3 xl:w-1/2 2xl:w-1/2 3xl:w-1/2 h-full lg:w-2/3 md:w-2/3 sm:w-full",
  subText = "",
  actionButton,
  showheader = true,
}) => {
  // Default width to 2/5
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40 flex justify-end top-20">
      <div
        className={`${width} bg-white h-full shadow-xl transition-transform transform translate-x-0 ease-in-out duration-300`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          {showheader ? (
            <div className="flex items-center gap-6">
              <div>
                <h2 className="text-xl font-semibold">{title}</h2>
                {subText && <p className="text-sm font-thin">{subText}</p>}
              </div>
            </div>
          ) : (
            <div></div>
          )}
          <div className="flex">
            {actionButton}
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        <div className="p-4 overflow-y-auto h-full">{children}</div>
      </div>
    </div>
  );
};

export default Drawer;
