import React, { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import TaskItem from "../EisenhowerMatrix/TaskItem";
import MatrixQuadrant from "../EisenhowerMatrix/MatrixQuadrant";
import "./DayView.css";

const DayView = ({
  currentDate,
  tasks = [],
  onToggleComplete,
  onDeleteTask,
  onEditTask,
  onMoveTask,
}) => {
  const [draggedTask, setDraggedTask] = useState(null);

  // Filter tasks for current day
  const dayTasks = tasks.filter((task) => {
    const taskDate = new Date(task.date);
    return (
      taskDate.getDate() === currentDate.getDate() &&
      taskDate.getMonth() === currentDate.getMonth() &&
      taskDate.getFullYear() === currentDate.getFullYear()
    );
  });

  // Group tasks by quadrant
  const quadrants = {
    q1: dayTasks.filter((t) => t.category === "q1"),
    q2: dayTasks.filter((t) => t.category === "q2"),
    q3: dayTasks.filter((t) => t.category === "q3"),
    q4: dayTasks.filter((t) => t.category === "q4"),
  };

  const handleDragStart = (task) => {
    setDraggedTask(task);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
  };

  const handleDrop = async (quadrant) => {
    if (draggedTask && draggedTask.category !== quadrant && onMoveTask) {
      try {
        await onMoveTask(draggedTask.id, quadrant);
      } catch (error) {
        console.error("Error moving task:", error);
      }
    }
    setDraggedTask(null);
  };

  return (
    <div className="day-view">
      <div className="day-view-header">
        <div className="date-display">
          <div className="date-day">{format(currentDate, "d")}</div>
          <div className="date-info">
            <div className="date-weekday">
              {format(currentDate, "EEEE", { locale: es })}
            </div>
            <div className="date-month">
              {format(currentDate, "MMMM yyyy", { locale: es })}
            </div>
          </div>
        </div>

        <div className="task-summary">
          <div className="summary-item">
            <span className="summary-count">{dayTasks.length}</span>
            <span className="summary-label">Total tareas</span>
          </div>
          <div className="summary-item">
            <span className="summary-count">
              {dayTasks.filter((t) => t.completed).length}
            </span>
            <span className="summary-label">Completadas</span>
          </div>
          <div className="summary-item">
            <span className="summary-count">
              {dayTasks.filter((t) => !t.completed).length}
            </span>
            <span className="summary-label">Pendientes</span>
          </div>
        </div>
      </div>

      <div className="matrix-info">
        <div className="info-icon">💡</div>
        <p>
          Arrastra las tareas entre cuadrantes para reorganizar según urgencia e
          importancia
        </p>
      </div>

      <div className="eisenhower-matrix">
        <MatrixQuadrant
          quadrant="q1"
          title="Urgente e Importante"
          subtitle="Hacer ahora - Crisis y deadlines"
          icon="🔥"
          tasks={quadrants.q1}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDrop={handleDrop}
          onToggleComplete={onToggleComplete}
          onDelete={onDeleteTask}
          onEdit={onEditTask}
        />

        <MatrixQuadrant
          quadrant="q2"
          title="No Urgente e Importante"
          subtitle="Planificar - Estrategia y crecimiento"
          icon="🎯"
          tasks={quadrants.q2}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDrop={handleDrop}
          onToggleComplete={onToggleComplete}
          onDelete={onDeleteTask}
          onEdit={onEditTask}
        />

        <MatrixQuadrant
          quadrant="q3"
          title="Urgente y No Importante"
          subtitle="Delegar - Interrupciones"
          icon="📞"
          tasks={quadrants.q3}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDrop={handleDrop}
          onToggleComplete={onToggleComplete}
          onDelete={onDeleteTask}
          onEdit={onEditTask}
        />

        <MatrixQuadrant
          quadrant="q4"
          title="No Urgente y No Importante"
          subtitle="Eliminar - Distracciones"
          icon="📋"
          tasks={quadrants.q4}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDrop={handleDrop}
          onToggleComplete={onToggleComplete}
          onDelete={onDeleteTask}
          onEdit={onEditTask}
        />
      </div>
    </div>
  );
};

export default DayView;
