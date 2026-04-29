import React from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
  isSameDay,
} from "date-fns";
import { es } from "date-fns/locale";
import "./MonthView.css";

const MonthView = ({ currentDate, onDayClick, tasks = [] }) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

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

  return (
    <div className="month-view">
      <div className="calendar-grid">
        {/* Day headers */}
        {["L", "M", "X", "J", "V", "S", "D"].map((day, index) => (
          <div key={`header-${index}`} className="day-header">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {days.map((day, index) => {
          const dayTasks = getTasksForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isCurrentDay = isToday(day);

          return (
            <div
              key={index}
              className={`day-cell ${!isCurrentMonth ? "other-month" : ""} ${
                isCurrentDay ? "today" : ""
              }`}
              onClick={() => onDayClick(day)}
            >
              <div className="day-number">{format(day, "d")}</div>
              <div className="day-tasks">
                {dayTasks.slice(0, 3).map((task, taskIndex) => (
                  <div
                    key={taskIndex}
                    className={`task-indicator ${getCategoryColor(
                      task.category
                    )}`}
                    title={task.title}
                  >
                    {task.title}
                  </div>
                ))}
                {dayTasks.length > 3 && (
                  <div className="more-tasks">+{dayTasks.length - 3} más</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthView;
