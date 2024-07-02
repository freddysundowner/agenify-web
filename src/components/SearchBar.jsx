import React, { useState, useContext, useEffect } from "react";
import { FaTimes, FaFilter } from "react-icons/fa";
import DrawerContext from "../context/DrawerContext";
import Slider from "rc-slider";
import { AiOutlineSearch } from "react-icons/ai";
import { FiNavigation, FiSliders, FiEdit3 } from "react-icons/fi";

import "rc-slider/assets/index.css";
import Switch from "../sharable/Switch";
import { useDispatch } from "react-redux";
import { useAuth } from "../context/AuthContext";
import { useSelector } from "react-redux";
import { updateListData } from "../services/firebaseService";

const SearchBar = ({ onResultsClick, skills, Lists }) => {
  const [query, setQuery] = useState("");
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 50]);
  const [distanceRange, setDistanceRange] = useState(100);
  const [service, setService] = useState("");
  const [isAvailable, setIsAvailable] = useState(false);
  const currentUser = useSelector((state) => state.user.currentUser);

  const { openDrawer } = useContext(DrawerContext);

  const handleSearch = () => {
    console.log(Lists);
    const filteredLists = Lists.filter((List) => {
      const matchesQuery =
        List.skill && List.skill.toLowerCase().includes(query.toLowerCase());
      return matchesQuery;
    });
    console.log(filteredLists);
    onResultsClick(filteredLists);
    openDrawer("searchDrawer", filteredLists);
  };
  const handleAdvancedSearch = () => {
    console.log(Lists);
    const filteredLists = Lists.filter((List) => {
      const matchesQuery =
        List.skill && List.skill.toLowerCase().includes(query.toLowerCase());
      const matchesPrice =
        (List.pricePerHour >= priceRange[0] &&
          List.pricePerHour <= priceRange[1]) ||
        (List.fixedPrice >= priceRange[0] && List.fixedPrice <= priceRange[1]);
      const matchesDistance = List.distance >= distanceRange;
      const matchesService = service
        ? List.skill && List.skill.toLowerCase().includes(service.toLowerCase())
        : true;
      return matchesQuery && matchesService && matchesDistance && matchesPrice;
      // return matchesQuery && matchesPrice && matchesDistance && matchesService;
    });
    console.log(filteredLists);
    onResultsClick(filteredLists);
    openDrawer("searchDrawer", filteredLists);
  };
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value) {
      const matchedSkills = skills.filter((skill) =>
        skill.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSkills(matchedSkills);
    } else {
      setFilteredSkills([]);
    }
  };

  const getSkillListCount = (skill) => {
    return Lists.filter(
      (List) => List.skill && List.skill.toLowerCase() === skill.toLowerCase()
    ).length;
  };

  const handleClear = () => {
    setQuery("");
    setFilteredSkills([]);
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  useEffect(() => {
    if (currentUser && currentUser) {
      setIsAvailable(currentUser.online);
    }
  }, [currentUser, currentUser]);

  const handleAvailabilityChange = async (checked) => {
    setIsAvailable(checked?.target?.checked);
    console.log(currentUser?.id);
    if (currentUser) {
      await updateListData(currentUser.id, {
        online: checked?.target?.checked,
      });
    }
  };
  return (
    <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-10 flex items-center space-x-2">
      <div className="flex items-center bg-white p-2 rounded-full shadow-lg">
        <button className="p-2">
          <AiOutlineSearch className="text-xl" />
        </button>
        <input
          type="text"
          placeholder="Search by address or MLS®#"
          className="px-4 py-2 w-96 rounded-full focus:outline-none"
        />
      </div>
      <button className="p-3 bg-white rounded-full shadow-lg">
        <FiNavigation className="text-2xl" />
      </button>
      <button className="p-3 bg-white rounded-full shadow-lg">
        <FiSliders className="text-2xl" />
      </button>
      <button className="p-3 bg-white rounded-full shadow-lg">
        <FiEdit3 className="text-2xl" />
      </button>
      {currentUser && currentUser?.isList && (
        <Switch checked={isAvailable} onChange={handleAvailabilityChange} />
      )}
    </div>
  );
  return (
    <div className="w-full flex flex-col items-center relative">
      <div className="w-1/2 flex items-center border rounded p-2 ">
        <input
          type="text"
          placeholder="Search for Lists..."
          value={query}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-grow px-8 py-3 text-lg outline-none border rounded-2xl  shadow-xl shadow-gray-350"
        />
        {query && (
          <p
            className="text-blue-500 cursor-pointer ml-2 "
            onClick={handleClear}
          >
            Clear
          </p>
        )}
        <FaFilter
          className="text-gray-500 cursor-pointer ml-2"
          onClick={toggleFilter}
        />
      </div>
      {filteredSkills.length > 0 && (
        <ul className="absolute top-full mt-2 w-1/2  bg-white border rounded-md shadow-lg z-10">
          {filteredSkills.map((skill, index) => (
            <li
              key={index}
              className="p-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => {
                setQuery(skill);
                setFilteredSkills([]);
                handleSearch();
              }}
            >
              {skill} ({getSkillListCount(skill)})
            </li>
          ))}
        </ul>
      )}
      {isFilterOpen && (
        <div className="absolute top-full mt-2 w-full max-w-xl bg-white border rounded shadow-lg z-10 p-4">
          <div className="mb-4">
            <label className="block text-gray-700">
              Price Range: ${priceRange[0]} - ${priceRange[1]}
            </label>
            <Slider range value={priceRange} onChange={setPriceRange} />
            {/* <Range
              min={0}
              max={500}
              step={10}
              value={priceRange}
              onChange={(value) => setPriceRange(value)}
            /> */}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">
              Distance Range: {distanceRange} miles
            </label>
            {/* <Range
              min={0}
              max={50}
              step={1}
              value={distanceRange}
              onChange={(value) => setDistanceRange(value)}
            /> */}
            <Slider
              value={distanceRange}
              onChange={(value) => setDistanceRange(value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Service</label>
            <input
              type="text"
              value={service}
              onChange={(e) => setService(e.target.value)}
              placeholder="e.g., plumbing"
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleAdvancedSearch}
              className="px-4 py-2 bg-primary text-white rounded"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
