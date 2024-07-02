// FeaturedLists.js
import React from "react";
import ListCard from "../cards/ListCard"; // Import the ListCard component
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useSelector } from "react-redux";
const FeaturedLists = () => {
  const lists = useSelector((state) => state.user.Lists);
  return (
    <div className="flex flex-col gap-4 m-4">
      {lists.length == 0 ? (
        <h2 className="text-center text-xl font-bold">No getListings found.</h2>
      ) : (
        lists?.map((list, i) => (
          <div key={i} className="md:w-full h-[550px]">
            <ListCard list={list} />
          </div>
        ))
      )}
    </div>
  );
};

export default FeaturedLists;
