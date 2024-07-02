// DrawerContext.js
import React, { createContext, useState, useCallback } from "react";

const DrawerContext = createContext();

export const DrawerProvider = ({ children }) => {
  const [drawerState, setDrawerState] = useState({
    searchDrawer: { isOpen: false, selectedList: null },
    listDrawer: { isOpen: false, selectedList: null },
    chatDrawer: { isOpen: false, selectedList: null, thread: null },
    loginDrawer: { isOpen: false, selectedList: null, type: "login" },
    inboxDrawer: { isOpen: false, selectedList: null, messages: [] },
    becomeProvider: { isOpen: false, selectedList: null },
  });

  const openDrawer = useCallback(
    (drawer, provider = null, messages = [], type = "login") => {
      setDrawerState((prevState) => ({
        ...prevState,
        [drawer]: { isOpen: true, selectedList: provider, messages, type },
      }));
    },
    []
  );

  const closeDrawer = useCallback((drawer) => {
    setDrawerState((prevState) => ({
      ...prevState,
      [drawer]: { isOpen: false, selectedList: null },
    }));
  }, []);

  return (
    <DrawerContext.Provider value={{ drawerState, openDrawer, closeDrawer }}>
      {children}
    </DrawerContext.Provider>
  );
};

export default DrawerContext;
