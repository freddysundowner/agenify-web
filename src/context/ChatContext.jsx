import React, { createContext, useState, useEffect } from "react";
import {
  addMessageToFirestore,
  updateMessageInFirestore,
} from "../services/firebaseService";
import { useLoading } from "./LoadingContext";
import { useSelector } from "react-redux";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [visiblePopupMessages, setVisiblePopupMessages] = useState([]);
  const [durationUnit, setDurationUnit] = useState("hours");
  const [showQuotePopup, setShowQuotePopup] = useState(false);
  const [quoteAlert, setQuoteAlert] = useState(false);
  const [quoteAlertType, setQuoteAlertType] = useState("");
  const { showLoading, hideLoading } = useLoading();
  const [quotemessage, setQuoteMessage] = useState({});
  const [showAlert, setShowAlert] = useState({
    show: false,
    message: "All fields are require",
    error: true,
  });
  const [price, setPrice] = useState("");
  const [serviceName, setServiceName] = useState(null);
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("");
  const [messages, setMessages] = useState([]);
  const [inbox, setInbox] = useState([]);
  const currentUser = useSelector(
    (state) => state.user.currentUser
  );

  const addMessage = async (message) => {
    await addMessageToFirestore(message);
  };

  const handleSendQuote = async (type) => {
    console.log(price, date);
    if (price <= 0) {
      setShowAlert({
        show: true,
        message: "Please enter a valid price",
        error: true,
      });
      return;
    }
    if (date.trim() === "") {
      setShowAlert({
        show: true,
        message: "Please enter a valid date",
        error: true,
      });
      return;
    }
    if (quotemessage?.service?.value?.trim() && price.trim() && date.trim()) {
      showLoading(true);
      const message = {
        sender: {
          id: currentUser.id,
          username: currentUser.username,
          photoURL: currentUser?.photoURL ?? null,
        },
        receiver: quotemessage?.sender,
        timestamp: Date.now(),
        users: [currentUser.id, quotemessage?.sender.id],
        type: "message",
      };
      if (type === "update") {
        await updateMessageInFirestore(quotemessage.threadId, quotemessage.id, {
          status: "updated",
          message: `Hi ${
            quotemessage?.sender?.username
          }, Quotation for ${quotemessage?.service?.value?.trim()} on ${date} from ${
            quotemessage?.slot?.from
          } to ${quotemessage?.slot?.to} has been updated.`,
        });
        await addMessage({
          ...message,
          message: "Quotation Updated",
        });
      } else if (type === "withthdraw") {
        await updateMessageInFirestore(quotemessage.threadId, quotemessage.id, {
          status: "withdrawn",
          message: `Hi ${
            quotemessage?.sender?.username
          }, Quotation for ${quotemessage?.service?.value?.trim()} on ${date} from ${
            quotemessage?.slot?.from
          } to ${quotemessage?.slot?.to} has been withdrawn.`,
        });
        await addMessage({
          ...message,
          message: "Quotation Updated",
        });
      } else if (type === "accept") {
        await updateMessageInFirestore(quotemessage.threadId, quotemessage.id, {
          status: "accepted",
          message: `Hi ${
            quotemessage?.sender?.username
          }, Quotation for ${quotemessage?.service?.value?.trim()} on ${date} from ${
            quotemessage?.slot?.from
          } to ${quotemessage?.slot?.to} has been accepted.`,
        });
        await addMessage({
          ...message,
          message: "Quotation Updated",
        });
      } else if (type === "reject") {
        await updateMessageInFirestore(quotemessage.threadId, quotemessage.id, {
          status: "rejected",
          message: `Hi ${
            quotemessage?.sender?.username
          }, Quotation for ${quotemessage?.service?.value?.trim()} on ${date} from ${
            quotemessage?.slot?.from
          } to ${quotemessage?.slot?.to} has been declined.`,
        });
        await addMessage({
          ...message,
          message: "Quotation Updated",
        });
      } else {
        await updateMessageInFirestore(quotemessage.threadId, quotemessage.id, {
          status: "accepted",
        });
      }
      setShowQuotePopup(false);
      hideLoading(true);
    } else {
      setShowAlert({
        show: true,
        message: "All fields are required",
        error: true,
      });
    }
  };

  // Inside handleRejectBooking function
  const handleWithdrawReject = async (reason) => {
    if (reason.trim() === "") {
      setShowAlert({
        show: true,
        message: "Please enter a reason for rejection",
        error: true,
      });
      return;
    }
    showLoading(true);
    await updateMessageInFirestore(quotemessage.threadId, quotemessage.id, {
      status: "rejected",
      message: reason,
    });

    const message = {
      sender: {
        id: currentUser.id,
        username: currentUser.username,
        photoURL: currentUser?.photoURL ?? null,
      },
      receiver: quotemessage?.sender,
      timestamp: Date.now(),
      users: [currentUser.id, quotemessage?.sender.id],
      type: "message",
    };
    await addMessage({
      ...message,
      message: "Quotation Rejected",
    });
    setShowQuotePopup(false);
    hideLoading(true);
  };

  useEffect(() => {
    if (messages.length) {
      const newMessage = messages[messages.length - 1];
      if (!newMessage.read) {
        setVisiblePopupMessages((prevMessages) => {
          if (
            prevMessages.some(
              (msg) =>
                msg.text === newMessage.text &&
                msg.sender === newMessage.sender &&
                msg.timestamp === newMessage.timestamp
            )
          ) {
            return prevMessages;
          }
          const updatedMessages = [...prevMessages, newMessage];
          return updatedMessages.length > 5
            ? updatedMessages.slice(-5)
            : updatedMessages;
        });
        const timer = setTimeout(() => {
          setVisiblePopupMessages((prevMessages) =>
            prevMessages.filter((msg) => msg !== newMessage)
          );
        }, 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [messages]);

  const markAsRead = (sender) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.sender === sender ? { ...msg, read: true } : msg
      )
    );
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        addMessage,
        markAsRead,
        setVisiblePopupMessages,
        visiblePopupMessages,
        handleSendQuote,
        showQuotePopup,
        setShowQuotePopup,
        setPrice,
        setServiceName,
        setDate,
        setDuration,
        price,
        serviceName,
        duration,
        setDurationUnit,
        durationUnit,
        showAlert,
        setShowAlert,
        setMessages,
        inbox,
        setInbox,
        quotemessage,
        setQuoteMessage,
        quoteAlert,
        setQuoteAlert,
        quoteAlertType,
        setQuoteAlertType,
        handleWithdrawReject,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;
