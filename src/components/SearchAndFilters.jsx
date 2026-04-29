import React, { useState } from "react";
import "./SearchAndFilters.css";

const SearchAndFilters = ({
  onSearchChange,
  onFiltersChange,
  activeFilters,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearchChange(value);
  };

  const handleCategoryFilter = (category) => {
    const newCategories = activeFilters.categories.includes(category)
      ? activeFilters.categories.filter((c) => c !== category)
      : [...activeFilters.categories, category];

    onFiltersChange({
      ...activeFilters,
      categories: newCategories,
    });
  };

  const handleStatusFilter = (status) => {
    onFiltersChange({
      ...activeFilters,
      status: activeFilters.status === status ? "all" : status,
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    onSearchChange("");
    onFiltersChange({
      categories: [],
      status: "all",
    });
  };

  const hasActiveFilters =
    searchTerm.length > 0 ||
    activeFilters.categories.length > 0 ||
    activeFilters.status !== "all";

  const categories = [
    { id: "q1", name: "Urgente e Importante", icon: "🔥", color: "#ef4444" },
    { id: "q2", name: "No Urgente e Importante", icon: "🎯", color: "#3b82f6" },
    { id: "q3", name: "Urgente y No Importante", icon: "📞", color: "#f59e0b" },
    {
      id: "q4",
      name: "No Urgente y No Importante",
      icon: "📋",
      color: "#6b7280",
    },
  ];

  return (
    <div className="search-and-filters">
      <div className="search-bar-container">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Buscar tareas..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchTerm && (
            <button
              className="clear-search-btn"
              onClick={() => {
                setSearchTerm("");
                onSearchChange("");
              }}
            >
              ✕
            </button>
          )}
        </div>

        <button
          className={`filters-toggle-btn ${showFilters ? "active" : ""}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <span className="filter-icon">⚙️</span>
          <span>Filtros</span>
          {hasActiveFilters && <span className="filter-badge"></span>}
        </button>

        {hasActiveFilters && (
          <button className="clear-all-btn" onClick={clearFilters}>
            Limpiar todo
          </button>
        )}
      </div>

      {showFilters && (
        <div className="filters-panel">
          {/* Category Filters */}
          <div className="filter-group">
            <div className="filter-group-title">Categorías</div>
            <div className="filter-options">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`filter-chip ${
                    activeFilters.categories.includes(cat.id) ? "active" : ""
                  }`}
                  onClick={() => handleCategoryFilter(cat.id)}
                  style={{
                    borderColor: activeFilters.categories.includes(cat.id)
                      ? cat.color
                      : undefined,
                  }}
                >
                  <span className="filter-chip-icon">{cat.icon}</span>
                  <span className="filter-chip-text">{cat.name}</span>
                  {activeFilters.categories.includes(cat.id) && (
                    <span className="filter-chip-check">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Status Filters */}
          <div className="filter-group">
            <div className="filter-group-title">Estado</div>
            <div className="filter-options">
              <button
                className={`filter-chip ${
                  activeFilters.status === "all" ? "active" : ""
                }`}
                onClick={() => handleStatusFilter("all")}
              >
                <span className="filter-chip-text">Todas</span>
              </button>
              <button
                className={`filter-chip ${
                  activeFilters.status === "completed" ? "active" : ""
                }`}
                onClick={() => handleStatusFilter("completed")}
              >
                <span className="filter-chip-icon">✓</span>
                <span className="filter-chip-text">Completadas</span>
              </button>
              <button
                className={`filter-chip ${
                  activeFilters.status === "pending" ? "active" : ""
                }`}
                onClick={() => handleStatusFilter("pending")}
              >
                <span className="filter-chip-icon">⏳</span>
                <span className="filter-chip-text">Pendientes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="active-filters-summary">
          <span className="summary-label">Filtros activos:</span>
          {searchTerm && (
            <span className="active-filter-tag">Búsqueda: "{searchTerm}"</span>
          )}
          {activeFilters.categories.map((catId) => {
            const cat = categories.find((c) => c.id === catId);
            return (
              <span key={catId} className="active-filter-tag">
                {cat.icon} {cat.name}
              </span>
            );
          })}
          {activeFilters.status !== "all" && (
            <span className="active-filter-tag">
              {activeFilters.status === "completed"
                ? "✓ Completadas"
                : "⏳ Pendientes"}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchAndFilters;
