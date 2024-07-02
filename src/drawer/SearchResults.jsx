import React from "react";
import Drawer from "./Drawer"; // Import the reusable Drawer component
import ListCard from "../cards/ListCard"; // Import the ListCard component

const SearchResults = ({
  Lists,
  isOpen,
  onClose,
  setlistDrawerOpen,
  setselectedList,
}) => {
  return (
    <Drawer
      title="Search Results"
      isOpen={isOpen}
      onClose={onClose}
      width="w-full md:w-1/2 lg:w-1/2 xl:w-1/2 2xl:w-1/2 3xl:w-1/2 " // Adjust width for responsiveness
    >
      <div className="grid grid-cols-2  sm:grid-cols-1 gap-4 p-4 lg:grid-cols-2 md:grid-cols-1 2xl:grid-cols-2">
        {" "}
        {Lists && Lists.length > 0 ? (
          Lists.map((List) => (
            <div key={List.id} className="mb-4">
              <ListCard
                List={List}
                setselectedList={setselectedList}
                setlistDrawerOpen={setlistDrawerOpen}
              />
            </div>
          ))
        ) : (
          <p className="text-gray-600">No Lists found.</p>
        )}
      </div>
    </Drawer>
  );
};

export default SearchResults;
