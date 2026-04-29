import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import "./SettingsPage.css";

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    // Notificaciones
    enableNotifications: true,
    notifyMigrations: true,
    notifyDeadlines: true,

    // Preferencias de vista
    defaultView: "month",
    weekStartsOn: 1, // 0 = domingo, 1 = lunes

    // Auto-migración
    enableAutoMigration: true,
    migrationTime: "00:00",

    // Productividad
    dailyTaskGoal: 5,
    showCompletionRate: true,

    // Tema (para futuro)
    theme: "light",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [userInfo, setUserInfo] = useState({
    email: "",
    displayName: "",
    photoURL: "",
  });

  // Load settings from Firebase
  useEffect(() => {
    const loadSettings = async () => {
      if (!auth.currentUser) return;

      try {
        const userId = auth.currentUser.uid;
        const settingsRef = doc(db, "users", userId, "settings", "preferences");
        const settingsDoc = await getDoc(settingsRef);

        if (settingsDoc.exists()) {
          setSettings({ ...settings, ...settingsDoc.data() });
        }

        // Load user info
        setUserInfo({
          email: auth.currentUser.email || "",
          displayName: auth.currentUser.displayName || "Usuario",
          photoURL: auth.currentUser.photoURL || "",
        });

        setLoading(false);
      } catch (error) {
        console.error("Error loading settings:", error);
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Save settings to Firebase
  const handleSaveSettings = async () => {
    if (!auth.currentUser) return;

    setSaving(true);
    try {
      const userId = auth.currentUser.uid;
      const settingsRef = doc(db, "users", userId, "settings", "preferences");
      await setDoc(settingsRef, settings);

      setSavedMessage("✓ Configuración guardada correctamente");
      setTimeout(() => setSavedMessage(""), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
      setSavedMessage("✕ Error al guardar la configuración");
      setTimeout(() => setSavedMessage(""), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSignOut = async () => {
    if (window.confirm("¿Cerrar sesión?")) {
      await auth.signOut();
    }
  };

  if (loading) {
    return (
      <div className="settings-page">
        <div className="settings-loading">
          <div className="loading-spinner"></div>
          <p>Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>⚙️ Configuración</h1>
        <p className="settings-subtitle">Personaliza tu experiencia</p>
      </div>

      {/* User Profile Card */}
      <div className="settings-card profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {userInfo.photoURL ? (
              <img src={userInfo.photoURL} alt="Avatar" />
            ) : (
              <div className="avatar-placeholder">
                {userInfo.displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="profile-info">
            <h3>{userInfo.displayName}</h3>
            <p>{userInfo.email}</p>
          </div>
        </div>
      </div>

      {/* Notifications Settings */}
      <div className="settings-card">
        <div className="card-header">
          <h2>🔔 Notificaciones</h2>
        </div>
        <div className="settings-group">
          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-label">Activar notificaciones</div>
              <div className="setting-description">
                Recibe notificaciones en la aplicación
              </div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.enableNotifications}
                onChange={(e) =>
                  handleChange("enableNotifications", e.target.checked)
                }
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-label">Notificar migraciones</div>
              <div className="setting-description">
                Aviso cuando se migran tareas automáticamente
              </div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.notifyMigrations}
                onChange={(e) =>
                  handleChange("notifyMigrations", e.target.checked)
                }
                disabled={!settings.enableNotifications}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-label">Recordatorios de deadlines</div>
              <div className="setting-description">
                Notificaciones para tareas próximas a vencer
              </div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.notifyDeadlines}
                onChange={(e) =>
                  handleChange("notifyDeadlines", e.target.checked)
                }
                disabled={!settings.enableNotifications}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      {/* View Preferences */}
      <div className="settings-card">
        <div className="card-header">
          <h2>📅 Preferencias de Vista</h2>
        </div>
        <div className="settings-group">
          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-label">Vista por defecto</div>
              <div className="setting-description">
                Vista inicial al abrir el calendario
              </div>
            </div>
            <select
              value={settings.defaultView}
              onChange={(e) => handleChange("defaultView", e.target.value)}
              className="setting-select"
            >
              <option value="month">Mes</option>
              <option value="week">Semana</option>
              <option value="day">Día</option>
            </select>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-label">La semana empieza en</div>
              <div className="setting-description">
                Primer día de la semana en el calendario
              </div>
            </div>
            <select
              value={settings.weekStartsOn}
              onChange={(e) =>
                handleChange("weekStartsOn", parseInt(e.target.value))
              }
              className="setting-select"
            >
              <option value="0">Domingo</option>
              <option value="1">Lunes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Auto-migration Settings */}
      <div className="settings-card">
        <div className="card-header">
          <h2>🔄 Auto-migración de Tareas</h2>
        </div>
        <div className="settings-group">
          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-label">Activar auto-migración</div>
              <div className="setting-description">
                Migra automáticamente tareas pendientes al día siguiente
              </div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.enableAutoMigration}
                onChange={(e) =>
                  handleChange("enableAutoMigration", e.target.checked)
                }
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-label">Hora de migración</div>
              <div className="setting-description">
                Hora a la que se migran las tareas (solo si la app está abierta)
              </div>
            </div>
            <input
              type="time"
              value={settings.migrationTime}
              onChange={(e) => handleChange("migrationTime", e.target.value)}
              className="setting-input"
              disabled={!settings.enableAutoMigration}
            />
          </div>
        </div>
      </div>

      {/* Productivity Settings */}
      <div className="settings-card">
        <div className="card-header">
          <h2>📈 Productividad</h2>
        </div>
        <div className="settings-group">
          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-label">Meta diaria de tareas</div>
              <div className="setting-description">
                Número de tareas que quieres completar cada día
              </div>
            </div>
            <input
              type="number"
              min="1"
              max="50"
              value={settings.dailyTaskGoal}
              onChange={(e) =>
                handleChange("dailyTaskGoal", parseInt(e.target.value))
              }
              className="setting-input"
            />
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-label">Mostrar tasa de completado</div>
              <div className="setting-description">
                Ver porcentaje de tareas completadas en el dashboard
              </div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.showCompletionRate}
                onChange={(e) =>
                  handleChange("showCompletionRate", e.target.checked)
                }
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="settings-actions">
        <button
          className="btn btn-primary btn-save"
          onClick={handleSaveSettings}
          disabled={saving}
        >
          {saving ? (
            <>
              <span className="spinner"></span>
              Guardando...
            </>
          ) : (
            <>
              <span>💾</span>
              Guardar Cambios
            </>
          )}
        </button>

        {savedMessage && (
          <div
            className={`save-message ${
              savedMessage.includes("✓") ? "success" : "error"
            }`}
          >
            {savedMessage}
          </div>
        )}
      </div>

      {/* Sign Out */}
      <div className="settings-card danger-zone">
        <div className="card-header">
          <h2>⚠️ Zona de Peligro</h2>
        </div>
        <div className="settings-group">
          <button className="btn btn-danger" onClick={handleSignOut}>
            🚪 Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
