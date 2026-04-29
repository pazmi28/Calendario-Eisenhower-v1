import React from "react";
import TaskItem from "./TaskItem";
import "./MatrixQuadrant.css";

const MatrixQuadrant = ({
  quadrant,
  title,
  subtitle,
  icon,
  tasks,
  onDragStart,
  onDragEnd,
  onDrop,
  onToggleComplete,
  onDelete,
  onEdit,
}) => {
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    onDrop(quadrant);
  };

  return (
    <div
      className={`matrix-quadrant quadrant-${quadrant}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="quadrant-header">
        <div className="quadrant-icon">{icon}</div>
        <div className="quadrant-title">
          <h3>{title}</h3>
          <div className="quadrant-subtitle">{subtitle}</div>
        </div>
        <div className="quadrant-count">{tasks.length}</div>
      </div>

      <div className="quadrant-tasks">
        {tasks.length === 0 ? (
          <div className="empty-quadrant">
            <p>No hay tareas en este cuadrante</p>
            <p className="empty-hint">Arrastra tareas aquí o crea una nueva</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              quadrant={quadrant}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onToggleComplete={onToggleComplete}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default MatrixQuadrant;
