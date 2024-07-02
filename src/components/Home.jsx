import React, { useState, useEffect, useContext } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { Provider, useSelector, useDispatch } from "react-redux";
import { store } from "../redux/store";
import SearchBar from "./SearchBar";
import FeaturedProviders from "./FeaturedLists";
import Menu from "./Menu";
import SearchResults from "../drawer/SearchResults";
import DrawerContext, { DrawerProvider } from "../context/DrawerContext";
import ListDetails from "../drawer/ListDetails";
import ChatPage from "../drawer/ChatPage";
import ChatContext, { ChatProvider } from "../context/ChatContext";
import NotificationIcon from "../sharable/NotificationIcon";
import Chats from "../drawer/Inboxes";
import MessageFeed from "../components/MessageFeed";
import SnackMessage from "../sharable/SnackMessage";
import { GlobalProvider } from "../context/GlobalContext";
import Switch from "../sharable/Switch";
import { AuthProvider, useAuth } from "../context/AuthContext";
import LoginSignupDrawer from "../drawer/LoginSignupDrawer";
const libraries = ["places"];
import { setUser, clearUser, setLists } from "../redux/features/userSlice";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../auth/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import ListFormDrawer from "../drawer/ListFormDrawer";
import NavBar from "./navbar";
import { getListings } from "../services/firebaseService";
import { LoadingProvider } from "../context/LoadingContext";
import ListDetailsDrawer from "../drawer/ListDetails";

const containerStyle = {
  width: "100vw",
  height: "100vh",
};

const useGeolocation = (defaultCenter, defaultZoom) => {
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [zoomLevel, setZoomLevel] = useState(defaultZoom);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          dispatch(
            setUser({
              ...userDoc.data(),
              id: user.uid,
              geopoint: {
                latitude: user?.geopoint?.latitude,
                longitude: user?.geopoint?.longitude,
              },
            })
          ); // Save user data in Redux
        }
      } else {
        dispatch(clearUser()); // Clear user data from Redux
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setZoomLevel(15);
        },
        (error) => {
          console.error("Error getting location: " + error.message);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  return { mapCenter, zoomLevel };
};

const Home = () => {
  const dispatch = useDispatch();
  const { drawerState, openDrawer, closeDrawer } = useContext(DrawerContext);
  const {
    messages,
    addMessage,
    unreadCount,
    visiblePopupMessages,
    showAlert,
    setMessages,
  } = useContext(ChatContext);

  const currentUser = useSelector((state) => state.user.currentUser);
  const [feedMessages, setFeedMessages] = useState([]);
  useEffect(() => {
    getListings(currentUser).then((data) => {
      const serializedData = data.map((list) => ({
        ...list,
        position: {
          latitude: list.position.latitude,
          longitude: list.position.longitude,
        },
      }));

      // Dispatch the action with serialized data
      dispatch(setLists(serializedData));
      // dispatch(setLists(data));
    });
  }, [currentUser]);

  const { mapCenter, zoomLevel } = useGeolocation(
    { lat: -3.745, lng: -38.523 },
    10
  );

  const handleNewMessage = (msg) => {
    setFeedMessages((prevMessages) => [...prevMessages, msg]);
    addMessage(msg);
  };

  const handleResultsClick = (filteredProviders) => {
    openDrawer("searchDrawer", filteredProviders);
  };
  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={libraries}
    >
      <div className="flex flex-row  bg-[#ededed]">
        <NavBar />
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={zoomLevel}
          options={{
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
          }}
        >
          {/* <MapOverlay
              providers={providers}
              skills={skills}
              messages={messages}
              unreadCount={unreadCount}
            /> */}

          {/* <Markers providers={providers} /> */}
          <SearchBar
            skills={[]}
            onResultsClick={handleResultsClick}
            providers={[]}
          />
        </GoogleMap>
        <div className="w-[43%] mt-24 scrollable-featured-providers  bg-[#ededed]">
          <FeaturedProviders />
        </div>
      </div>
      {drawerState.searchDrawer.isOpen && (
        <SearchResults
          providers={drawerState.searchDrawer.selectedList}
          isOpen={drawerState.searchDrawer.isOpen}
          onClose={() => closeDrawer("searchDrawer")}
        />
      )}

      {drawerState.chatDrawer.isOpen && (
        <ChatPage
          provider={drawerState.chatDrawer.selectedList}
          isOpen={drawerState.chatDrawer.isOpen}
          onClose={() => closeDrawer("chatDrawer")}
          messages={messages}
          addMessage={handleNewMessage}
        />
      )}
      {drawerState.loginDrawer.isOpen && (
        <LoginSignupDrawer
          provider={drawerState.loginDrawer.selectedList}
          isOpen={drawerState.loginDrawer.isOpen}
          type={drawerState.loginDrawer.type}
          onClose={() => closeDrawer("loginDrawer")}
        />
      )}

      {drawerState.inboxDrawer.isOpen && (
        <Chats
          isOpen={drawerState.inboxDrawer.isOpen}
          onClose={() => closeDrawer("inboxDrawer")}
          provider={drawerState.inboxDrawer.selectedList}
        />
      )}
      {showAlert.show && <SnackMessage message={showAlert.message} />}
      {visiblePopupMessages.length > 0 && !drawerState.chatDrawer.isOpen && (
        <MessageFeed />
      )}
      {drawerState.listDrawer.isOpen && (
        <ListDetailsDrawer
          list={drawerState.listDrawer.selectedList}
          onClose={() => closeDrawer("listDrawer")}
          isOpen={drawerState.listDrawer.isOpen}
        />
      )}
      {drawerState.becomeProvider.isOpen && (
        <ListFormDrawer
          provider={drawerState.becomeProvider.selectedList}
          isOpen={drawerState.becomeProvider.isOpen}
          onClose={() => closeDrawer("becomeProvider")}
        />
      )}
    </LoadScript>
  );
};

