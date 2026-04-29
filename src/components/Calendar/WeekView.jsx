import React from "react";
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isToday,
  isSameDay,
} from "date-fns";
import { es } from "date-fns/locale";
import "./WeekView.css";

const WeekView = ({ currentDate, onDayClick, tasks = [] }) => {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 }); // Sunday
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const getTasksForDay = (day) => {
    return tasks.filter((task) => isSameDay(new Date(task.date), day));
  };

  const getCategoryColor = (category) => {
    const colors = {
      q1: "task-urgent-important",
      q2: "task-not-urgent-important",
      q3: "task-urgent-not-important",
      q4: "task-not-urgent-not-important",
    };
    return colors[category] || "task-not-urgent-not-important";
  };

  const getCategoryIcon = (category) => {
    const icons = {
      q1: "🔥",
      q2: "🎯",
      q3: "📞",
      q4: "📋",
    };
    return icons[category] || "📋";
  };

  return (
    <div className="week-view">
      <div className="week-grid">
        {weekDays.map((day, index) => {
          const dayTasks = getTasksForDay(day);
          const isCurrentDay = isToday(day);

          return (
            <div
              key={index}
              className={`week-day-column ${isCurrentDay ? "today" : ""}`}
              onClick={() => onDayClick(day)}
            >
              {/* Day Header */}
              <div className="week-day-header">
                <div className="week-day-name">
                  {format(day, "EEE", { locale: es })}
                </div>
                <div className="week-day-number">{format(day, "d")}</div>
                <div className="week-task-count">
                  {dayTasks.length > 0 && (
                    <span className="task-badge">{dayTasks.length}</span>
                  )}
                </div>
              </div>

              {/* Tasks List */}
              <div className="week-day-tasks">
                {dayTasks.length === 0 ? (
                  <div className="week-empty-day">
                    <span className="empty-icon">📭</span>
                    <span className="empty-text">Sin tareas</span>
                  </div>
                ) : (
                  dayTasks.slice(0, 10).map((task) => (
                    <div
                      key={task.id}
                      className={`week-task-item ${getCategoryColor(
                        task.category
                      )} ${task.completed ? "completed" : ""}`}
                      title={task.title}
                    >
                      <div className="week-task-icon">
                        {getCategoryIcon(task.category)}
                      </div>
                      <div className="week-task-content">
                        <div className="week-task-title">
                          {task.completed && (
                            <span className="check-mark">✓ </span>
                          )}
                          {task.title}
                        </div>
                        {task.time && (
                          <div className="week-task-time">⏰ {task.time}</div>
                        )}
                      </div>
                    </div>
                  ))
                )}
                {dayTasks.length > 10 && (
                  <div className="week-more-tasks">
                    +{dayTasks.length - 10} más
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="week-legend">
        <div className="legend-title">Categorías:</div>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-icon">🔥</span>
            <span className="legend-text">Urgente e Importante</span>
          </div>
          <div className="legend-item">
            <span className="legend-icon">🎯</span>
            <span className="legend-text">No Urgente e Importante</span>
          </div>
          <div className="legend-item">
            <span className="legend-icon">📞</span>
            <span className="legend-text">Urgente y No Importante</span>
          </div>
          <div className="legend-item">
            <span className="legend-icon">📋</span>
            <span className="legend-text">No Urgente y No Importante</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeekView;
