import React, { useContext, useEffect, useState } from "react";
import ChatContext from "../context/ChatContext"; // Import ChatContext
import Drawer from "./Drawer";
import { timeAgo } from "../utils/timeAgo";
import DrawerContext from "../context/DrawerContext";
import { useAuth } from "../context/AuthContext";
import { getUnreadCount } from "../services/firebaseService";

const Inboxes = ({ isOpen, onClose, List }) => {
  const { inbox: inboxes } = useContext(ChatContext);
  const { currentUser } = useAuth();
  return (
    <Drawer title="Inbox" isOpen={isOpen} onClose={onClose}>
      <div className="p-4">
        {inboxes.map((inbox) => {
          return (
            <InboxCard
              List={List}
              key={inbox?.timestamp}
              inbox={inbox}
              currentUser={currentUser}
            />
          );
        })}
      </div>
    </Drawer>
  );
};

export default Inboxes;

const InboxCard = ({ inbox, currentUser, List }) => {
  const { openDrawer, closeDrawer } = useContext(DrawerContext);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    getUnreadCount(inbox?.id, currentUser?.uid).then((count) => {
      setUnreadCount(count);
    });
  }, [inbox]);

  return (
    <div
      key={inbox?.timestamp}
      className="flex items-center p-2 border-b"
      onClick={() => {
        closeDrawer("inboxDrawer");
        let p = null;
        if (inbox?.sender?.id === List?.id) {
          p = inbox?.receiver;
        } else {
          p = inbox?.sender;
        }
        console.log(inbox?.id);
        openDrawer("chatDrawer", p, inbox?.id);
      }}
    >
      <div className="flex-1">
        <p className="font-bold">{inbox?.sender?.username}</p>
        <p>{inbox.message}</p>
        <span className="text-xs text-gray-600">
          {timeAgo(inbox.timestamp)}
        </span>
      </div>
      {unreadCount > 0 && (
        <div className="ml-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
          {unreadCount}
        </div>
      )}
    </div>
  );
};
