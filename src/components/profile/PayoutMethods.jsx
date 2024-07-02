import React from "react";

const PayoutMethods = () => {
  return (
    <div className="mb-4 border p-4 rounded-md">
      <h4 className="text-md font-semibold">Payout Methods</h4>
      <p className="text-gray-500">
        To change which method is preferred, edit your withdrawal schedule.
      </p>
      <div className="mt-2">
        {/* <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/M-PESA_LOGO.png/1200px-M-PESA_LOGO.png"
              alt="M-PESA"
              className="w-8 h-8 mr-2"
            />
            <p className="text-gray-500">M-PESA ending in 3474</p>
            <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
              Preferred
            </span>
          </div>
          <div className="flex items-center">
            <button className="text-blue-500 mr-2">Edit</button>
            <button className="text-red-500">Remove</button>
          </div>
        </div> */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <img
              src="https://www.paypalobjects.com/webstatic/icon/pp258.png"
              alt="PayPal"
              className="w-8 h-8 mr-2"
            />
            <p className="text-gray-500">PayPal - reggycodas254@gmail.com</p>
          </div>
          <button className="text-red-500">Remove</button>
        </div>
      </div>
      <button className="mt-2 py-2 px-4 bg-green-500 text-white rounded-md">
        Add a method
      </button>
    </div>
  );
};

export default PayoutMethods;
