import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import "./AddTaskModal.css";

const AddTaskModal = ({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  defaultDate = new Date(),
  defaultCategory = "q2",
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: format(defaultDate, "yyyy-MM-dd"),
    time: "",
    category: defaultCategory,
    isRecurring: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens/closes or initial data changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          title: initialData.title || "",
          description: initialData.description || "",
          date: format(new Date(initialData.date), "yyyy-MM-dd"),
          time: initialData.time || "",
          category: initialData.category || defaultCategory,
          isRecurring: initialData.isRecurring || false,
        });
      } else {
        setFormData({
          title: "",
          description: "",
          date: format(defaultDate, "yyyy-MM-dd"),
          time: "",
          category: defaultCategory,
          isRecurring: false,
        });
      }
      setErrors({});
    }
  }, [isOpen, initialData, defaultDate, defaultCategory]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "El título es obligatorio";
    }

    if (!formData.date) {
      newErrors.date = "La fecha es obligatoria";
    }

    if (!formData.category) {
      newErrors.category = "Selecciona una categoría";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error saving task:", error);
      setErrors({ submit: "Error al guardar la tarea. Inténtalo de nuevo." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleCategorySelect = (category) => {
    setFormData((prev) => ({
      ...prev,
      category,
    }));
    if (errors.category) {
      setErrors((prev) => ({
        ...prev,
        category: null,
      }));
    }
  };

  if (!isOpen) return null;

  const categories = [
    {
      id: "q1",
      title: "Urgente e Importante",
      subtitle: "Hacer ahora",
      icon: "🔥",
      color: "q1",
    },
    {
      id: "q2",
      title: "No Urgente e Importante",
      subtitle: "Planificar",
      icon: "🎯",
      color: "q2",
    },
    {
      id: "q3",
      title: "Urgente y No Importante",
      subtitle: "Delegar",
      icon: "📞",
      color: "q3",
    },
    {
      id: "q4",
      title: "No Urgente y No Importante",
      subtitle: "Eliminar",
      icon: "📋",
      color: "q4",
    },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{initialData ? "Editar Tarea" : "Nueva Tarea"}</h2>
          <button className="modal-close" onClick={onClose} type="button">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="task-form">
          {errors.submit && (
            <div className="form-error-banner">{errors.submit}</div>
          )}

          <div className="form-group">
            <label htmlFor="title">
              Título <span className="required">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ej: Entregar informe trimestral"
              className={errors.title ? "error" : ""}
              autoFocus
            />
            {errors.title && (
              <span className="field-error">{errors.title}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="description">Descripción (opcional)</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detalles adicionales sobre la tarea..."
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">
                Fecha <span className="required">*</span>
              </label>
              <input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                className={errors.date ? "error" : ""}
              />
              {errors.date && (
                <span className="field-error">{errors.date}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="time">Hora (opcional)</label>
              <input
                id="time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group recurring-toggle">
            <label className="recurring-label">
              <input
                type="checkbox"
                checked={formData.isRecurring}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isRecurring: e.target.checked,
                  }))
                }
                className="recurring-checkbox"
              />
              <span className="recurring-icon">♻️</span>
              <div className="recurring-info">
                <span className="recurring-title">Tarea Recurrente</span>
                <span className="recurring-description">
                  Al completarla, se creará automáticamente para el día
                  siguiente
                </span>
              </div>
            </label>
          </div>

          <div className="form-group">
            <label>
              Categoría Eisenhower <span className="required">*</span>
            </label>
            <div className="category-grid">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`category-card category-${cat.color} ${
                    formData.category === cat.id ? "selected" : ""
                  }`}
                  onClick={() => handleCategorySelect(cat.id)}
                >
                  <div className="category-icon">{cat.icon}</div>
                  <div className="category-info">
                    <div className="category-title">{cat.title}</div>
                    <div className="category-subtitle">{cat.subtitle}</div>
                  </div>
                  {formData.category === cat.id && (
                    <div className="category-check">✓</div>
                  )}
                </button>
              ))}
            </div>
            {errors.category && (
              <span className="field-error">{errors.category}</span>
            )}
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  <span>Guardando...</span>
                </>
              ) : (
                <span>{initialData ? "Actualizar" : "Crear Tarea"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
