import React, { useContext, useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import DrawerContext from "../context/DrawerContext";
import Menu from "../components/Menu";
import ChatContext from "../context/ChatContext";
import { useSelector } from "react-redux";
import { getInboxMessages } from "../services/firebaseService";
import { useAuth } from "../context/AuthContext";

const NotificationIcon = ({}) => {
  const { inbox: inboxes, setInbox } = useContext(ChatContext);
  const { openDrawer } = useContext(DrawerContext);
  const [unreadCounts, setUnreadCounts] = useState(0);
  const List = useSelector((state) => state.List.currentList);
  const { currentUser } = useAuth();

  useEffect(() => {
    const unsubscribe = getInboxMessages(currentUser, setInbox);
    return () => unsubscribe();
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
    openDrawer("inboxDrawer", List, inboxes);
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
