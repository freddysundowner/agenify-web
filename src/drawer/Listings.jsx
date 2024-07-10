import React, { useState } from "react";
import Drawer from "./Drawer";
import TaskBoard from "./TaskBoard";
import ListingForm from "../components/MyListings/ListingForm";
const Listings = ({ isOpen = false, onClose = () => {} }) => {
  const [currentSection, setCurrentSection] = useState("account");

  const renderSection = () => {
    switch (currentSection) {
      case "Tasks":
        return <TaskBoard />;
      // Add more cases for other sections here if needed
      case "account":
        return <ListingForm />;
      default:
        return null;
    }
  };

  return (
    <Drawer
      title="Post a New Listing"
      isOpen={isOpen}
      onClose={onClose}
      width="w-2/3"
    >
      <div className="flex">
        <div className="w-full p-4">{renderSection()}</div>
      </div>
    </Drawer>
  );
};

export default Listings;
