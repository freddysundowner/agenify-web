import React, { useState, useContext, useRef } from "react";
import {
  FaUserCircle,
  FaMapMarkerAlt,
  FaCircle,
  FaCalendar,
  FaRegStar,
  FaStar,
  FaRocketchat,
  FaRegBell,
  FaEye,
  FaShare, FaShareAlt
} from "react-icons/fa";
import Modal from "react-modal";
import AvailabilityCalendar from "../components/AvailabilityCalendar";
import Drawer from "./Drawer";
import DrawerContext from "../context/DrawerContext";
import ChatContext from "../context/ChatContext"; // Import ChatContext for managing messages
import Socialicons from "../sharable/Socialicons";
import WorkHistory from "../sharable/WorkHistory";
import Rating from "../sharable/Rating";
import { useAuth } from "../context/AuthContext";
import ImageSlider from "../components/imageSlider";

const ListDetailsDrawer = ({ list, isOpen, onClose }) => {
  console.log("list ", list);
  if (!isOpen) return null;
  const [showBooking, setShowBooking] = useState(false);
  const { openDrawer, closeDrawer } = useContext(DrawerContext);
  const { currentUser } = useAuth();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  return (
    <Drawer
      title={list.categoryDetails?.name}
      isOpen={isOpen}
      onClose={onClose}
      width="w-full"
      showheader={false}
    >
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={{
          overlay: { zIndex: 1000 },
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
          },
        }}
      >
        <h2>Phone: {list?.sellContact}</h2>
        <button
          onClick={() => setModalIsOpen(false)}
          className="btn btn-secondary"
        >
          Close
        </button>
      </Modal>
      <div className="flex flex-col mb-16">

        <div className=" text-black py-1mb-6 px-8">
          <h2 className="text-2xl capitalize border-b-2 mb-4 font-bold">{list?.categoryDetails?.name}</h2>
        </div>
        <ImageSlider images={list?.sellImages.length > 0 ? list?.sellImages : []} />
        <div className="px-6">
          <div className="flex justify-between  py-6  border-b border-gray-200">
            <div>
              <h2 className="text-4xl font-bold">
                {list?.currency} {list?.sellPrice}
              </h2>
              {list?.sellPriceDeposit > 0 && (
                <span className="text-sm font-thin">
                  Deposit: {list?.currency} {list?.sellPriceDeposit}
                </span>
              )}
              <p className="text-gray-600">{list?.sellAddress}</p>
              <div className=" bg-white text-primary px-4 py-1 rounded-lg border-primary border">
                <p>{list?.subcategoryDetails?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FaShareAlt className="text-4xl" />
              <FaRegStar className="text-4xl" />
              <FaRegBell className="text-4xl" />
            </div>
          </div>
          <p className="text-sm py-4">{list?.distance} miles away</p>
          <div className="py-4">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Description</h3>
              <p className="text-gray-600">{list?.sellDescription ? list?.sellDescription : "N/A"}</p>
            </div>
            {list?.sellAmenities.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Amenities</h3>
                <ul className="flex flex-wrap gap-2">
                  {list?.sellAmenities?.map((amenity, index) => (
                    <li
                      key={index}
                      className="px-3 py-1 bg-white text-black border border-primary rounded-full text-sm font-semibold"
                    >
                      {amenity}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mb-4 flex gap-4">
              <button
                onClick={() => {
                  setModalIsOpen(!modalIsOpen)
                }}
                className="w-full px-6 py-2 bg-primary text-white rounded-md shadow-md items-center flex justify-center"
              >
                <FaEye className="mr-2" />
                <p>Show Contacts</p>
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



            <div className="mb-4">
              <h3 className="text-lg font-semibold">Reviews</h3>
              {list?.reviews?.length == 0 || !list?.reviews ? (
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
      </div>
    </Drawer>
  );
};

export default ListDetailsDrawer;
