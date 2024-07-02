import { useContext, useState } from "react";
import { FaCheck, FaEye, FaTimesCircle } from "react-icons/fa";
import { timeAgo } from "../utils/timeAgo";
import jsPDF from "jspdf";
import Modal from "react-modal";
import "jspdf-autotable";
import { useSelector } from "react-redux";
import ChatContext from "../context/ChatContext";
import { generateQuoteMsgs } from "../utils/msgs";
import Button from "../sharable/Button";
const Message = ({ message, List, acceptOffer, rejectOffer }) => {
  const currentList = useSelector((state) => state.List.currentList);
  const {
    setShowQuotePopup,
    setQuoteMessage,
    handleSendQuote,
    setQuoteAlert,
    quoteAlertType,
    setQuoteAlertType,
  } = useContext(ChatContext);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [pdfData, setPdfData] = useState(null);
  const generatePDF = () => {
    const newQuote = message;
    const doc = new jsPDF();

    // Add title and other details
    doc.setFontSize(18);
    doc.text("Quotation", 105, 20, null, null, "center");

    doc.setFontSize(12);
    doc.text(`Date: ${newQuote.date}`, 14, 40);
    doc.text(`From: ${newQuote?.slot?.from}`, 14, 50);
    doc.text(`To: ${newQuote?.slot?.to}`, 14, 60);

    // Add quotation details in a table
    const quoteData = [
      ["Description", "Value"],
      ["Service", newQuote.service.value],
      ["Price", `$${newQuote.quote}`],
    ];

    doc.autoTable({
      startY: 70,
      head: [quoteData[0]],
      body: quoteData.slice(1),
      styles: { fontSize: 10, halign: "center", valign: "middle" },
      theme: "striped",
    });

    // Add message
    doc.text("Message:", 14, doc.autoTable.previous.finalY + 20);
    doc.text(
      "Thank you for showing interest in our service.",
      14,
      doc.autoTable.previous.finalY + 30,
      { maxWidth: 180 }
    );

    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    setPdfData(pdfUrl);
    setModalIsOpen(true);
  };
  return (
    <div
      className={`flex ${
        message.sender?.id === List.id ? "justify-end" : "justify-start"
      }`}
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
        <iframe src={pdfData} width="100%" height="600px" />
        <button
          onClick={() => setModalIsOpen(false)}
          className="btn btn-secondary"
        >
          Close
        </button>
      </Modal>
      <div
        className={`p-2 my-2 rounded-md ${
          message.type === "request"
            ? "bg-yellow-300 text-black"
            : message.type == "info"
            ? "bg-red-300"
            : message.sender?.id === List.id
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-black"
        }`}
      >
        <p>{generateQuoteMsgs(message, currentList?.id)}</p>

        {message.type === "quote" && message.status === "pending" ? (
          <div className="flex mt-2 gap-4">
            <button
              onClick={() => {
                generatePDF();
              }}
              className="px-4 py-2 bg-black text-white rounded-md"
            >
              <div className="flex gap-2 items-center">
                <FaEye />
                <p>View Quotation</p>
              </div>
            </button>
            {message.List !== currentList.id && (
              <button
                onClick={() => {
                  setQuoteMessage(message);
                  setQuoteAlert(true);
                  setQuoteAlertType("accept");
                }}
                className="px-4 py-2 bg-green-500 text-white rounded-md"
              >
                <div className="flex gap-2 items-center">
                  <FaCheck />
                  <p>Accept</p>
                </div>
              </button>
            )}
            {message.List !== currentList.id && (
              <Button
                callback={() => {
                  setQuoteMessage({ ...message, rejectBy: currentList.id });
                  setQuoteAlert(true);
                  setQuoteAlertType("reject");
                }}
                text="Reject"
                background="bg-red-500"
                icon={<FaTimesCircle />}
              />
            )}
            {message.List === currentList.id && (
              <Button
                callback={() => {
                  setQuoteMessage(message);
                  setQuoteAlert(true);
                  setQuoteAlertType("reject");
                }}
                text="Withdraw"
                background="bg-red-500"
                icon={<FaTimesCircle />}
              />
            )}
            {message.List === currentList.id && (
              <button
                onClick={() => {
                  setQuoteMessage(message);
                  setShowQuotePopup(true);
                }}
                className="px-4 py-2 bg-green-500 text-white rounded-md"
              >
                <div className="flex gap-2 items-center">
                  <FaCheck />
                  <p>Edit Quote</p>
                </div>
              </button>
            )}
          </div>
        ) : (
          ""
        )}
        <span className="text-xs text-gray-600">
          {timeAgo(message.timestamp)}
        </span>
        {message.type === "request" &&
          message.status === "pending" &&
          message.List === currentList.id && (
            <div className="flex mt-2">
              <button
                onClick={() => {
                  setQuoteMessage(message);
                  setShowQuotePopup(true);
                }}
                className="px-4 py-2 bg-green-500 text-white rounded-md mr-4"
              >
                <div className="flex gap-2 items-center">
                  <FaCheck />
                  <p>Send Quote</p>
                </div>
              </button>

              <button
                onClick={() => {
                  setQuoteMessage({ ...message, rejectBy: currentList.id });
                  setQuoteAlert(true);
                  setQuoteAlertType("reject");
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-md"
              >
                <div className="flex gap-2 items-center">
                  <FaTimesCircle />
                  <p>Reject</p>
                </div>
              </button>
            </div>
          )}
      </div>
    </div>
  );
};
export default Message;
