import React, { useState } from "react";
import TaskList from "../components/MyListings/TaskList";
import Drawer from "./Drawer";

const TaskBoard = ({ isOpen = false, onClose = () => {} }) => {
  const [currentTab, setCurrentTab] = useState("active");

  const tasks = {
    active: [
      {
        title:
          "Increase confidence with TrustPilot reviews, Increase confidence with TrustPilot reviews",
        description: "Custom Task",
        tag: "Custom Task",
        tagColor: "gray",
        deliveryDays: 5,
        assignedTo: "James Terry",
        status: "Waiting Approval",
        statusColor: "blue",
        price: 10,
      },
      {
        title: "Increase conversion of your email mailchimp campaign",
        description: "Marketing & Sales",
        tag: "Marketing & Sales",
        tagColor: "red",
        deliveryDays: 2,
        assignedTo: "Bjorn Jönsson",
        status: "In Progress",
        statusColor: "blue",
        price: 12,
      },
    ],
    completed: [
      {
        title: "Get a complete store audit by our marketing expert",
        description: "Custom Task",
        tag: "Custom Task",
        tagColor: "gray",
        deliveryDays: 5,
        assignedTo: "Emily Tunberg",
        status: "Completed",
        statusColor: "green",
      },
    ],
    archived: [
      {
        title: "Be social - Sell your stock directly on Instagram",
        description: "Integrations",
        tag: "Integrations",
        tagColor: "blue",
        deliveryDays: 3,
        assignedTo: "Unassigned",
        status: "Archived",
        statusColor: "gray",
      },
    ],
    closed: [],
  };

  const renderTabContent = () => {
    switch (currentTab) {
      case "active":
        return <TaskList tasks={tasks.active} title="Current Tasks" />;
      case "completed":
        return <TaskList tasks={tasks.completed} title="Completed Tasks" />;
      case "archived":
        return <TaskList tasks={tasks.archived} title="Archived Tasks" />;
      case "closed":
        return <TaskList tasks={tasks.closed} title="Closed Tasks" />;
      default:
        return null;
    }
  };

  return (
    <Drawer
      title="My Tasks"
      isOpen={isOpen}
      onClose={onClose}
      subText="Manage tasks"
      width="w-2/3"
    >
      {" "}
      <div className="p-4">
        <div className="flex mb-4">
          <button
            onClick={() => setCurrentTab("active")}
            className={`text-lg font-semibold mr-10 ${
              currentTab === "active"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600"
            }`}
          >
            Active Tasks
          </button>
          <button
            onClick={() => setCurrentTab("completed")}
            className={`text-lg font-semibold mr-10 ${
              currentTab === "completed"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600"
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setCurrentTab("archived")}
            className={`text-lg font-semibold mr-10 ${
              currentTab === "archived"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600"
            }`}
          >
            Archived
          </button>
          <button
            onClick={() => setCurrentTab("closed")}
            className={`text-lg font-semibold mr-4 ${
              currentTab === "closed"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600"
            }`}
          >
            Closed
          </button>
        </div>
        {renderTabContent()}
      </div>
    </Drawer>
  );
};

export default TaskBoard;
