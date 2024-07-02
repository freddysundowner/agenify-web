import { useContext, useEffect, useState } from "react";
import ChatContext from "../context/ChatContext";
import Select from "react-select";
import { FaTimes, FaCheck } from "react-icons/fa";
import Loading from "./loading";
import Button from "./Button";
import { useSelector } from "react-redux";
import { TimePicker } from "antd";
import moment from "moment"; // Import moment for handling time

const Quote = ({ List, primaryColor = "#5e60b9" }) => {
  const {
    setPrice,
    setServiceName,
    setDate,
    price,
    serviceName,
    duration,
    setDuration,
    date,
    handleSendQuote,
    setDurationUnit,
    quotemessage,
    setShowQuotePopup,
    setQuoteMessage,
    showQuotePopup,
    loading,
  } = useContext(ChatContext);

  const currentList = useSelector((state) => state.List.currentList);
  const handleServiceChange = (selectedOption) => {
    // setSelectedService(selectedOption);
    // setDate(new Date());
    // setSelectedSlot(null);
    // setQuote(null);
    // setFinalQuote(null);
    setQuoteMessage({
      service: selectedOption,
    });
  };
  useEffect(() => {
    setPrice(quotemessage?.quote);
    setServiceName(quotemessage?.service);
    setDuration(quotemessage?.duration);
    setDurationUnit(quotemessage?.durationUnit);
  }, [quotemessage]);
  useEffect(() => {
    setQuoteMessage({
      List: currentList?.isList == true ? currentList?.id : List?.id,
    });
  }, []);
  console.log(quotemessage);
  const handleDateFormat = (date) => {
    const dateObj = new Date(date);
    // const year = newDate.getFullYear();
    // const month = newDate.getMonth() + 1;
    // const day = newDate.getDate();
    // console.log(`${day}-${month}-${year}`);

    const day = dateObj.getDate().toString().padStart(2, "0");
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-indexed
    const year = dateObj.getFullYear();

    // Format the date as dd/mm/yyyy
    const formattedDate = `${day}/${month}/${year}`;
    // console.log(`${day}-${month}-${year}`);

    return formattedDate;
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
  // console.log(quotemessage);

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
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-md shadow-md w-full mx-10">
        <div className="flex justify-between items-center ">
          <h3 className="text-lg font-semibold mb-4">Quote Details</h3>
          <button
            onClick={() => setShowQuotePopup(!showQuotePopup)}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>
        <h4>Service</h4>
        {quotemessage?.id ? (
          <div className=" w-1/2 text-center self-center px-3 mb-4 py-1 text-white bg-primary  border border-primary rounded-full text-sm font-semibold">
            {quotemessage?.service?.value}
          </div>
        ) : (
          <Select
            options={currentList.services}
            onChange={handleServiceChange}
            placeholder="Select a Service"
            styles={customStyles}
            className="mb-4"
          />
        )}

        <h4>Time Slot</h4>
        {quotemessage.service?.availability?.map((currentAvailability, index) =>
          currentAvailability?.slots.map((slot, slotIndex) => (
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
                onClick={() => {
                  currentAvailability?.slots.splice(slotIndex, 1);
                }}
              >
                Remove
              </button>
            </div>
          ))
        )}

        {quotemessage?.slot && (
          <div className=" w-1/2 text-center self-center px-3 mb-4 py-1 text-white bg-primary  border border-primary rounded-full text-sm font-semibold">
            {`${quotemessage?.slot.from} - ${quotemessage?.slot.to}`}
            {quotemessage?.slot.from && (
              <FaCheck className="inline ml-2 text-white" />
            )}
          </div>
        )}
        <div className="w-full flex mb-4 justify-between">
          <div className="relative mr-4 flex flex-1 ">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-2 pl-8 border rounded-md"
              placeholder="Enter price"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            callback={() => {
              if (quotemessage?.type == "quote") {
                handleSendQuote("update");
              } else {
                handleSendQuote();
              }
            }}
            loading={loading}
            text={quotemessage?.type == "quote" ? "Update Quote" : "Send Quote"}
          />
        </div>
      </div>
    </div>
  );
};
export default Quote;
