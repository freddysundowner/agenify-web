import React, { useContext, useEffect, useState } from "react";
import {
  FaRegBell,
  FaRegStar,
  FaStar,
} from "react-icons/fa";

import DrawerContext from "../context/DrawerContext";
import { addtoFavorite, getSubscribedItems, itemSubscribe } from "../services/firebaseService";
import { useSelector } from "react-redux";
import ChatContext from "../context/ChatContext";
import { setFavorites, setSubscribedItems } from "../redux/features/userSlice";
import { useDispatch } from "react-redux";

const ListCard = ({ list }) => {
  const { openDrawer } = useContext(DrawerContext);
  const [loading, setLoading] = useState(false);
  const [inFavorites, setInFavorites] = useState(false);
  const { setShowAlert } = useContext(ChatContext); // Use ChatContext

  const currentUser = useSelector((state) => state.user.currentUser);
  const favorites = useSelector((state) => state.user.favorites);
  const subscribedItems = useSelector((state) => state.user.subscribedItems);
  const dispatch = useDispatch();
  const [subscribers, setSubscribers] = useState([]);
  const handleRatingsClick = () => {
    openDrawer("listDrawer", list);
  };

  useEffect(() => {
    console.log(subscribedItems);
    setSubscribers(subscribedItems?.find((item) => item.id === list?.id));
  }, [subscribedItems])

  const handleNotificationClick = async () => {
    setLoading(true);
      await itemSubscribe(list?.id, { id: currentUser?.id });
    if (subscribers) { 
      //remove item from user subscribed items
      dispatch(setSubscribedItems(subscribedItems.filter(item => item.id !== currentUser?.id)));
    } else {
      dispatch(setSubscribedItems({ ...subscribedItems, id: currentUser?.id }));
    }
    
    setLoading(false);
    setShowAlert({
      show: true,
      error: false,
      message: "Subscribed to this listing",
    });
  };

  useEffect(() => {
    setInFavorites(favorites?.find(element => element.id === list?.id));
  }, [favorites])

  const handleFavoritesClick = async () => {
    setLoading(true);
    await addtoFavorite(currentUser?.id, { id: list?.id });
    setLoading(false);
    setShowAlert({
      show: true,
      error: false,
      message: "Added to favorites",
    });
  };
  return (
    <div
      className="bg-white rounded-lg shadow-md lg:w-full sm:w-full p-4 h-full"
    >{loading && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
          <span className="visually-hidden"></span>
        </div>
      </div>
    )}
      <div className="w-full h-full flex flex-col justify-center rounded-lg py-2 relative">
        <div className="roundded-lg bg-primary text-white absolute top-2 right-4 px-4 py-1 rounded-lg">
          <p>{list?.categoryDetails?.name}</p>
        </div>
        {
          list?.sellImages.length > 0 ? <img onClick={handleRatingsClick}
            src={list?.sellImages[0]}
            alt=""
            className="w-full rounded-md rounded-tr-md h-[80%] object-cover"
          /> : <img onClick={handleRatingsClick}
            src='/no-img.png'
            alt=""
            className="w-full rounded-md rounded-tr-md h-[80%] object-cover"
          />
        }
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
            <FaStar color={inFavorites ? "orange" : "black"} className="text-4xl cursor-pointer" onClick={handleFavoritesClick} />
            <FaRegBell color={subscribers ? "red" : "black"} className="text-4xl cursor-pointer" onClick={handleNotificationClick} />
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
