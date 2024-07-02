import React, { useContext } from "react";
import {
  FaWhatsapp,
  FaFacebook,
  FaLinkedin,
  FaEnvelope,
  FaStar,
  FaUserCircle,
  FaCircle,
  FaRegBell,
  FaRegStar,
} from "react-icons/fa";
import { MdVerified } from "react-icons/md";

import DrawerContext from "../context/DrawerContext";

const ListCard = ({ list }) => {
  const { openDrawer } = useContext(DrawerContext);
  const handleRatingsClick = () => {
    openDrawer("listDrawer", list);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md lg:w-full sm:w-full p-4 h-full"
      onClick={handleRatingsClick}
    >
      <div className="w-full h-full flex flex-col justify-center rounded-lg py-2 relative">
        <div className="roundded-lg bg-primary text-white absolute top-2 right-4 px-4 py-1 rounded-lg">
          <p>{list?.categoryDetails?.name}</p>
        </div>
        {/* <div className="roundded-lg bg-primary text-white absolute top-2 left-4 px-4 py-1 rounded-lg">
          <span>{list?.negotiable ? " Negotiable" : ""}</span>
        </div> */}
        <img
          src={list?.sellImages[0]}
          alt=""
          className="w-full rounded-md rounded-tr-md h-[80%] object-cover"
        />
        <div className="flex flex-row justify-between py-2">
          <div className="flex  flex-row">
            <h2 className="text-4xl font-bold">
              {list?.currency} {list?.sellPrice}
            </h2>
            {list?.sellPriceDeposit > 0 && (
              <span className="text-sm font-thin">
                Deposit: {list?.currency} {list?.sellPriceDeposit}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <FaRegStar className="text-4xl" />
            <FaRegBell className="text-4xl" />
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold">{list.sellAddress}</h3>
          <p className="text-sm font-thin">{list.distance} miles away</p>
          <span>{list?.subcategoryDetails?.name}</span>
        </div>
      </div>
    </div>
  );
};

export default ListCard;
