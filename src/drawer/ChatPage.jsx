import React, { useContext, useState, useRef, useEffect } from "react";
import { FaPaperPlane, FaTasks } from "react-icons/fa";
import Drawer from "./Drawer"; // Import the reusable Drawer component
import ChatContext from "../context/ChatContext"; // Import ChatContext
import Quote from "../sharable/Quote";
import Message from "../cards/Message";
import { useSelector } from "react-redux";
import { getAllMessages } from "../services/firebaseService";
import Button from "../sharable/Button";

const ChatPage = ({ List, isOpen, onClose, user, thread }) => {
  const {
    messages,
    addMessage,
    setVisiblePopupMessages,
    showQuotePopup,
    setShowQuotePopup,
    setQuoteMessage,
    setMessages,
    quoteAlert,
    setQuoteAlert,
  } = useContext(ChatContext);
  const [input, setInput] = useState("");
  const [showNewMessageBubble, setShowNewMessageBubble] = useState(false);
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  const [type, setType] = useState("");
  const currentList = useSelector((state) => state.List.currentList);

  const handleSendMessage = () => {
    if (input.trim()) {
      const newMessage = {
        sender: {
          id: currentList.id,
          username: currentList.username,
          photoURL: currentList?.photoURL ?? null,
        },
        receiver: {
          id: List.id,
          username: List.username,
          photoURL: List?.photoURL ?? null,
        },
        message: input,
        timestamp: Date.now(),
        users: [currentList.id, List.id],
        type: "message",
      };
      addMessage(newMessage);
      setInput("");
    }
  };
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  useEffect(() => {
    const unsubscribe = getAllMessages(currentList?.id, List?.id, setMessages);
    return () => unsubscribe();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        messagesContainerRef.current;
      const isAtBottom = scrollHeight - scrollTop === clientHeight;
      setIsAutoScroll(isAtBottom);
      if (!isAtBottom) {
        setNewMessagesCount(messages.length - newMessagesCount);
      } else {
        setNewMessagesCount(0);
      }
      setShowNewMessageBubble(!isAtBottom && messages.length > 0);
    }
  };

  useEffect(() => {
    if (isAutoScroll) {
      scrollToBottom();
    } else {
      setNewMessagesCount(messages.length - newMessagesCount);
    }
  }, [messages]);
  const showModal = (message, type) => {
    setQuoteMessage(message);
    setShowQuotePopup(true);
    // setServiceName("");
    // setPrice("");
    // setDuration("");
    // setDate("");

    // setOpenModal(true);
    // setMessage(message);
    // setType(type);
  };

  return (
    <Drawer
      title={`${List?.username}`}
      subText={`Online` || `Last seen ${List.lastSeen}`}
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setVisiblePopupMessages([]);
      }}
      actionButton={
        currentList?.isList ? (
          <div className="mr-4">
            <Button
              callback={() => {
                setShowQuotePopup(true);
              }}
              text={"Submit a Quote"}
            />
          </div>
        ) : (
          <div className="mr-4">
            <Button
              callback={() => {
                onClose();
                setVisiblePopupMessages([]);
              }}
              text={"Request a Quote"}
            />
          </div>
        )
      }
    >
      <div className="flex flex-col h-full">
        <div
          className="flex-1 p-4 overflow-y-auto pb-20 mb-28"
          ref={messagesContainerRef}
          onScroll={handleScroll}
        >
          <div className="mb-4">
            {messages.map((message, index) => {
              if (
                message.List === currentList?.id &&
                message.type == "request"
              ) {
                return (
                  <Message
                    message={message}
                    List={List}
                    key={index}
                    rejectOffer={(message) => showModal(message, "reject")}
                    acceptOffer={(message) => showModal(message, "accept")}
                  />
                );
              } else {
                return <Message message={message} List={List} key={index} />;
              }
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <div className="flex items-center p-4 border-t border-gray-200 absolute bottom-0 w-full">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-2 border rounded-md"
            placeholder="Type a message or quote..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
          />
          <button
            onClick={handleSendMessage}
            className="mx-2 text-blue-500 hover:text-blue-700"
          >
            <FaPaperPlane />
          </button>
          <button
            onClick={() => setShowQuotePopup(true)}
            className="mx-2 text-green-500 hover:text-green-700"
          >
            <FaTasks />
          </button>
        </div>
        {showNewMessageBubble && (
          <button
            onClick={scrollToBottom}
            className="fixed bottom-16 right-4 p-2 bg-blue-500 text-white rounded-full shadow-lg"
          >
            You have {newMessagesCount} new messages
          </button>
        )}
      </div>

      {showQuotePopup && <Quote List={List} />}
      <AcceptRejectOffer
        isOpen={quoteAlert}
        type={type}
        setOpenModal={setQuoteAlert}
      />
    </Drawer>
  );
};

export default ChatPage;
const AcceptRejectOffer = ({ isOpen, setOpenModal }) => {
  if (isOpen === false) return null;
  const [rejectReason, setRejectReason] = useState("");
  const {
    handleWithdrawReject,
    quoteAlertType,
    setQuoteAlert,
    handleSendQuote,
    setPrice,
    setDate,
    quotemessage,
  } = useContext(ChatContext);
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-4 rounded-md shadow-md w-2/3 mx-10">
        <div className="flex justify-between items-center ">
          <h3 className="text-lg font-semibold mb-4">
            {quoteAlertType === "accept" ? "" : "Reject Offer"}
          </h3>
          <button onClick={() => setOpenModal(false)} className="text-red-500">
            Close
          </button>
        </div>
        {quoteAlertType === "reject" && (
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="flex-1 p-2 border rounded-md w-full mt-4"
            placeholder="message"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
          />
        )}
        {quoteAlertType === "accept" && (
          <p className="text-gray-500 mt-4">
            Are you sure you want to accept this offer?
          </p>
        )}
        <div className="flex justify-end mt-4">
          <div className="flex">
            <Button
              callback={() => {
                setQuoteAlert(false);
                if (quoteAlertType === "accept") {
                  console.log(quotemessage.quote);
                  setDate(quotemessage.date);
                  setPrice(quotemessage.quote);
                  handleSendQuote("accept");
                } else {
                  handleWithdrawReject(rejectReason);
                }
              }}
              text={quoteAlertType === "accept" ? "Yes" : "Submit"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
