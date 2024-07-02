// src/services/firebaseService.js
import axios from "axios";

// Set up the base URL for Axios
const apiClient = axios.create({
  baseURL: "http://localhost:5000", // Change this to your backend server URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Fetch services from your backend
export const fetchServices = async () => {
  const response = await apiClient.get("/api/services");
  return response.data;
};

// Get place details from Google Places API
export const getPlaceDetails = async (placeId) => {
  const response = await apiClient.get("/api/place-details", {
    params: { placeId },
  });
  console.log(response.data);
  return response.data.result.geometry.location;
};
