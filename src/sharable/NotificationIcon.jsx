import React, { useContext, useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import DrawerContext from "../context/DrawerContext";
import Menu from "../components/Menu";
import ChatContext from "../context/ChatContext";
import { useSelector } from "react-redux";
import { getInboxMessages, fetchUserFavorites, getSubscribedItems } from "../services/firebaseService";
import { useAuth } from "../context/AuthContext";
import { setFavorites, setSubscribedItems } from "../redux/features/userSlice";
import { useDispatch } from "react-redux";

const NotificationIcon = ({ }) => {
  const { inbox: inboxes, setInbox } = useContext(ChatContext);
  const { openDrawer } = useContext(DrawerContext);
  const [unreadCounts, setUnreadCounts] = useState(0);
  const user = useSelector((state) => state.user.currentUser);
  const { currentUser } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = getInboxMessages(currentUser, setInbox);
    return () => unsubscribe();
  }, [currentUser]);

  useEffect(() => {
    fetchUserFavorites(currentUser?.uid).then((res) => {
      dispatch(setFavorites(res));
    })


    getSubscribedItems(currentUser?.uid).then((subscribers) => {
      dispatch(setSubscribedItems(subscribers));
    });
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    setUnreadCounts(
      inboxes.reduce((acc, inbox) => {
        return inbox.unreadCounts?.[currentUser?.uid] || 0;
      }, 0)
    );
  }, [inboxes]);

  const handleRatingsClick = () => {
    openDrawer("inboxDrawer", user, inboxes);
  };

  return (
    <div
      className="relative bg-white border border-gray-300 rounded-full p-4 cursor-pointer h-[50px] mr-4"
      onClick={handleRatingsClick}
    >
      <FaBell color={unreadCounts > 0 ? "red" : "black"} />
      {unreadCounts > 0 && (
        <span className="absolute top-5 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
          {unreadCounts}
        </span>
      )}
    </div>
  );
};

export default NotificationIcon;
