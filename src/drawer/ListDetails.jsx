import React, { useState, useContext,useRef } from "react";
import {
  FaUserCircle,
  FaMapMarkerAlt,
  FaCircle,
  FaCalendar,
  FaRegStar,
  FaStar,
  FaRocketchat,
} from "react-icons/fa";
import AvailabilityCalendar from "../components/AvailabilityCalendar";
import Drawer from "./Drawer";
import DrawerContext from "../context/DrawerContext";
import ChatContext from "../context/ChatContext"; // Import ChatContext for managing messages
import Socialicons from "../sharable/Socialicons";
import WorkHistory from "../sharable/WorkHistory";
import Rating from "../sharable/Rating";
import { useAuth } from "../context/AuthContext";

const ListDetailsDrawer = ({ list, isOpen, onClose }) => {
  console.log("list ", list);
  if (!isOpen) return null;
  const [showBooking, setShowBooking] = useState(false);
  const { openDrawer, closeDrawer } = useContext(DrawerContext);
  const { currentUser } = useAuth();
const galleryRef = useRef(null);

const scrollLeft = () => {
  galleryRef.current.scrollBy({ left: -200, behavior: "smooth" });
};

const scrollRight = () => {
  galleryRef.current.scrollBy({ left: 200, behavior: "smooth" });
};
  return (
    <Drawer
      title={list.categoryDetails?.name}
      isOpen={isOpen}
      onClose={onClose}
      width="2xl:w-2/3 xl:w-1/2 2xl:w-1/2 3xl:w-1/2 h-full lg:w-2/3 md:w-2/3 sm:w-full"
      showheader={false}
    >
      <div className="flex flex-col mb-16">
        <div className="relative">
          <button
            onClick={scrollLeft}
            className="absolute left-0 h-full px-4 bg-gray-700 text-white"
          >
            &#9664;
          </button>
          <div
            ref={galleryRef}
            className="overflow-x-auto whitespace-nowrap flex space-x-4 px-8"
          >
            {list?.sellImages.map((image, index) => (
              <img
                key={index}
                src={image}
                className="h-40 object-cover"
              />
            ))}
          </div>
          <button
            onClick={scrollRight}
            className="absolute right-0 h-full px-4 bg-gray-700 text-white"
          >
            &#9654;
          </button>
        </div>
        <div className="flex justify-evenly items-center py-4 border-b border-gray-200">
          <div>
            <img
              src={list.sellImages[0]}
              alt={list.categoryDetails?.name}
              className="w-16 h-16 rounded-full object-cover shadow-lg mr-4"
            />
            <Rating rating={list?.ratings ?? 0} />
          </div>
          <div>
            <div>
              <div className="flex flex-col justify-between items-center">
                <div className="flex items-center text-gray-600 mr-6">
                  <FaMapMarkerAlt className="mr-2" />
                  {list.location}
                </div>
                <p className="text-sm">{list?.distance} miles away</p>
              </div>

              <div className="flex pt-4 items-center">
                <FaCircle className="mr-2 text-green-600" />
                Available now
              </div>
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Description</h3>
            <p className="text-gray-600">{list?.sellDescription}</p>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Amenities</h3>
            <ul className="flex flex-wrap gap-2">
              {list?.amenities?.map((amenity, index) => (
                <li
                  key={index}
                  className="px-3 py-1 bg-white text-black border border-primary rounded-full text-sm font-semibold"
                >
                  {amenity.name}
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-4 flex gap-4">
            <button
              onClick={() => {
                setShowBooking(!showBooking);
              }}
              className="w-full px-6 py-2 bg-primary text-white rounded-md shadow-md items-center flex justify-center"
            >
              <FaCalendar className="mr-2" />
              <p>Request Viewing</p>
            </button>

            <button
              onClick={() => {
                closeDrawer("listDrawer");
                if (!currentUser) {
                  openDrawer("loginDrawer");
                  return;
                }
                openDrawer("chatDrawer", list);
              }}
              className="w-1/2 px-6 py-2 bg-gray-200 text-gray-700 rounded-md shadow-md"
            >
              <div className="flex items-center gap-4 justify-center">
                <FaRocketchat />
                <p>Message Me</p>
              </div>
            </button>
          </div>

          {showBooking && (
            <AvailabilityCalendar list={list} primaryColor="#5e60b9" />
          )}

          <div className="mb-4">
            <h3 className="text-lg font-semibold">Reviews</h3>
            {list?.reviews?.length == 0 ? (
              <p className="text-gray-600">No reviews available</p>
            ) : (
              list?.reviews?.map((review, index) => (
                <div key={index} className="mb-2">
                  <div className="flex justify-center items-center">
                    {Array.from({ length: 5 }).map((_, i) =>
                      i < review.rating ? (
                        <FaStar key={i} className="text-yellow-500" />
                      ) : (
                        <FaRegStar key={i} className="text-yellow-500" />
                      )
                    )}
                    <span className="ml-2 text-gray-600 text-xs">
                      ({review.rating})
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{review.comment}</p>
                  <p className="text-gray-500 text-xs">- {review.author}</p>
                </div>
              ))
            )}
          </div>
          {/* {list.workHistory.length == 0 ? (
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Work History</h3>
              <p className="text-gray-600">No work history available</p>
            </div>
          ) : (
            <WorkHistory workHistory={list.workHistory} />
          )} */}
          <Socialicons list={list} />
        </div>
      </div>
    </Drawer>
  );
};

export default ListDetailsDrawer;
