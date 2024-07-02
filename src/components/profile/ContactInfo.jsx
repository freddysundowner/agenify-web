import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../../redux/features/userSlice";
import { updateListData } from "../../services/firebaseService";
import { useAuth } from "../../context/AuthContext";

const ContactInfo = () => {
  const dispatch = useDispatch();
  const [saving, setSaving] = useState(false);
  const { currentUser } = useAuth();

  const List = useSelector((state) => state.List.currentList);

  const [formData, setFormData] = useState({
    ...List,
    email: currentUser?.email,
  });

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(formData);
    setSaving(true);
    await updateListData(formData.id, formData);
    dispatch(updateUser(formData));
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            value={formData?.username}
            onChange={(e) => handleChange("username", e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
          />
        </div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={formData?.email}
          onChange={(e) => handleChange("email", e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          WhatsApp
        </label>
        <input
          type="text"
          value={formData?.whatsapp}
          onChange={(e) => handleChange("whatsapp", e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Facebook
        </label>
        <input
          type="text"
          value={formData?.facebook}
          onChange={(e) => handleChange("facebook", e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          LinkedIn
        </label>
        <input
          type="text"
          value={formData?.linkedin}
          onChange={(e) => handleChange("linkedin", e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
        />
      </div>
      {saving ? (
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md"
        >
          Saving...
        </button>
      ) : (
        <button
          type="submit"
          className="w-full py-2 px-4 bg-green-500 text-white rounded-md"
        >
          Save Changes
        </button>
      )}
    </form>
  );
};

export default ContactInfo;
