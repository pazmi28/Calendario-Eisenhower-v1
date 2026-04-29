import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { format, startOfDay, endOfDay } from "date-fns";

const useTasks = (dateFilter = null) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    const userId = auth.currentUser.uid;
    const tasksRef = collection(db, "users", userId, "tasks");

    // Simplified query without composite index (temporarily)
    let q;
    if (dateFilter) {
      const startDate = Timestamp.fromDate(startOfDay(dateFilter));
      const endDate = Timestamp.fromDate(endOfDay(dateFilter));
      q = query(
        tasksRef,
        where("date", ">=", startDate),
        where("date", "<=", endDate)
      );
    } else {
      // Simple query with single orderBy
      q = query(tasksRef, orderBy("createdAt", "desc"));
    }

    // Real-time listener
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const tasksData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date?.toDate() || new Date(),
        }));

        // Sort in memory instead of in query
        tasksData.sort((a, b) => {
          // First by date
          const dateCompare = a.date.getTime() - b.date.getTime();
          if (dateCompare !== 0) return dateCompare;
          // Then by createdAt descending
          return (
            (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0)
          );
        });

        setTasks(tasksData);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching tasks:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [dateFilter]);

  // Add new task
  const addTask = async (taskData) => {
    if (!auth.currentUser) {
      throw new Error("User not authenticated");
    }

    try {
      const userId = auth.currentUser.uid;
      const tasksRef = collection(db, "users", userId, "tasks");

      const newTask = {
        title: taskData.title,
        description: taskData.description || "",
        date: Timestamp.fromDate(new Date(taskData.date)),
        time: taskData.time || null,
        category: taskData.category,
        completed: false,
        completedAt: null,
        isRecurring: taskData.isRecurring || false,
        createdAt: Timestamp.now(),
        userId: userId,
      };

      const docRef = await addDoc(tasksRef, newTask);
      return { id: docRef.id, ...newTask };
    } catch (err) {
      console.error("Error adding task:", err);
      throw err;
    }
  };

  // Update task
  const updateTask = async (taskId, updates) => {
    if (!auth.currentUser) {
      throw new Error("User not authenticated");
    }

    try {
      const userId = auth.currentUser.uid;
      const taskRef = doc(db, "users", userId, "tasks", taskId);

      const updateData = { ...updates };

      // Convert date to Timestamp if present
      if (updates.date) {
        updateData.date = Timestamp.fromDate(new Date(updates.date));
      }

      await updateDoc(taskRef, updateData);
      return true;
    } catch (err) {
      console.error("Error updating task:", err);
      throw err;
    }
  };

  // Toggle task completion
  const toggleComplete = async (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    try {
      // Mark current task as completed
      await updateTask(taskId, {
        completed: !task.completed,
        completedAt: !task.completed ? Timestamp.now() : null,
      });

      // If completing a recurring task, create a new one for tomorrow
      if (!task.completed && task.isRecurring) {
        const tomorrow = new Date(task.date);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const newRecurringTask = {
          title: task.title,
          description: task.description || "",
          date: tomorrow,
          time: task.time || null,
          category: task.category,
          isRecurring: true,
        };

        await addTask(newRecurringTask);
        console.log("✓ Recurring task created for tomorrow");
      }

      return true;
    } catch (err) {
      console.error("Error toggling task:", err);
      throw err;
    }
  };

  // Delete task
  const deleteTask = async (taskId) => {
    if (!auth.currentUser) {
      throw new Error("User not authenticated");
    }

    try {
      const userId = auth.currentUser.uid;
      const taskRef = doc(db, "users", userId, "tasks", taskId);
      await deleteDoc(taskRef);
      return true;
    } catch (err) {
      console.error("Error deleting task:", err);
      throw err;
    }
  };

  // Move task to different category (quadrant)
  const moveTaskToCategory = async (taskId, newCategory) => {
    try {
      await updateTask(taskId, { category: newCategory });
      return true;
    } catch (err) {
      console.error("Error moving task:", err);
      throw err;
    }
  };

  // Get tasks for specific date
  const getTasksForDate = (date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return tasks.filter((task) => {
      const taskDateStr = format(task.date, "yyyy-MM-dd");
      return taskDateStr === dateStr;
    });
  };

  // Get tasks by category
  const getTasksByCategory = (category) => {
    return tasks.filter((task) => task.category === category);
  };

  // Get completed tasks
  const getCompletedTasks = () => {
    return tasks.filter((task) => task.completed);
  };

  // Get pending tasks
  const getPendingTasks = () => {
    return tasks.filter((task) => !task.completed);
  };

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    moveTaskToCategory,
    getTasksForDate,
    getTasksByCategory,
    getCompletedTasks,
    getPendingTasks,
  };
};

export default useTasks;
