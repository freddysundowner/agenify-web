import React, { useState, useEffect, useContext } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaCheck } from "react-icons/fa";
import Select from "react-select";
import moment from "moment";
import ChatContext from "../context/ChatContext";
import DrawerContext from "../context/DrawerContext";
import { useAuth } from "../context/AuthContext";
import { useSelector } from "react-redux";

const AvailabilityCalendar = ({ List, primaryColor }) => {
  const currentList = useSelector((state) => state.List.currentList);
  const { addMessage } = useContext(ChatContext);
  const [date, setDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [quote, setQuote] = useState(null);
  const [counterOffers, setCounterOffers] = useState([]);
  const [finalQuote, setFinalQuote] = useState(null);

  const { openDrawer, closeDrawer } = useContext(DrawerContext);
  const handleDateChange = (newDate) => {
    setDate(newDate);
    setSelectedSlot(null); // Reset selected slot when date changes
    setQuote(null); // Reset quote when date changes
    setFinalQuote(null);
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    if (selectedService) {
      calculateQuote(selectedService, slot);
    }
  };

  const handleServiceChange = (selectedOption) => {
    setSelectedService(selectedOption);
    setDate(new Date());
    setSelectedSlot(null);
    setQuote(null);
    setFinalQuote(null);
  };

  const calculateQuote = (service, slot) => {
    const { price, priceType } = service;
    if (priceType === "perHour") {
      const fromTime = moment(slot.from, "h:mm a");
      const toTime = moment(slot.to, "h:mm a");
      const duration = moment.duration(toTime.diff(fromTime));
      const hours = duration.asHours();
      const totalQuote = hours * price;
      setQuote(totalQuote);
      generateCounterOffers(totalQuote);
    } else {
      setQuote(price);
      generateCounterOffers(price);
    }
  };

  const generateCounterOffers = (basePrice) => {
    const offer1 = basePrice * 0.9;
    const offer2 = basePrice * 0.95;
    const offer3 = basePrice * 1.05;
    setCounterOffers([offer1.toFixed(2), offer2.toFixed(2), offer3.toFixed(2)]);
  };

  const handleCounterOfferSelect = (offer) => {
    setFinalQuote(parseFloat(offer));
  };

  const handleBooking = () => {
    if (!currentList) {
      closeDrawer("listDrawer");
      openDrawer("loginDrawer", List);
      return;
    }
    if (selectedSlot && selectedService) {
      let message = `Hi ${List.username}, I would like to book you for ${
        selectedService.label
      } at ${selectedSlot.from} - ${
        selectedSlot.to
      } on ${date.toDateString()}\n. Kindly send me the quote.`;
      if (finalQuote) {
        message = `Can I book you for ${selectedService.label} at ${
          selectedSlot.from
        } - ${selectedSlot.to} on ${date.toDateString()} for $${finalQuote}?`;
      }
      const bookingMessage = {
        sender: {
          id: currentList.id,
          username: currentList.username,
          photoURL: currentList?.photoURL ?? null,
        },
        receiver: {
          id: List.id,
          username: List.username,
          photoURL: List?.photoURL ?? null,
        },
        message,
        timestamp: Date.now(),
        users: [currentList.id, List.id],
        service: {
          id: selectedService.value,
          value: selectedService.label,
          price: selectedService.price,
          priceType: selectedService.priceType,
        },
        type: "request",
        status: "pending",
        slot: selectedSlot,
        List: List?.id,
        quote: finalQuote ? finalQuote : 0,
        date: date,
      };
      addMessage(bookingMessage);
      openDrawer("chatDrawer", List);
      closeDrawer("listDrawer");
    }
  };

  // Get available slots for the selected date
  const getSlotsForDate = (date) => {
    if (!selectedService) return [];

    const dayName = date.toLocaleString("default", { weekday: "long" });
    const dateString = date.toISOString().split("T")[0];
    const dateOfMonth = date.getDate();

    // Check weekly availability
    const weeklyAvailability = selectedService.availability.find(
      (week) => week.day === dayName
    );
    if (weeklyAvailability) return weeklyAvailability.slots;

    // Check specific date availability
    const specificDateAvailability = selectedService.availability.find(
      (spec) => spec.date === dateString
    );
    if (specificDateAvailability) return specificDateAvailability.slots;

    return [];
  };

  const slotsForDate = getSlotsForDate(date);

  const customStyles = {
    control: (provided) => ({
      ...provided,
      borderColor: primaryColor,
      "&:hover": { borderColor: primaryColor },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? primaryColor
        : provided.backgroundColor,
      "&:hover": { backgroundColor: primaryColor, color: "white" },
      color: state.isDisabled ? "#ccc" : provided.color,
      cursor: state.isDisabled ? "not-allowed" : "default",
    }),
  };

  // Get all available dates for the selected service
  const getAvailableDates = () => {
    if (!selectedService) return new Set();

    const availableDates = new Set();

    // Add weekly availability
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    selectedService.availability.forEach((avail) => {
      const dayIndex = daysOfWeek.indexOf(avail.day);
      if (dayIndex !== -1) {
        const today = new Date();
        const year = today.getFullYear();

        // Iterate over the next 12 months
        for (let monthOffset = 0; monthOffset < 12; monthOffset++) {
          const monthDate = new Date(
            today.getFullYear(),
            today.getMonth() + monthOffset,
            1
          );
          const daysInMonth = new Date(
            monthDate.getFullYear(),
            monthDate.getMonth() + 1,
            0
          ).getDate();

          for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(
              monthDate.getFullYear(),
              monthDate.getMonth(),
              day
            );
            if (date.getDay() === dayIndex) {
              availableDates.add(date.toISOString().split("T")[0]);
            }
          }
        }
      } else if (avail.date) {
        availableDates.add(avail.date);
      }
    });

    return availableDates;
  };

  const availableDates = getAvailableDates();

  const tileDisabled = ({ date }) => {
    return !availableDates.has(date.toISOString().split("T")[0]);
  };

  return (
    <div className="py-4">
      <Select
        options={List.services}
        onChange={handleServiceChange}
        placeholder="Select a Service"
        styles={customStyles}
        className="mb-4"
      />
      <Calendar
        onChange={handleDateChange}
        value={date}
        className="mb-4 w-full"
        tileClassName="calendar-tile"
        tileDisabled={tileDisabled}
      />
      <div className="mb-4">
        <h3
          className="text-lg font-semibold mb-2"
          style={{ color: primaryColor }}
        >
          Available Slots
        </h3>
        {slotsForDate.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {slotsForDate.map((slot, index) => (
              <li
                key={index}
                onClick={() => handleSlotSelect(slot)}
                className={`px-4 py-2 border rounded cursor-pointer ${
                  selectedSlot === slot
                    ? `bg-primary text-white`
                    : `bg-white text-black border-primary`
                }`}
              >
                {`${slot.from} - ${slot.to}`}
                {selectedSlot === slot && (
                  <FaCheck className="inline ml-2 text-white" />
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No available slots for this date.</p>
        )}
      </div>
      {quote && (
        <div className="mb-4">
          <h3
            className="text-lg font-semibold mb-2"
            style={{ color: primaryColor }}
          >
            Select on Offer(Optional):
          </h3>
          <ul className="flex flex-wrap gap-2">
            {counterOffers.map((offer, index) => (
              <li
                key={index}
                onClick={() => handleCounterOfferSelect(offer)}
                className={`px-4 py-2 border rounded cursor-pointer ${
                  finalQuote === parseFloat(offer)
                    ? `bg-primary text-white`
                    : `bg-white text-black border-primary`
                }`}
              >
                ${offer}
              </li>
            ))}
          </ul>
        </div>
      )}
      <button
        onClick={handleBooking}
        disabled={!selectedSlot || !selectedService}
        className="w-full px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-300"
        // style={{ backgroundColor: primaryColor }}
      >
        Book Now
      </button>
    </div>
  );
};

export default AvailabilityCalendar;
