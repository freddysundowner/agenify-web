import { FaStar, FaUserCircle } from "react-icons/fa";
import { AiOutlineHome, AiOutlineStar } from "react-icons/ai";
import { FiMapPin } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useContext } from "react";
import DrawerContext from "../context/DrawerContext";
import Menu from "./Menu";
import { useSelector } from "react-redux";
const NavBar = () => {
  const { currentUser } = useAuth();
  const { openDrawer } = useContext(DrawerContext);

  return (
    <nav className="position-fixed z-50 bg-white shadow-md fixed top-0 left-0 w-full flex items-center justify-between px-4 py-2 rounded-bl-3xl">
      <div className="flex w-[70%] m-auto justify-between">
        <div className="flex items-center">
          <FiMapPin className=" text-5xl text-purple-500" />
          <div>
            <span className=" text-2xl font-hero font-bold">PlugMe</span>
            <p className="font-hero text-sm">Helping you find your next gig</p>
          </div>
        </div>
        <div className="flex items-center space-x-8">
          <a
            href="/"
            className="flex items-center space-x-2 hover:text-purple-500"
          >
            <AiOutlineHome className="text-xl" />
            <span>Home</span>
          </a>
          <a
            href="/browse"
            className="flex items-center space-x-2 hover:text-purple-500"
          >
            <FiMapPin className="text-xl" />
            <span className="text-purple-500">Browse</span>
          </a>
          <a
            href="/browse"
            className="flex items-center  hover:text-purple-500"
          >
            <FaStar color="orange" size={24} />
          </a>

          {!currentUser ? (
            <a
              onClick={() => openDrawer("loginDrawer")}
              className="text-gray-700 hover:text-purple-500 cursor-pointer"
            >
              Sign up / Sign in
            </a>
          ) : (
            <Menu />
          )}
        </div>
      </div>
    </nav>
  );
};
export default NavBar;
