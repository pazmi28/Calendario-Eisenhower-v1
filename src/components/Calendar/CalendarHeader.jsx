import React from "react";
import "./CalendarHeader.css";

const CalendarHeader = ({
  view,
  onViewChange,
  dateTitle,
  onPrevious,
  onNext,
  onToday,
  onAddTask,
}) => {
  return (
    <div className="calendar-header">
      <div className="calendar-header-top">
        <div className="date-navigation">
          <button className="nav-btn" onClick={onPrevious} title="Anterior">
            ←
          </button>
          <button className="today-btn" onClick={onToday}>
            Hoy
          </button>
          <button className="nav-btn" onClick={onNext} title="Siguiente">
            →
          </button>
          <h2 className="date-title">{dateTitle}</h2>
        </div>

        <div className="header-actions">
          <div className="view-toggle">
            <button
              className={`view-btn ${view === "month" ? "active" : ""}`}
              onClick={() => onViewChange("month")}
            >
              Mes
            </button>
            <button
              className={`view-btn ${view === "week" ? "active" : ""}`}
              onClick={() => onViewChange("week")}
            >
              Semana
            </button>
            <button
              className={`view-btn ${view === "day" ? "active" : ""}`}
              onClick={() => onViewChange("day")}
            >
              Día
            </button>
          </div>

          <button className="add-task-btn" onClick={onAddTask}>
            <span className="add-icon">+</span>
            <span>Nueva Tarea</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;
