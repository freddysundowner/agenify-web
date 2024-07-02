import React from "react";

const Switch = ({ checked, onChange }) => {
  return (
    <label className="flex items-center cursor-pointer bg-white shadow-sm rounded-full p-4">
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={onChange}
        />
        <div
          className={`block w-10 h-6 rounded-full ${
            checked ? "bg-green-500" : "bg-gray-300"
          }`}
        ></div>
        <div
          className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${
            checked ? "transform translate-x-full bg-green-500" : "bg-white"
          }`}
        ></div>
      </div>
      <span className="ml-3 text-gray-700">
        {checked ? "Online" : "Offline"}
      </span>
    </label>
  );
};

export default Switch;
