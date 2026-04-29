import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isWithinInterval,
  subDays,
  startOfDay,
} from "date-fns";
import { es } from "date-fns/locale";
import useTasks from "../hooks/useTasks";
import "./DashboardPage.css";

const DashboardPage = () => {
  const { tasks, loading } = useTasks();

  // Calculate statistics
  const stats = useMemo(() => {
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
    const last7Days = Array.from({ length: 7 }, (_, i) =>
      subDays(today, 6 - i)
    );

    // Total tasks
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    const completionRate =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Tasks by category
    const byCategory = {
      q1: tasks.filter((t) => t.category === "q1").length,
      q2: tasks.filter((t) => t.category === "q2").length,
      q3: tasks.filter((t) => t.category === "q3").length,
      q4: tasks.filter((t) => t.category === "q4").length,
    };

    // This week's tasks
    const thisWeekTasks = tasks.filter((task) => {
      const taskDate = new Date(task.date);
      return isWithinInterval(taskDate, { start: weekStart, end: weekEnd });
    });

    const thisWeekCompleted = thisWeekTasks.filter((t) => t.completed).length;
    const thisWeekPending = thisWeekTasks.length - thisWeekCompleted;

    // Tasks per day (last 7 days)
    const tasksPerDay = last7Days.map((day) => {
      const dayStart = startOfDay(day);
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      const dayTasks = tasks.filter((task) => {
        const taskDate = new Date(task.date);
        return isWithinInterval(taskDate, { start: dayStart, end: dayEnd });
      });

      return {
        date: format(day, "EEE", { locale: es }),
        fullDate: format(day, "d MMM", { locale: es }),
        total: dayTasks.length,
        completadas: dayTasks.filter((t) => t.completed).length,
        pendientes: dayTasks.filter((t) => !t.completed).length,
      };
    });

    // Migrated tasks
    const migratedTasks = tasks.filter((t) => t.migratedFrom).length;

    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      completionRate,
      byCategory,
      thisWeekTasks: thisWeekTasks.length,
      thisWeekCompleted,
      thisWeekPending,
      tasksPerDay,
      migratedTasks,
    };
  }, [tasks]);

  // Chart data
  const categoryData = [
    {
      name: "Urgente e Importante",
      value: stats.byCategory.q1,
      color: "#ef4444",
    },
    {
      name: "No Urgente e Importante",
      value: stats.byCategory.q2,
      color: "#3b82f6",
    },
    {
      name: "Urgente y No Importante",
      value: stats.byCategory.q3,
      color: "#f59e0b",
    },
    {
      name: "No Urgente y No Importante",
      value: stats.byCategory.q4,
      color: "#6b7280",
    },
  ];

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p className="dashboard-subtitle">
          Analiza tu productividad y progreso
        </p>
      </div>

      {/* Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-card-primary">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalTasks}</div>
            <div className="stat-label">Total Tareas</div>
          </div>
        </div>

        <div className="stat-card stat-card-success">
          <div className="stat-icon">✓</div>
          <div className="stat-content">
            <div className="stat-value">{stats.completedTasks}</div>
            <div className="stat-label">Completadas</div>
          </div>
        </div>

        <div className="stat-card stat-card-warning">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <div className="stat-value">{stats.pendingTasks}</div>
            <div className="stat-label">Pendientes</div>
          </div>
        </div>

        <div className="stat-card stat-card-info">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <div className="stat-value">{stats.completionRate}%</div>
            <div className="stat-label">Tasa Completado</div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Tasks per day chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>📅 Tareas de los Últimos 7 Días</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.tasksPerDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="completadas" fill="#10b981" name="Completadas" />
              <Bar dataKey="pendientes" fill="#f59e0b" name="Pendientes" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category distribution */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>🎯 Distribución por Categoría</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  percent > 0 ? `${(percent * 100).toFixed(0)}%` : null
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="category-legend">
            {categoryData.map((cat, idx) => (
              <div key={idx} className="legend-item">
                <div
                  className="legend-color"
                  style={{ backgroundColor: cat.color }}
                ></div>
                <span>
                  {cat.name}: {cat.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Summary */}
      <div className="weekly-summary">
        <div className="summary-header">
          <h3>📆 Resumen de Esta Semana</h3>
        </div>
        <div className="summary-stats">
          <div className="summary-item">
            <div className="summary-icon">📝</div>
            <div>
              <div className="summary-value">{stats.thisWeekTasks}</div>
              <div className="summary-label">Tareas esta semana</div>
            </div>
          </div>
          <div className="summary-item">
            <div className="summary-icon">✅</div>
            <div>
              <div className="summary-value">{stats.thisWeekCompleted}</div>
              <div className="summary-label">Completadas</div>
            </div>
          </div>
          <div className="summary-item">
            <div className="summary-icon">⏰</div>
            <div>
              <div className="summary-value">{stats.thisWeekPending}</div>
              <div className="summary-label">Pendientes</div>
            </div>
          </div>
          {stats.migratedTasks > 0 && (
            <div className="summary-item">
              <div className="summary-icon">🔄</div>
              <div>
                <div className="summary-value">{stats.migratedTasks}</div>
                <div className="summary-label">Tareas migradas</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Insights */}
      <div className="insights-section">
        <h3>💡 Insights</h3>
        <div className="insights-grid">
          {stats.completionRate >= 70 && (
            <div className="insight-card insight-success">
              <div className="insight-icon">🎉</div>
              <div className="insight-text">
                ¡Excelente! Tu tasa de completado es del {stats.completionRate}%
              </div>
            </div>
          )}
          {stats.completionRate < 50 && stats.totalTasks > 0 && (
            <div className="insight-card insight-warning">
              <div className="insight-icon">💪</div>
              <div className="insight-text">
                Tienes muchas tareas pendientes. ¡Concéntrate en completar
                algunas hoy!
              </div>
            </div>
          )}
          {stats.byCategory.q1 > stats.totalTasks * 0.5 && (
            <div className="insight-card insight-alert">
              <div className="insight-icon">🔥</div>
              <div className="insight-text">
                Muchas tareas urgentes e importantes. Prioriza y delega lo
                posible.
              </div>
            </div>
          )}
          {stats.byCategory.q2 > stats.totalTasks * 0.4 && (
            <div className="insight-card insight-success">
              <div className="insight-icon">🎯</div>
              <div className="insight-text">
                ¡Bien hecho! Estás enfocándote en lo importante pero no urgente.
              </div>
            </div>
          )}
          {stats.migratedTasks > 5 && (
            <div className="insight-card insight-info">
              <div className="insight-icon">📌</div>
              <div className="insight-text">
                {stats.migratedTasks} tareas han sido migradas. Considera
                completarlas pronto.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
