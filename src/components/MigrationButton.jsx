import React, { useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { startOfDay } from "date-fns";
import "./MigrationButton.css";

const MigrationButton = ({ onMigrationComplete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleManualMigration = async () => {
    if (!auth.currentUser) {
      setMessage("❌ No hay usuario autenticado");
      return;
    }

    setIsLoading(true);
    setMessage("🔍 Buscando tareas...");

    try {
      const userId = auth.currentUser.uid;
      const tasksRef = collection(db, "users", userId, "tasks");

      const today = new Date();
      const startOfToday = startOfDay(today);

      console.log("📅 Hoy es:", today);
      console.log("📅 Inicio del día:", startOfToday);

      // Get ALL incomplete tasks (simpler query)
      const q = query(tasksRef, where("completed", "==", false));

      const snapshot = await getDocs(q);

      // Filter in JavaScript for tasks before today
      const tasksToMigrate = snapshot.docs.filter((taskDoc) => {
        const taskDate = taskDoc.data().date.toDate();
        const isBeforeToday = taskDate < startOfToday;
        console.log(
          `📋 Task: "${
            taskDoc.data().title
          }" - Date: ${taskDate.toLocaleDateString()} - Is before today: ${isBeforeToday}`
        );
        return isBeforeToday;
      });

      if (tasksToMigrate.length === 0) {
        setMessage("✅ No hay tareas pendientes de días anteriores");
        console.log("✅ No tasks to migrate");
        setIsLoading(false);
        return;
      }

      console.log(`📦 Encontradas ${tasksToMigrate.length} tareas para migrar`);
      setMessage(`📦 Migrando ${tasksToMigrate.length} tareas...`);

      // Migrate each task
      const migrationPromises = tasksToMigrate.map(async (taskDoc) => {
        const taskRef = doc(db, "users", userId, "tasks", taskDoc.id);
        const oldDate = taskDoc.data().date.toDate();

        console.log(
          `🔄 Migrando: "${
            taskDoc.data().title
          }" desde ${oldDate.toLocaleDateString()}`
        );

        await updateDoc(taskRef, {
          date: Timestamp.fromDate(today),
          migratedFrom: Timestamp.fromDate(oldDate),
          migratedAt: Timestamp.now(),
        });
      });

      await Promise.all(migrationPromises);

      setMessage(
        `✅ ${tasksToMigrate.length} ${
          tasksToMigrate.length === 1 ? "tarea migrada" : "tareas migradas"
        } a hoy`
      );
      console.log(`✅ Migration completed: ${tasksToMigrate.length} tasks`);

      if (onMigrationComplete) {
        onMigrationComplete(tasksToMigrate.length);
      }
    } catch (error) {
      console.error("❌ Error:", error);
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage(""), 5000);
    }
  };

  return (
    <div className="migration-button-container">
      <button
        className="migration-button"
        onClick={handleManualMigration}
        disabled={isLoading}
      >
        {isLoading ? "⏳ Migrando..." : "🔄 Migrar Tareas Manualmente"}
      </button>
      {message && <div className="migration-message">{message}</div>}
    </div>
  );
};

export default MigrationButton;
