import React, { createContext, useState, useContext } from "react";
import Modal from "../sharable/Modal"; // Adjust the import path according to your project structure

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [modalContent, setModalContent] = useState(null);
  const [modalId, setModalId] = useState(null);

  const openModal = (content, id) => {
    setModalContent(content);
    setModalId(id || Date.now());
  };

  const closeModal = () => {
    setModalContent(null);
    setModalId(null);
  };

  return (
    <GlobalContext.Provider
      value={{
        modalContent,
        openModal,
        closeModal,
        modalId,
      }}
    >
      {children}
      {modalContent && (
        <Modal key={modalId} onClose={closeModal}>
          {modalContent}
        </Modal>
      )}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);

export default GlobalContext;
