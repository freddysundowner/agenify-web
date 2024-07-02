import React from "react";
import { Droppable } from "react-beautiful-dnd";
import Task from "./Task";

const Column = ({ column, tasks }) => {
  return (
    <div className="flex flex-col bg-gray-50 rounded-lg shadow-md p-4 w-80">
      <h3 className="text-xl font-bold text-gray-700 mb-4">{column.title}</h3>
      <Droppable droppableId={column.id}>
        {(provided) => (
          <div
            className="flex flex-col space-y-4"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {tasks.map((task, index) => (
              <Task key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;
