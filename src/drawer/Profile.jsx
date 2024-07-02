import React, { useState } from "react";
import Drawer from "./Drawer";
import ContactInfo from "../components/profile/ContactInfo";
import ProfileSettings from "../components/profile/ProfileSettings";
import PayoutMethods from "../components/profile/PayoutMethods";
import ChangePassword from "../components/profile/ChangePassword";

const Profile = ({ isOpen = false, onClose = () => {} }) => {
  const [currentSection, setCurrentSection] = useState("Profile Info");

  const renderSection = () => {
    switch (currentSection) {
      case "Profile Info":
        return <ContactInfo />;
      case "List Settings":
        return <ProfileSettings />;
      case "Payout Methods":
        return <PayoutMethods />;
      case "Change Password":
        return <ChangePassword />;
      default:
        return null;
    }
  };

  return (
    <Drawer
      title="Profile"
      isOpen={isOpen}
      onClose={onClose}
      width="w-2/3"
      subText="Edit your profile information"
    >
      <div className="flex">
        <nav className="w-1/4">
          <ul className="list-none p-0">
            <li
              className={`p-2 cursor-pointer ${
                currentSection === "Profile Info" ? "bg-green-100" : ""
              }`}
              onClick={() => setCurrentSection("Profile Info")}
            >
              Profile Info
            </li>
            <li
              className={`p-2 cursor-pointer ${
                currentSection === "List Settings" ? "bg-green-100" : ""
              }`}
              onClick={() => setCurrentSection("List Settings")}
            >
              List Settings
            </li>
            <li
              className={`p-2 cursor-pointer ${
                currentSection === "Payout Methods" ? "bg-green-100" : ""
              }`}
              onClick={() => setCurrentSection("Payout Methods")}
            >
              Payout Methods
            </li>
            <li
              className={`p-2 cursor-pointer ${
                currentSection === "Change Password" ? "bg-green-100" : ""
              }`}
              onClick={() => setCurrentSection("Change Password")}
            >
              Change Password
            </li>
          </ul>
        </nav>
        <div className="w-3/4 p-4">{renderSection()}</div>
      </div>
    </Drawer>
  );
};

export default Profile;
