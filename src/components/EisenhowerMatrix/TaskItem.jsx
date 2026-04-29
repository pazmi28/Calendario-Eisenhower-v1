import React from "react";
import "./TaskItem.css";

const TaskItem = ({
  task,
  quadrant,
  onDragStart,
  onDragEnd,
  onToggleComplete,
  onDelete,
  onEdit,
}) => {
  const handleDragStart = (e) => {
    e.dataTransfer.effectAllowed = "move";
    onDragStart(task);
  };

  const handleToggle = () => {
    if (onToggleComplete) {
      onToggleComplete(task.id);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete && window.confirm("¿Eliminar esta tarea?")) {
      onDelete(task.id);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(task);
    }
  };

  return (
    <div
      className={`task-item quadrant-${quadrant} ${
        task.completed ? "completed" : ""
      }`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="task-content">
        <input
          type="checkbox"
          className="task-checkbox"
          checked={task.completed}
          onChange={handleToggle}
          onClick={(e) => e.stopPropagation()}
        />
        <div className="task-details">
          <div className="task-title">
            {task.isRecurring && (
              <span className="recurring-badge" title="Tarea recurrente">
                ♻️
              </span>
            )}
            {task.title}
          </div>
          {task.description && (
            <div className="task-description">{task.description}</div>
          )}
          {task.time && (
            <div className="task-time">
              <span className="time-icon">⏰</span>
              <span>{task.time}</span>
            </div>
          )}
        </div>
        <div className="task-actions">
          {onEdit && (
            <button
              className="task-edit"
              onClick={handleEdit}
              title="Editar tarea"
            >
              ✎
            </button>
          )}
          <button
            className="task-delete"
            onClick={handleDelete}
            title="Eliminar tarea"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
