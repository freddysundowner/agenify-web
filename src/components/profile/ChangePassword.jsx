import React, { useState } from "react";
import { useDispatch } from "react-redux";
// import { changePassword } from "../../redux/features/authSlice" // Assuming you have an authSlice for managing authentication

const ChangePassword = () => {
  const dispatch = useDispatch();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }
    // dispatch(changePassword({ currentPassword, newPassword }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Current Password
        </label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          New Password
        </label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Confirm New Password
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
        />
      </div>
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <button
        type="submit"
        className="w-full py-2 px-4 bg-green-500 text-white rounded-md"
      >
        Change Password
      </button>
    </form>
  );
};

export default ChangePassword;
