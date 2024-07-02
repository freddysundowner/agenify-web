import React, { useState } from "react";
import Select from "react-select";

const ListingForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    amenities: [],
    address: "",
    images: [],
  });
  const houseCategories = [
    { value: "apartment", label: "Apartment" },
    { value: "house", label: "House" },
    { value: "condo", label: "Condo" },
    { value: "townhouse", label: "Townhouse" },
  ];
  const [uploading, setUploading] = useState(false);
  const [amenity, setAmenity] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images") {
      setFormData({ ...formData, [name]: files });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAmenityChange = (e) => {
    setAmenity(e.target.value);
  };

  const addAmenity = () => {
    if (amenity) {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, { name: amenity }],
      });
      setAmenity("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    const imageUrls = await Promise.all(
      Array.from(formData.images).map(async (image) => {
        const storageRef = ref(storage, `images/${image.name}`);
        const uploadTask = uploadBytesResumable(storageRef, image);

        await new Promise((resolve, reject) => {
          uploadTask.on("state_changed", null, reject, () => {
            getDownloadURL(uploadTask.snapshot.ref).then(resolve);
          });
        });
      })
    );

    await addDoc(collection(firestore, "listings"), {
      ...formData,
      images: imageUrls,
    });

    setUploading(false);
    alert("Listing posted successfully!");
    setFormData({
      title: "",
      description: "",
      price: "",
      bedrooms: "",
      bathrooms: "",
      amenities: [],
      address: "",
      images: [],
    });
  };
  const handleCategoryChange = (selectedOption) => {
    setFormData({ ...formData, category: selectedOption });
  };

  return (
    <form
      className="max-full mx-auto p-4 bg-white rounded  mb-16"
      onSubmit={handleSubmit}
    >
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="category"
        >
          Category
        </label>
        <Select
          id="category"
          options={houseCategories}
          value={formData.category}
          onChange={handleCategoryChange}
          className="w-full"
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="title"
        >
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="description"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="price"
        >
          Price
        </label>
        <input
          id="price"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="bedrooms"
          >
            Bedrooms
          </label>
          <input
            id="bedrooms"
            name="bedrooms"
            type="number"
            value={formData.bedrooms}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div>
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="bathrooms"
          >
            Bathrooms
          </label>
          <input
            id="bathrooms"
            name="bathrooms"
            type="number"
            value={formData.bathrooms}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
      </div>

      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="address"
        >
          Address
        </label>
        <input
          id="address"
          name="address"
          type="text"
          value={formData.address}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="amenities"
        >
          Amenities
        </label>
        <div className="flex items-center">
          <input
            id="amenities"
            name="amenities"
            type="text"
            value={amenity}
            onChange={handleAmenityChange}
            className="w-full px-3 py-2 border rounded"
          />
          <button
            type="button"
            className="ml-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
            onClick={addAmenity}
          >
            Add
          </button>
        </div>
        <ul className="mt-2">
          {formData.amenities.map((am, index) => (
            <li key={index} className="text-gray-700">
              {am.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="images"
        >
          Images
        </label>
        <input
          id="images"
          name="images"
          type="file"
          multiple
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Submit Listing"}
      </button>
    </form>
  );
};

export default ListingForm;
