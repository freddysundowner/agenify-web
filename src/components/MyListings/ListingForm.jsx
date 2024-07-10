import React, { useState } from "react";
import Select from "react-select";
import { MdOutlineClear } from "react-icons/md";
import { Upload, Button, Modal } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../auth/firebaseConfig";

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
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const handleChange = (e) => {
    if (e && e.fileList) {
      // Handle image upload changes
      setFormData({ ...formData, images: e.fileList });
    } else {
      // Handle other input changes
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    }
  };

  const beforeUpload = (file) => {
    return false; // Prevents automatic upload
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleCancel = () => setPreviewVisible(false);

  const props = {
    name: "images",
    multiple: true,
    onChange: handleChange,
    beforeUpload,
    onPreview: handlePreview,
    fileList: formData.images,
    listType: "picture-card",
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
    try {
      setUploading(true);

      const imageUrls = await Promise.all(
        formData.images.map(async (image) => {
          const storageRef = ref(storage, `images/${image.name}`);
          const uploadTask = uploadBytesResumable(
            storageRef,
            image.originFileObj
          );

          const downloadURL = await new Promise((resolve, reject) => {
            uploadTask.on("state_changed", null, reject, () => {
              getDownloadURL(uploadTask.snapshot.ref).then(resolve);
            });
          });
          return downloadURL;
        })
      );

      await addDoc(collection(db, "listings"), {
        ...formData,
        images: imageUrls,
        category: formData.category ? formData.category.value : null,
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
        category: null,
      });
      await addDoc(collection(db, "listings"), {
        ...formData,
        category: formData.category ? formData.category.value : null,
      });
      alert("Listing posted successfully!");
    } catch (error) {
      setUploading(false);
      console.error("Error adding listing:", error);
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setUploading(true);

  //   const imageUrls = await Promise.all(
  //     formData.images.map(async (image) => {
  //       const storageRef = ref(storage, `images/${image.name}`);
  //       const uploadTask = uploadBytesResumable(
  //         storageRef,
  //         image.originFileObj
  //       );

  //       await new Promise((resolve, reject) => {
  //         uploadTask.on("state_changed", null, reject, () => {
  //           getDownloadURL(uploadTask.snapshot.ref).then(resolve);
  //         });
  //       });
  //     })
  //   );

  //   await addDoc(collection(firestore, "listings"), {
  //     ...formData,
  //     images: imageUrls,
  //   });

  //   setUploading(false);
  //   alert("Listing posted successfully!");
  //   setFormData({
  //     title: "",
  //     description: "",
  //     price: "",
  //     bedrooms: "",
  //     bathrooms: "",
  //     amenities: [],
  //     address: "",
  //     images: [],
  //   });
  // };

  const handleCategoryChange = (selectedOption) => {
    setFormData({ ...formData, category: selectedOption });
  };

  const removeAmenity = (index) => {
    const newAmenities = [...formData.amenities];
    newAmenities.splice(index, 1);
    setFormData({ ...formData, amenities: newAmenities });
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
        <ul className="mt-2 flex flex-wrap">
          {formData.amenities.map((am, index) => (
            <li
              key={index}
              className="flex items-center px-4 py-2 rounded-full m-1 cursor-pointer bg-primary text-white"
            >
              <p className="pr-2">{am.name}</p>
              <MdOutlineClear onClick={() => removeAmenity(index)} />
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
        <Upload {...props}>
          {formData?.images?.length < 5 && (
            <div>
              <UploadOutlined />
              <div style={{ marginTop: 8 }}>Upload Images</div>
            </div>
          )}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={handleCancel}
        >
          <img alt="preview" style={{ width: "100%" }} src={previewImage} />
        </Modal>
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
