import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format, startOfWeek, endOfWeek } from "date-fns";
import { es } from "date-fns/locale";
import CalendarHeader from "../components/Calendar/CalendarHeader";
import MonthView from "../components/Calendar/MonthView";
import DayView from "../components/Calendar/DayView";
import WeekView from "../components/Calendar/WeekView";
import AddTaskModal from "../components/Modals/AddTaskModal";
import Toast from "../components/Toast";
import SearchAndFilters from "../components/SearchAndFilters";
import useTasks from "../hooks/useTasks";
import useAutoMigration from "../hooks/useAutoMigration";
import useTaskFilters from "../hooks/useTaskFilters";
import "./CalendarPage.css";

const CalendarPage = () => {
  const { date: paramDate } = useParams();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month");
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showMigrationToast, setShowMigrationToast] = useState(false);
  const [showRecurringToast, setShowRecurringToast] = useState(false);

  // Use Firebase hook
  const {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    moveTaskToCategory,
  } = useTasks();

  // Auto-migration hook
  const migrationStatus = useAutoMigration();

  // Task filters hook
  const {
    searchTerm,
    filters,
    filteredTasks,
    handleSearchChange,
    handleFiltersChange,
    hasActiveFilters,
    resultsCount,
    totalCount,
  } = useTaskFilters(tasks);

  // Show toast when migration happens
  useEffect(() => {
    // Only show toast after checking is complete and migration actually happened
    if (
      !migrationStatus.isChecking &&
      migrationStatus.hasMigrated &&
      migrationStatus.count > 0
    ) {
      console.log(
        "🎉 Showing migration toast:",
        migrationStatus.count,
        "tasks"
      );
      setShowMigrationToast(true);
    }
  }, [
    migrationStatus.isChecking,
    migrationStatus.hasMigrated,
    migrationStatus.count,
  ]);

  useEffect(() => {
    if (paramDate) {
      setCurrentDate(new Date(paramDate));
      setView("day");
    }
  }, [paramDate]);

  const handleViewChange = (newView) => {
    setView(newView);
    if (newView === "day") {
      navigate(`/day/${format(currentDate, "yyyy-MM-dd")}`);
    } else {
      navigate("/");
    }
  };

  const handleDateChange = (direction) => {
    const newDate = new Date(currentDate);

    switch (view) {
      case "month":
        newDate.setMonth(currentDate.getMonth() + direction);
        break;
      case "week":
        newDate.setDate(currentDate.getDate() + direction * 7);
        break;
      case "day":
        newDate.setDate(currentDate.getDate() + direction);
        break;
      default:
        break;
    }

    setCurrentDate(newDate);

    if (view === "day") {
      navigate(`/day/${format(newDate, "yyyy-MM-dd")}`);
    }
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);

    if (view === "day") {
      navigate(`/day/${format(today, "yyyy-MM-dd")}`);
    }
  };

  const handleDayClick = (date) => {
    setCurrentDate(date);
    navigate(`/day/${format(date, "yyyy-MM-dd")}`);
  };

  const handleToggleComplete = async (taskId) => {
    try {
      const task = filteredTasks.find((t) => t.id === taskId);
      const wasRecurring = task && !task.completed && task.isRecurring;

      await toggleComplete(taskId);

      if (wasRecurring) {
        setShowRecurringToast(true);
        setTimeout(() => setShowRecurringToast(false), 5000);
      }
    } catch (error) {
      console.error("Error toggling task:", error);
      alert("Error al actualizar la tarea. Inténtalo de nuevo.");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("¿Eliminar esta tarea?")) return;

    try {
      await deleteTask(taskId);
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Error al eliminar la tarea. Inténtalo de nuevo.");
    }
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setShowAddTaskModal(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowAddTaskModal(true);
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        // Update existing task
        await updateTask(editingTask.id, taskData);
      } else {
        // Create new task
        await addTask(taskData);
      }
      setShowAddTaskModal(false);
      setEditingTask(null);
    } catch (error) {
      console.error("Error saving task:", error);
      throw error; // Let modal handle the error display
    }
  };

  const handleMoveTask = async (taskId, newCategory) => {
    try {
      await moveTaskToCategory(taskId, newCategory);
    } catch (error) {
      console.error("Error moving task:", error);
      alert("Error al mover la tarea. Inténtalo de nuevo.");
    }
  };

  const getDateTitle = () => {
    switch (view) {
      case "month":
        return format(currentDate, "MMMM yyyy", { locale: es });
      case "week":
        const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
        return `${format(weekStart, "d MMM", { locale: es })} - ${format(
          weekEnd,
          "d MMM yyyy",
          { locale: es }
        )}`;
      case "day":
        return format(currentDate, "d 'de' MMMM yyyy", { locale: es });
      default:
        return "";
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="calendar-page">
        <div className="calendar-loading">
          <div className="loading-spinner"></div>
          <p>Cargando tareas...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="calendar-page">
        <div className="calendar-error">
          <div className="error-icon">⚠️</div>
          <h3>Error al cargar tareas</h3>
          <p>{error}</p>
          <button
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="calendar-page">
      <CalendarHeader
        view={view}
        onViewChange={handleViewChange}
        dateTitle={getDateTitle()}
        onPrevious={() => handleDateChange(-1)}
        onNext={() => handleDateChange(1)}
        onToday={handleToday}
        onAddTask={handleAddTask}
      />

      <SearchAndFilters
        onSearchChange={handleSearchChange}
        onFiltersChange={handleFiltersChange}
        activeFilters={filters}
      />

      {hasActiveFilters && (
        <div className="filter-results-info">
          Mostrando {resultsCount} de {totalCount} tareas
        </div>
      )}

      <div className="calendar-content">
        {view === "month" && (
          <MonthView
            currentDate={currentDate}
            onDayClick={handleDayClick}
            tasks={filteredTasks}
          />
        )}

        {view === "week" && (
          <WeekView
            currentDate={currentDate}
            onDayClick={handleDayClick}
            tasks={filteredTasks}
          />
        )}

        {view === "day" && (
          <DayView
            currentDate={currentDate}
            tasks={filteredTasks}
            onToggleComplete={handleToggleComplete}
            onDeleteTask={handleDeleteTask}
            onEditTask={handleEditTask}
            onMoveTask={handleMoveTask}
          />
        )}
      </div>

      <AddTaskModal
        isOpen={showAddTaskModal}
        onClose={() => {
          setShowAddTaskModal(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        initialData={editingTask}
        defaultDate={currentDate}
        defaultCategory="q2"
      />

      {showMigrationToast && (
        <Toast
          message={`✨ ${migrationStatus.count} ${
            migrationStatus.count === 1
              ? "tarea pendiente migrada"
              : "tareas pendientes migradas"
          } a hoy`}
          type="info"
          duration={5000}
          onClose={() => setShowMigrationToast(false)}
        />
      )}

      {showRecurringToast && (
        <Toast
          message="✓ Tarea completada. ♻️ Nueva tarea creada para mañana"
          type="success"
          duration={5000}
          onClose={() => setShowRecurringToast(false)}
        />
      )}
    </div>
  );
};

export default CalendarPage;
