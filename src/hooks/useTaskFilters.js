import { useState, useMemo } from "react";

const useTaskFilters = (tasks) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    categories: [], // ['q1', 'q2', etc.]
    status: "all", // 'all', 'completed', 'pending'
  });

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Apply search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(search) ||
          (task.description && task.description.toLowerCase().includes(search))
      );
    }

    // Apply category filter
    if (filters.categories.length > 0) {
      result = result.filter((task) =>
        filters.categories.includes(task.category)
      );
    }

    // Apply status filter
    if (filters.status === "completed") {
      result = result.filter((task) => task.completed);
    } else if (filters.status === "pending") {
      result = result.filter((task) => !task.completed);
    }

    return result;
  }, [tasks, searchTerm, filters]);

  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilters({
      categories: [],
      status: "all",
    });
  };

  const hasActiveFilters =
    searchTerm.length > 0 ||
    filters.categories.length > 0 ||
    filters.status !== "all";

  return {
    searchTerm,
    filters,
    filteredTasks,
    handleSearchChange,
    handleFiltersChange,
    clearFilters,
    hasActiveFilters,
    resultsCount: filteredTasks.length,
    totalCount: tasks.length,
  };
};

export default useTaskFilters;
