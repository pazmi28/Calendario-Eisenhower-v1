import { useState, useEffect } from "react";
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

const useAutoMigration = () => {
  const [migrationStatus, setMigrationStatus] = useState({
    hasMigrated: false,
    count: 0,
    error: null,
    isChecking: true,
  });

  useEffect(() => {
    if (!auth.currentUser) {
      setMigrationStatus((prev) => ({ ...prev, isChecking: false }));
      return;
    }

    const checkAndMigrateTasks = async () => {
      console.log("🔍 Checking for tasks to migrate...");

      try {
        const userId = auth.currentUser.uid;
        const tasksRef = collection(db, "users", userId, "tasks");

        // Get all incomplete tasks from before today
        const today = new Date();
        const startOfToday = startOfDay(today);

        console.log("📅 Today starts at:", startOfToday);

        // Get ALL incomplete tasks (simpler query without date filter)
        const q = query(tasksRef, where("completed", "==", false));

        const snapshot = await getDocs(q);

        // Filter in JavaScript for tasks before today
        const tasksToMigrate = snapshot.docs.filter((taskDoc) => {
          const taskDate = taskDoc.data().date.toDate();
          const isBeforeToday = taskDate < startOfToday;
          console.log(
            `Task: "${
              taskDoc.data().title
            }" - Date: ${taskDate.toLocaleDateString()} - Before today: ${isBeforeToday}`
          );
          return isBeforeToday;
        });

        if (tasksToMigrate.length === 0) {
          console.log("✅ No tasks to migrate");
          setMigrationStatus({
            hasMigrated: false,
            count: 0,
            error: null,
            isChecking: false,
          });
          return;
        }

        console.log(`📦 Found ${tasksToMigrate.length} tasks to migrate`);

        // Migrate each task to today
        const migrationPromises = tasksToMigrate.map(async (taskDoc) => {
          const taskRef = doc(db, "users", userId, "tasks", taskDoc.id);
          const oldDate = taskDoc.data().date.toDate();

          console.log(
            `🔄 Migrating: ${
              taskDoc.data().title
            } from ${oldDate.toLocaleDateString()}`
          );

          await updateDoc(taskRef, {
            date: Timestamp.fromDate(today),
            migratedFrom: Timestamp.fromDate(oldDate),
            migratedAt: Timestamp.now(),
          });

          console.log(`✓ Migrated: ${taskDoc.data().title}`);
        });

        await Promise.all(migrationPromises);

        console.log(
          `✅ Migration completed: ${tasksToMigrate.length} tasks migrated to today`
        );

        setMigrationStatus({
          hasMigrated: true,
          count: tasksToMigrate.length,
          error: null,
          isChecking: false,
        });
      } catch (error) {
        console.error("❌ Error during auto-migration:", error);
        setMigrationStatus({
          hasMigrated: false,
          count: 0,
          error: error.message,
          isChecking: false,
        });
      }
    };

    // Run migration immediately on mount
    checkAndMigrateTasks();

    // Set up interval to check at midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const msUntilMidnight = tomorrow.getTime() - now.getTime();

    console.log(
      `⏰ Next migration check scheduled in ${Math.round(
        msUntilMidnight / 1000 / 60
      )} minutes (at midnight)`
    );

    // Schedule first check at midnight
    const midnightTimeout = setTimeout(() => {
      console.log("🌙 Midnight reached - checking for tasks to migrate");
      checkAndMigrateTasks();

      // Then check every 24 hours
      const dailyInterval = setInterval(() => {
        console.log("📅 Daily check - looking for tasks to migrate");
        checkAndMigrateTasks();
      }, 24 * 60 * 60 * 1000);

      return () => clearInterval(dailyInterval);
    }, msUntilMidnight);

    return () => clearTimeout(midnightTimeout);
  }, []); // Empty dependency array - only run once on mount

  return migrationStatus;
};

export default useAutoMigration;
