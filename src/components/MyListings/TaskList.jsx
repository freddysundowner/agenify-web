import React from "react";
import {
  FiUser,
  FiCalendar,
  FiMoreHorizontal,
  FiMessageCircle,
  FiFileText,
} from "react-icons/fi";

const TaskList = ({ tasks, title }) => {
  return (
    <div className="mb-6">
      {tasks.map((task, index) => (
        <div
          key={index}
          className="flex justify-between items-center bg-white p-4 mb-2 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center space-x-4 w-1/3">
            <div className="relative">
              <FiFileText className="text-gray-400 text-2xl" />
              <span
                className={`absolute bottom-0 right-0 bg-${task.statusColor}-500 rounded-full h-3 w-3`}
              />
            </div>
            <div className="w-full">
              <p className="text-sm font-bold text-gray-800">{task.title}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span
                  className={`bg-${task.tagColor}-100 text-${task.tagColor}-700 text-xs font-medium mr-2 px-2.5 py-0.5 rounded`}
                >
                  {task.tag}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4 w-1/2 justify-between">
            <div className="text-right relative group">
              <p className="text-md font-bold text-gray-800">
                ${task.price}{" "}
                <span className="text-gray-600 text-sm">
                  ({task.credits} credit{task.credits > 1 ? "s" : ""})
                </span>
              </p>
              <p className="text-sm text-gray-500">
                Delivery:{" "}
                <span className="font-medium text-gray-700">
                  within {task.deliveryDays} days
                </span>
              </p>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-blue-900 text-white p-3 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center">
                  <span className="bg-blue-500 rounded-full h-2 w-2 mr-2"></span>
                  <p className="text-xs">
                    <span className="font-semibold">Started date:</span>{" "}
                    {task.startedDate}
                  </p>
                </div>
                <div className="flex items-center mt-1">
                  <span className="bg-white rounded-full h-2 w-2 mr-2"></span>
                  <p className="text-xs">
                    <span className="font-semibold">Estimated delivery:</span>{" "}
                    {task.estimatedDelivery}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-600 text-sm">Assigned to</p>
              <div className="flex items-center">
                <p className="text-gray-800 font-medium ml-2 text-sm">
                  {task.assignedTo}
                </p>
              </div>
            </div>
            <button
              className={`border border-${task.statusColor}-500 text-${task.statusColor}-700 px-3 py-1 rounded-full shadow-sm hover:bg-${task.statusColor}-200 transition-colors duration-200 flex items-center`}
            >
              <span
                className={`bg-${task.statusColor}-500 rounded-full h-2 w-2 mr-2`}
              ></span>
              {task.status}
            </button>
            <FiMessageCircle
              className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors duration-200"
              size={25}
              color="red"
            />
            <FiMoreHorizontal className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors duration-200" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
