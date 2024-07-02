import React from "react";

const BalanceCard = () => {
  return (
    <div className="mb-4 border p-4 rounded-md shadow-md justify-center items-center">
      <h4 className="text-md font-semibold">Available balance</h4>
      <p className="text-2xl text-green-500">$0.00</p>
      <p className="text-sm text-gray-500">+$0.00 pending</p>
      <button
        className="mt-2 py-2 px-4 bg-gray-300 text-gray-700 rounded-md"
        disabled
      >
        Get paid now
      </button>
    </div>
  );
};

export default BalanceCard;
