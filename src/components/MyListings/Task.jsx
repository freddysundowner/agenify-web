import React from "react";
import { Draggable } from "react-beautiful-dnd";

const Task = ({ task, index }) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          className="p-4 bg-white rounded-md shadow-md"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <h4 className="text-md font-semibold">{task.title}</h4>
          <p className="text-sm text-gray-500">{task.description}</p>
        </div>
      )}
    </Draggable>
  );
};

export default Task;