const MapOverlay = ({
  providers,
  skills,
  onResultsClick,
  messages,
  unreadCount,
}) => {
  const [isAvailable, setIsAvailable] = useState(false);
  const { drawerState, openDrawer, closeDrawer } = useContext(DrawerContext);
  const currentUser = useSelector((state) => state.user.currentUser);

  const handleBecomeProvider = async () => {
    openDrawer("becomeProvider", currentUser);
  };

  return (
    <div className="">
      <div className="absolute right-4 top-4 shadow-black shadow-2xl rounded-full ">
        <div className="flex gap-4">
          {currentUser ? (
            <>
              {currentUser?.isProvider ? (
                <Switch
                  checked={isAvailable}
                  onChange={handleAvailabilityChange}
                />
              ) : (
                <button
                  onClick={handleBecomeProvider}
                  className="bg-primary text-white px-4 py-2 rounded"
                >
                  Become a Provider
                </button>
              )}
              <Menu provider={providers[0]} />
              <NotificationIcon
                messages={messages}
                unreadCount={unreadCount}
                provider={providers[0]}
              />
            </>
          ) : (
            <>
              <nav className="bg-primary p-4 rounded-2xl">
                <ul className="flex space-x-4 text-white">
                  <li>
                    <a
                      onClick={() => openDrawer("loginDrawer")}
                      className="hover:text-gray-300 cursor-pointer"
                    >
                      Login
                    </a>
                  </li>
                  <li className="border-l border-gray-400 pl-4">
                    <a
                      onClick={() => openDrawer("loginDrawer")}
                      className="hover:text-gray-300 cursor-pointer"
                    >
                      Signup
                    </a>
                  </li>
                </ul>
              </nav>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const Markers = ({ providers }) => (
  <>
    {providers.map((provider) => (
      <Marker
        key={provider.id}
        position={{ lat: provider.latitude, lng: provider.longitude }}
        onClick={() => handleMarkerClick(provider)}
      />
    ))}
  </>
);

const HomeWithProvider = () => (
  <AuthProvider>
    <LoadingProvider>
      <Provider store={store}>
        <GlobalProvider>
          <DrawerProvider>
            <ChatProvider>
              <Home />
            </ChatProvider>
          </DrawerProvider>
        </GlobalProvider>
      </Provider>
    </LoadingProvider>
  </AuthProvider>
);

export default HomeWithProvider;
