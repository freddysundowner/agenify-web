import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../../redux/features/userSlice";
import Select from "react-select";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { TimePicker } from "antd";
import { GeoPoint } from "firebase/firestore";
import moment from "moment";
import {
  fetchServices,
  updateListAvailability,
  updateListData,
} from "../../services/firebaseService"; // Import the fetchServices function
import Loading from "../../sharable/loading";
import { getPlaceDetails } from "../../services/httpClient";

const daysOptions = [
  { value: "Monday", label: "Monday" },
  { value: "Tuesday", label: "Tuesday" },
  { value: "Wednesday", label: "Wednesday" },
  { value: "Thursday", label: "Thursday" },
  { value: "Friday", label: "Friday" },
  { value: "Saturday", label: "Saturday" },
  { value: "Sunday", label: "Sunday" },
  { value: "All Days", label: "All Days" },
];

const ProfileSettings = () => {
  const dispatch = useDispatch();
  const List = useSelector((state) => state.List.currentList);
  const [formData, setFormData] = useState(List);
  const [servicesOptions, setServicesOptions] = useState([]);
  const [currentAvailability, setCurrentAvailability] = useState(
    formData.services.map(() => ({ day: "", slots: [{ from: "", to: "" }] }))
  );
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const getServices = async () => {
      const servicesList = await fetchServices();
      setServicesOptions(servicesList);
    };
    getServices();

    if (List.availability) {
      setFormData(List);
    }
  }, [List]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };
  const handleLocationChange = async (place) => {
    if (place && place.value && place.value.place_id) {
      const location = await getPlaceDetails(place.value.place_id);
      handleChange("location", place?.label);
      console.log(new GeoPoint(location.lat, location.lng));
      handleChange("geopoint", new GeoPoint(location.lat, location.lng));
    } else {
      handleChange("location", { lat: null, lng: null });
    }
  };

  const handleSkillsChange = (selectedOptions) => {
    const updatedServices = selectedOptions.map((service) => {
      const existingService = formData.services.find(
        (s) => s.value === service.value
      );
      return existingService
        ? existingService
        : { ...service, availability: { weekly: [], specificDates: [] } };
    });
    handleChange("services", updatedServices);
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    const userId = List.id; // Assuming List object has the user's id
    await updateListData(userId, formData);
    setSaving(false);
  };

  const handleSaveAvailability = async (serviceIndex) => {
    setLoading(true);
    const newServices = JSON.parse(JSON.stringify(formData.services)); // Deep clone the services array
    newServices[serviceIndex].availability.push({
      ...currentAvailability[serviceIndex],
    });

    const userId = List.id; // Assuming List object has the user's id
    await updateListAvailability(userId, newServices);
    setLoading(false);

    setFormData({ ...formData, services: newServices });
    setCurrentAvailability(
      currentAvailability.map((availability, index) =>
        index === serviceIndex
          ? { day: "", slots: [{ from: "", to: "" }] }
          : availability
      )
    );
  };

  const handleAddTimeslot = (serviceIndex) => {
    const newAvailability = [...currentAvailability];
    newAvailability[serviceIndex].slots.push({ from: "", to: "" });
    setCurrentAvailability(newAvailability);
  };

  const handleRemoveTimeslot = (serviceIndex, slotIndex) => {
    const newAvailability = [...currentAvailability];
    newAvailability[serviceIndex].slots.splice(slotIndex, 1);
    setCurrentAvailability(newAvailability);
  };

  const handleRemoveAvailability = (serviceIndex, availIndex) => {
    const newServices = [...formData.services];
    newServices[serviceIndex].availability = newServices[
      serviceIndex
    ].availability.filter((_, i) => i !== availIndex);
    setFormData({ ...formData, services: newServices });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(updateUser(formData));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Skills
        </label>
        <Select
          isMulti
          value={formData.services}
          onChange={handleSkillsChange}
          options={servicesOptions}
          className="mt-1"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
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
        />
      </div>
      <div className="mb-4">
        {formData.services.map((service, serviceIndex) => (
          <div key={service.value} className="mb-4">
            <h3 className="text-lg font-bold">{service.label}</h3>

            {service.availability.length > 0 && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-2 mt-2">
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
                        onClick={() =>
                          handleRemoveAvailability(serviceIndex, availIndex)
                        }
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-4">
              <Select
                value={daysOptions.find(
                  (option) =>
                    option.value === currentAvailability[serviceIndex].day
                )}
                onChange={(option) => {
                  const newAvailability = [...currentAvailability];
                  newAvailability[serviceIndex].day = option.value;
                  setCurrentAvailability(newAvailability);
                }}
                options={daysOptions.filter(
                  (option) =>
                    !service.availability.some(
                      (avail) => avail.day === option.value
                    )
                )}
                className="mt-1"
              />
              <button
                type="button"
                className="bg-primary text-white px-4 py-2 rounded mt-2"
                onClick={() => handleAddTimeslot(serviceIndex)}
              >
                Add Timeslot
              </button>
              {currentAvailability[serviceIndex].day && (
                <div className="mt-2">
                  {currentAvailability[serviceIndex].slots.map(
                    (slot, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <TimePicker
                          className="w-full"
                          use12Hours
                          format="h:mm a"
                          placeholder="From"
                          value={slot.from ? moment(slot.from, "h:mm a") : null}
                          onChange={(time, timeString) => {
                            const newSlots = [
                              ...currentAvailability[serviceIndex].slots,
                            ];
                            newSlots[index].from = timeString;
                            const newAvailability = [...currentAvailability];
                            newAvailability[serviceIndex].slots = newSlots;
                            setCurrentAvailability(newAvailability);
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
                            const newSlots = [
                              ...currentAvailability[serviceIndex].slots,
                            ];
                            newSlots[index].to = timeString;
                            const newAvailability = [...currentAvailability];
                            newAvailability[serviceIndex].slots = newSlots;
                            setCurrentAvailability(newAvailability);
                          }}
                        />
                        <button
                          type="button"
                          className="bg-red-500 text-white px-2 py-1 rounded ml-2"
                          onClick={() =>
                            handleRemoveTimeslot(serviceIndex, index)
                          }
                        >
                          Remove
                        </button>
                      </div>
                    )
                  )}
                  {loading ? (
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
                      type="button"
                      className="bg-primary text-white px-4 py-2 rounded mt-2"
                      onClick={() => handleSaveAvailability(serviceIndex)}
                      disabled={
                        !currentAvailability[serviceIndex].slots[0]?.from ||
                        !currentAvailability[serviceIndex].slots[0]?.to
                      }
                    >
                      Save Availability
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {saving ? (
        <div className="flex justify-center">
          <button
            type="button"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            <Loading color="white" />
          </button>
        </div>
      ) : (
        <button
          type="submit"
          onClick={handleSaveChanges}
          className="w-full py-2 px-4 bg-green-500 text-white rounded-md"
        >
          Save Changes
        </button>
      )}
    </form>
  );
};

export default ProfileSettings;
