import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate("/");
    } catch (error) {
      console.error("Auth error:", error);
      switch (error.code) {
        case "auth/user-not-found":
          setError("Usuario no encontrado");
          break;
        case "auth/wrong-password":
          setError("Contraseña incorrecta");
          break;
        case "auth/email-already-in-use":
          setError("Este email ya está registrado");
          break;
        case "auth/weak-password":
          setError("La contraseña debe tener al menos 6 caracteres");
          break;
        case "auth/invalid-email":
          setError("Email inválido");
          break;
        default:
          setError("Error de autenticación. Inténtalo de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">📅</div>
          <h1>Eisenhower Calendar</h1>
          <p>Organiza tu tiempo según lo urgente e importante</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
              autoComplete={isSignUp ? "new-password" : "current-password"}
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? (
              <>
                <span className="button-spinner"></span>
                <span>Procesando...</span>
              </>
            ) : (
              <span>{isSignUp ? "Crear Cuenta" : "Iniciar Sesión"}</span>
            )}
          </button>

          <div className="toggle-mode">
            <button
              type="button"
              className="toggle-button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
              }}
            >
              {isSignUp
                ? "¿Ya tienes cuenta? Inicia sesión"
                : "¿No tienes cuenta? Regístrate"}
            </button>
          </div>
        </form>

        <div className="login-footer">
          <div className="feature-list">
            <div className="feature-item">
              <span className="feature-icon">🔥</span>
              <span>Prioriza con Matriz Eisenhower</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📊</span>
              <span>Analiza tu productividad</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">⚡</span>
              <span>Auto-migración de tareas</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
