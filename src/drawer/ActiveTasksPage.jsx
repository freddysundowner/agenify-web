import React from "react";
import Drawer from "./Drawer"; // Import the reusable Drawer component

const ActiveTasksPage = ({ List, isOpen, onClose, activeTasks }) => {
  if (!isOpen) return null;

  return (
    <Drawer
      title={`Active Tasks for ${List.username}`}
      isOpen={isOpen}
      onClose={onClose}
      width="w-full md:w-1/2 lg:w-1/2 xl:w-1/2 2xl:w-1/2 3xl:w-1/2 h-full"
    >
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4">Active Tasks</h3>
        <ul>
          {activeTasks.map((task, index) => (
            <li
              key={index}
              className="mb-2 p-2 bg-gray-100 rounded-md shadow-md"
            >
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">{task.text}</p>
                  <p className="text-xs text-gray-600">{task.timestamp}</p>
                </div>
                <p className="text-green-500">Accepted</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Drawer>
  );
};

export default ActiveTasksPage;
