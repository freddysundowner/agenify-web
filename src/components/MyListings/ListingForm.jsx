import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import { MdOutlineClear } from "react-icons/md";
import { Upload, Button, Modal, Switch } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { collection, addDoc, GeoPoint } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { db, storage } from "../../auth/firebaseConfig";
import { useLoading } from "../../context/LoadingContext";
import { getPlaceDetails } from "../../services/httpClient";
import { Loader } from "@googlemaps/js-api-loader";
import { getCategories, getSubCategories } from "../../services/firebaseService";

const ListingForm = () => {
  const { loading, showLoading, hideLoading } = useLoading();
  const [map, setMap] = useState(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [mapCenter, setMapCenter] = useState({ lat: -34.397, lng: 150.644 });
  const [zoomLevel, setZoomLevel] = useState(8);
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setZoomLevel(15);
        },
        (error) => {
          console.error("Error getting location: " + error.message);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);
  useEffect(() => {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, // Replace with your Google Maps API key
      libraries: ["places"],
    });

    loader.load().then(() => {
      const google = window.google;
      const mapInstance = new google.maps.Map(mapRef.current, {
        center: mapCenter,
        zoom: zoomLevel,
      });
      setMap(mapInstance);

      const markerInstance = new google.maps.Marker({
        map: mapInstance,
        draggable: true,
      });
      markerRef.current = markerInstance;

      google.maps.event.addListener(markerInstance, "dragend", async (event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        const geocoder = new google.maps.Geocoder();
        const response = await geocoder.geocode({ location: { lat, lng } });
        const address = response.results[0].formatted_address;
        setFormData((prev) => ({
          ...prev,
          address: address,
          geopoint: new GeoPoint(lat, lng),
        }));
      });
    });
  }, [mapCenter]);

  const [formData, setFormData] = useState({
    sellDescription: "",
    sellPrice: "",
    bedrooms: "",
    bathrooms: "",
    sellAmenities: [],
    sellAddress: "",
    images: [],
    negotiable: false,
    categoryDetails: null,
    subcategoryDetails: null,
    subcategoryId: null,
    position: null,
    categoryId: null,
    comments_count: 0,
    currency: "KES",
    deposit: false,
    favorites: 0,
    id: null,
    offerprice: 0,
    ownerid: null,
    sellContact: "",
    sellImages: [],
    status: "active",
    sellPriceDeposit: 0,
    type: "properties",
    videoinfo: "",
  });
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  useEffect(() => {
    getCategories().then((data) => {
      setCategories(data);
    })
  }, [])
  const [uploading, setUploading] = useState(false);
  const [amenity, setAmenity] = useState("");
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const handleLocationChange = async (place) => {
    showLoading(true);
    console.log(place);
    try {
      if (place && place.value && place.value.place_id) {
        const location = await getPlaceDetails(place.value.place_id);
        hideLoading(true);
        const { lat, lng } = location;
        setFormData((prev) => ({ ...prev, sellAddress: place.label, position: new GeoPoint(lat, lng) }));

        if (map && markerRef.current) {
          map.setCenter({ lat, lng });
          markerRef.current.setPosition({ lat, lng });
        }
      }
    } catch (err) {
      console.log(err);
      hideLoading(true);
    }
  };

  const handleChange = (e) => {
    if (e && e.fileList) {
      // Handle image upload changes
      setFormData({ ...formData, sellImages: e.fileList });
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
    name: "sellImages",
    multiple: true,
    onChange: handleChange,
    beforeUpload,
    onPreview: handlePreview,
    fileList: formData.sellImages,
    listType: "picture-card",
  };

  const handleAmenityChange = (e) => {
    setAmenity(e.target.value);
  };

  const addAmenity = () => {
    if (amenity) {
      setFormData({
        ...formData,
        sellAmenities: [...formData.sellAmenities, { name: amenity }],
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

      await addDoc(collection(db, "items"), {
        ...formData,
        sellImages: imageUrls,
        categoryDetails: formData.categoryDetails ? formData.categoryDetails.value : null,
        categoryId: formData.categoryId ? formData.categoryId.value : null,
        createdAt: serverTimestamp(),
      });

      setUploading(false);
      alert("Listing posted successfully!");
      setFormData({
        sellAddress: "",
        sellDescription: "",
        sellPrice: "",
        sellImages: [],
        sellTitle: "",
        sellPriceDeposit: 0,
        type: "properties",
        videoinfo: "",
        sellContact: "",
        sellAmenities: [],
        position: null,
        bedrooms: 0,
        bathrooms: 0,
        offerprice: 0,
        ownerid: null,
        status: "active",
        categoryDetails: null,
        subcategoryDetails: null,
        negotiable: false,
      });
    } catch (error) {
      setUploading(false);
      console.error("Error adding listing:", error);
    }
  };

  const handleCategoryChange = (selectedOption) => {
    setSubcategories([]);
    setFormData({ ...formData, categoryDetails: selectedOption, subcategoryDetails: null, });
    console.log(selectedOption);
    getSubCategories(selectedOption.value).then((subCategories) => {
      setSubcategories(subCategories);
    })
  };
  const handleSwitchChange = (checked) => {
    setFormData({ ...formData, negotiable: checked });
  };
  const handleSubcategoryChange = (selectedOption) => {
    setFormData({ ...formData, subcategoryDetails: selectedOption });
  };

  const removeAmenity = (index) => {
    const newAmenities = [...formData.sellAmenities];
    newAmenities.splice(index, 1);
    setFormData({ ...formData, sellAmenities: newAmenities });
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
          options={categories}
          value={formData.categoryDetails?.name}
          onChange={handleCategoryChange}
          className="w-full"
        />
      </div>
      {
        subcategories && subcategories.length > 0 && (
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="subcategory"
            >
              Subcategory
            </label>
            <Select
              id="subcategory"
              options={subcategories}
              value={formData.subcategoryDetails?.name}
              onChange={handleSubcategoryChange}
              className="w-full"
            />
          </div>
        )
      }
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="description"
        >
          Description
        </label>
        <textarea
          id="description"
          name="sellDescription"
          value={formData.sellDescription}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4 items-center">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
            Price
          </label>
          <input
            id="price"
            name="sellPrice"
            type="number"
            value={formData.sellPrice}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="flex items-center">
          <label className="block text-gray-700 text-sm font-bold mb-2 mr-2">
            Negotiable
          </label>
          <Switch checked={formData.negotiable} onChange={handleSwitchChange} />
        </div>
      </div>


      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="bedrooms"
          >
            How many bedrooms?
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
            How many bathrooms?
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
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
          Where is the house Located?
        </label>
        <GooglePlacesAutocomplete
          selectProps={{
            value: formData.sellAddress ? { label: formData.sellAddress, value: formData.sellAddress } : null,
            onChange: handleLocationChange,
          }}
        />
      </div>
      <div className="mb-4" style={{ height: "300px" }}>
        <div ref={mapRef} style={{ height: "100%" }} />
      </div>


      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="amenities"
        >
          Add Other Amenities
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
          {formData.sellAmenities.map((am, index) => (
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
          {formData?.sellImages && formData?.sellImages?.length < 5 && (
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
