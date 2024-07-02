import React, { useState, useEffect, useContext } from "react";
import Drawer from "./Drawer"; // Import the reusable Drawer component
import { useDispatch } from "react-redux";
import { doc, updateDoc, getDocs, collection } from "firebase/firestore";
import { db, auth } from "../auth/firebaseConfig";
import { setUser } from "../redux/features/userSlice";
import Select from "react-select";
import { GeoPoint } from "firebase/firestore";
import { Spin } from "antd";

import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { TimePicker } from "antd"; // Import TimePicker from Ant Design or any other library
import moment from "moment"; // Import moment for handling time
import { getPlaceDetails } from "../services/httpClient";
import Loading from "../sharable/loading";
import { useLoading } from "../context/LoadingContext";
import { updateListData } from "../services/firebaseService";
import ChatContext from "../context/ChatContext";

const ListFormDrawer = ({ isOpen, onClose }) => {
  const { loading, showLoading, hideLoading } = useLoading();
  const { setShowAlert } = useContext(ChatContext); // Use ChatContext

  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [servicesOptions, setServicesOptions] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    skill: "",
    whatsapp: "",
    facebook: "",
    linkedin: "",
    email: "",
    pricePerHour: "",
    description: "",
    services: [],
    availability: { weekly: [], specificDates: [] },
    location: "",
    reviews: [],
    workHistory: [],
    rating: 0,
    distance: 0,
  });
  const [currentAvailability, setCurrentAvailability] = useState({});

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const querySnapshot = await getDocs(collection(db, "services"));
    const servicesList = querySnapshot.docs.map((doc) => ({
      value: doc.id,
      label: doc.data().label,
    }));
    setServicesOptions(servicesList);
  };

  const handleChange = (e) => {
    console.log(e.target);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleLocationChange = async (place) => {
    showLoading(true);
    if (place && place.value && place.value.place_id) {
      const location = await getPlaceDetails(place.value.place_id);
      hideLoading(true);
      // handleChange("location", place?.label);
      setFormData((prev) => ({ ...prev, ["location"]: place?.label }));
      console.log(new GeoPoint(location.lat, location.lng));
      setFormData((prev) => ({
        ...prev,
        ["geopoint"]: new GeoPoint(location.lat, location.lng),
      }));

      // handleChange("geopoint", new GeoPoint(location.lat, location.lng));
    } else {
      // handleChange("location", { lat: null, lng: null });
    }
  };

  const handleServicesChange = (selectedOptions) => {
    const updatedServices = selectedOptions.map((service) => {
      const existingService = formData.services.find(
        (s) => s.value === service.value
      );
      return existingService
        ? existingService
        : { ...service, priceType: "perHour", price: "", availability: [] };
    });
    setFormData({
      ...formData,
      services: updatedServices,
    });
  };

  const handleSaveAvailability = (serviceIndex) => {
    const newServices = [...formData.services];
    newServices[serviceIndex].availability.push({
      ...currentAvailability[serviceIndex],
    });
    setFormData({ ...formData, services: newServices });
    setCurrentAvailability({
      ...currentAvailability,
      [serviceIndex]: { day: "", slots: [{ from: "", to: "" }] },
    });
  };

  const handleRemoveTimeSlot = (serviceIndex, slotIndex) => {
    const newSlots = [...currentAvailability[serviceIndex].slots];
    newSlots.splice(slotIndex, 1);
    setCurrentAvailability({
      ...currentAvailability,
      [serviceIndex]: {
        ...currentAvailability[serviceIndex],
        slots: newSlots,
      },
    });
  };

  const handleNext = () => {
    if (step === 2) {
      for (let service of formData.services) {
        if (
          !service.price ||
          !service.priceType ||
          service.availability.length === 0
        ) {
          setShowAlert({
            show: true,
            error: true,
            message:
              "Please ensure each service has a price, price type, and at least one day of availability.",
          });
          return;
        }
      }
    }
    setStep(step + 1);
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    showLoading(true);
    const user = auth.currentUser;

    if (user) {
      const ListData = {
        ...formData,
        isList: true,
      };

      // Expand "All Days" into individual days
      ListData.availability.weekly = ListData.availability.weekly.reduce(
        (acc, day) => {
          if (day.day === "All Days") {
            const allDays = [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ];
            allDays.forEach((d) => {
              acc.push({ day: d, slots: day.slots });
            });
          } else {
            acc.push(day);
          }
          return acc;
        },
        []
      );

      try {
        // const userDocRef = doc(db, "users", user.uid);
        // await updateDoc(userDocRef, ListData);
        await updateListData(user.uid, ListData);
        setShowAlert({
          show: true,
          error: false,
          message: "List profile updated successfully",
        });
        dispatch(setUser(ListData));
        hideLoading(true);
        onClose();
      } catch (error) {
        console.error("Error updating List status:", error);
      }
    }
  };

  const renderBasicInformation = () => (
    <div>
      <h2 className="text-xl font-bold mb-4">Basic Information</h2>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="location"
        >
          Location
        </label>
        <GooglePlacesAutocomplete
          selectProps={{
            value: {
              label: formData.location,
              value: formData.location,
            },
            onChange: handleLocationChange,
          }}
          // onPlaceSelected={(place) => {
          //   console.log("onPlaceSelected", place);
          //   // setFormData({
          //   //   ...formData,
          //   //   location: place.formatted_address,
          //   // });
          //   handleChange("location", place.formatted_address);
          // }}
          // types={["address"]}
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="description"
        >
          Profile Description
        </label>
        <textarea
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>
    </div>
  );

  const handleAddTimeSlot = (serviceIndex) => {
    const newSlots = [
      ...currentAvailability[serviceIndex].slots,
      { from: "", to: "" },
    ];
    setCurrentAvailability({
      ...currentAvailability,
      [serviceIndex]: {
        ...currentAvailability[serviceIndex],
        slots: newSlots,
      },
    });
  };

  const renderAvailabilityForm = (service, index) => {
    const availableDays = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    const selectedDays = service.availability.map((avail) => avail.day);

    return (
      <div key={service.value} className="mb-4 border rounded p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">{service.label}</h3>
          <button
            type="button"
            className="bg-red-500 text-white px-2 py-1 rounded"
            onClick={() => {
              const newServices = formData.services.filter(
                (_, i) => i !== index
              );
              setFormData({ ...formData, services: newServices });
            }}
          >
            Remove
          </button>
        </div>
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor={`priceType-${service.value}`}
        >
          {service.label} Price Type
        </label>
        <select
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
          id={`priceType-${service.value}`}
          name={`priceType-${service.value}`}
          value={service.priceType}
          onChange={(e) => {
            const newServices = [...formData.services];
            newServices[index].priceType = e.target.value;
            setFormData({ ...formData, services: newServices });
          }}
          required
        >
          <option value="perHour">Per Hour</option>
          <option value="fixed">Fixed Price</option>
        </select>
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor={`price-${service.value}`}
        >
          {service.label}{" "}
          {service.priceType === "perHour" ? "Price Per Hour" : "Fixed Price"}
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id={`price-${service.value}`}
          name={`price-${service.value}`}
          type="text"
          value={service.price}
          onChange={(e) => {
            const newServices = [...formData.services];
            newServices[index].price = e.target.value;
            setFormData({ ...formData, services: newServices });
          }}
          required
        />

        {service.availability.length > 0 && (
          <div className="m-4">
            <div className="flex flex-wrap gap-2">
              {service.availability.map((avail, availIndex) => (
                <div
                  key={availIndex}
                  className="bg-primary text-white px-2 py-1 rounded-full flex items-center"
                >
                  <span>
                    {avail.day}:{" "}
                    {avail.slots
                      .map((slot) => `${slot.from} - ${slot.to}`)
                      .join(", ")}
                  </span>
                  <button
                    type="button"
                    className="ml-2 text-white"
                    onClick={() => {
                      const newServices = [...formData.services];
                      newServices[index].availability.splice(availIndex, 1);
                      setFormData({
                        ...formData,
                        services: newServices,
                      });
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {!service.availability.some((avail) => avail.day === "All Days") && (
          <>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Select Day of the Week
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
              value={currentAvailability[index]?.day || ""}
              onChange={(e) => {
                const selectedDay = e.target.value;
                setCurrentAvailability({
                  ...currentAvailability,
                  [index]: {
                    day: selectedDay,
                    slots: [{ from: "", to: "" }],
                  },
                });
              }}
            >
              <option value="">Select Day</option>
              <option value="All Days">All Days</option>
              {availableDays
                .filter((day) => !selectedDays.includes(day))
                .map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
            </select>
            <button
              type="button"
              className="bg-primary text-white px-4 py-2 rounded mt-2 mb-2"
              onClick={() => handleAddTimeSlot(index)}
            >
              Add Time Slot
            </button>
            {currentAvailability[index]?.day && (
              <>
                {currentAvailability[index].slots.map((slot, slotIndex) => (
                  <div key={slotIndex} className="flex items-center mb-2">
                    <TimePicker
                      className="w-full"
                      use12Hours
                      format="h:mm a"
                      placeholder="From"
                      value={slot.from ? moment(slot.from, "h:mm a") : null}
                      onChange={(time, timeString) => {
                        const newSlots = [...currentAvailability[index].slots];
                        newSlots[slotIndex].from = timeString;
                        setCurrentAvailability({
                          ...currentAvailability,
                          [index]: {
                            ...currentAvailability[index],
                            slots: newSlots,
                          },
                        });
                      }}
                    />
                    <span className="mx-2">to</span>
                    <TimePicker
                      className="w-full"
                      use12Hours
                      format="h:mm a"
                      placeholder="To"
                      value={slot.to ? moment(slot.to, "h:mm a") : null}
                      onChange={(time, timeString) => {
                        const newSlots = [...currentAvailability[index].slots];
                        newSlots[slotIndex].to = timeString;
                        setCurrentAvailability({
                          ...currentAvailability,
                          [index]: {
                            ...currentAvailability[index],
                            slots: newSlots,
                          },
                        });
                      }}
                    />
                    <button
                      type="button"
                      className="bg-red-500 text-white px-2 py-1 rounded ml-2"
                      onClick={() => handleRemoveTimeSlot(index, slotIndex)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="bg-primary text-white px-4 py-2 rounded mt-2"
                  onClick={() => handleSaveAvailability(index)}
                  disabled={
                    !currentAvailability[index]?.slots[0]?.from ||
                    !currentAvailability[index]?.slots[0]?.to
                  }
                >
                  Save Availability
                </button>
              </>
            )}
          </>
        )}
      </div>
    );
  };

  const renderServicesAndAvailability = () => (
    <div>
      <h2 className="text-xl font-bold mb-4">Services / Availability</h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Select Service(s) you offer (You can select more than one service)
        </label>
        <Select
          isMulti
          options={servicesOptions}
          value={formData.services}
          onChange={handleServicesChange}
        />
      </div>
      {formData.services.map((service, index) =>
        renderAvailabilityForm(service, index)
      )}
    </div>
  );

  const renderContactInformation = () => (
    <div>
      <h2 className="text-xl font-bold mb-4">Reachout</h2>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="whatsapp"
        >
          Whatsapp Number
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="whatsapp"
          name="whatsapp"
          type="text"
          value={formData.whatsapp}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="facebook"
        >
          Facebook
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="facebook"
          name="facebook"
          type="text"
          value={formData.facebook}
          onChange={handleChange}
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="linkedin"
        >
          LinkedIn
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="linkedin"
          name="linkedin"
          type="text"
          value={formData.linkedin}
          onChange={handleChange}
        />
      </div>
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 1:
        return renderBasicInformation();
      case 2:
        return renderServicesAndAvailability();
      case 3:
        return renderContactInformation();
      default:
        return null;
    }
  };
  return (
    <Drawer
      title="Become a List"
      isOpen={isOpen}
      onClose={onClose}
      width="md:w-2/3"
    >
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <Spin size="large" />
        </div>
      )}
      <form onSubmit={handleSubmit} className="p-4 mb-20">
        {renderStep()}
        <div className="flex items-center justify-between mt-4">
          {step > 1 && (
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={handlePrevious}
            >
              Previous
            </button>
          )}
          {step < 3 ? (
            <button
              type="button"
              className="bg-primary text-white px-4 py-2 rounded"
              onClick={handleNext}
            >
              Next
            </button>
          ) : loading ? (
            <div className="flex">
              <button
                type="button"
                className="bg-primary text-white px-4 py-2 rounded"
              >
                <Loading color="primary" />
              </button>
            </div>
          ) : (
            <button
              className="bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Submit
            </button>
          )}
        </div>
      </form>
    </Drawer>
  );
};

export default ListFormDrawer;
