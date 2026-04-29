# 📅 Eisenhower Calendar - Sprint 1 Base

Calendario con Matriz de Eisenhower para gestión de tareas según urgencia e importancia.

## 🚀 Estado Actual: SPRINT 1 - Estructura Base

### ✅ Completado en esta fase:
- Estructura base del proyecto
- Sistema de autenticación (Login/Registro)
- Layout con sidebar navegable
- Sistema de rutas (React Router)
- Páginas placeholder (Calendar, Dashboard, Settings)
- Design System completo (CSS Variables)
- Integración Firebase configurada

### 📋 Próximos pasos (continuación Sprint 1):
1. Componente CalendarHeader
2. Vista mensual (MonthView)
3. Vista diaria con Matriz Eisenhower (DayView)
4. Vista semanal (WeekView)
5. Sistema CRUD de tareas
6. Integración con Firestore

---

## 🛠️ Configuración del Proyecto

### 1. Copiar archivo Firebase

Ya tienes tu archivo `firebase.js` configurado con tus credenciales. Asegúrate de que esté en:
```
src/firebase.js
```

Y que tenga esta estructura:
```javascript
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE_BUCKET",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
```

### 2. Instalar dependencias

En CodeSandbox, las dependencias se instalan automáticamente desde `package.json`.

Si trabajas localmente:
```bash
npm install
```

### 3. Configurar Firestore (en Firebase Console)

1. Ve a Firebase Console → Firestore Database
2. Las reglas actuales son de prueba (expire después de 30 días)
3. Más adelante configuraremos reglas de seguridad apropiadas

---

## 📦 Dependencias Principales

- **react** (18.2.0) - Framework principal
- **react-router-dom** (6.20.1) - Gestión de rutas
- **firebase** (10.7.1) - Backend y autenticación
- **react-firebase-hooks** (5.1.1) - Hooks para Firebase
- **date-fns** (2.30.0) - Manipulación de fechas
- **react-beautiful-dnd** (13.1.1) - Drag & drop
- **react-hot-toast** (2.4.1) - Notificaciones
- **recharts** (2.10.3) - Gráficos (para Dashboard)
- **framer-motion** (10.16.16) - Animaciones

---

## 🎨 Design System

### Colores principales:
- **Primary Blue**: `#2563eb` - Acciones principales
- **Q1 Red**: `#ef4444` - Urgente e Importante
- **Q2 Blue**: `#3b82f6` - No Urgente e Importante
- **Q3 Yellow**: `#f59e0b` - Urgente y No Importante
- **Q4 Gray**: `#6b7280` - No Urgente y No Importante

### Tipografía:
- **Display**: Poppins (600, 700) - Títulos
- **Body**: Inter (400, 500, 600, 700) - Texto general

---

## 📁 Estructura de Archivos

```
src/
├── components/
│   ├── Layout/
│   │   ├── Layout.jsx
│   │   └── Layout.css
│   └── Calendar/          (Próximamente)
│       ├── CalendarHeader.jsx
│       ├── MonthView.jsx
│       ├── DayView.jsx
│       └── WeekView.jsx
├── pages/
│   ├── Login.jsx
│   ├── Login.css
│   ├── CalendarPage.jsx
│   ├── CalendarPage.css
│   ├── DashboardPage.jsx
│   ├── DashboardPage.css
│   ├── SettingsPage.jsx
│   └── SettingsPage.css
├── styles/
│   └── global.css
├── firebase.js
└── App.js
```

---

## 🔐 Autenticación

El sistema usa Firebase Authentication con email/password:

- **Registro**: Crear nueva cuenta con email y contraseña (mínimo 6 caracteres)
- **Login**: Iniciar sesión con credenciales existentes
- **Estado persistente**: La sesión se mantiene entre recargas
- **Logout**: Botón en el sidebar

---

## 🎯 Roadmap Completo

### Sprint 1: MVP Funcional (8-10h) ⏳ EN PROGRESO
- [x] Estructura base y limpieza
- [x] Layout y navegación
- [x] Sistema de autenticación
- [ ] Vistas calendario básicas
- [ ] Matriz Eisenhower
- [ ] CRUD tareas + Firebase
- [ ] Sistema completar tareas

### Sprint 2: Features Avanzadas (8-10h)
- [ ] Drag & drop entre cuadrantes
- [ ] Auto-migración de tareas
- [ ] Dashboard con estadísticas
- [ ] Historial completadas
- [ ] Búsqueda y filtros

### Sprint 3: Polish & Premium (6-8h)
- [ ] Notificaciones
- [ ] Export/Import
- [ ] Temas personalizables
- [ ] Optimización mobile
- [ ] Testing y bugs

---

## 🚨 Problemas Comunes

### Error: Module not found
Asegúrate de que todas las dependencias estén en `package.json` y se hayan instalado.

### Firebase no conecta
Verifica que `firebase.js` tenga las credenciales correctas de tu proyecto.

### Estilos no se cargan
Asegúrate de que `global.css` esté importado en `App.js`.

---

## 📝 Notas de Desarrollo

- **Estado actual**: Base del proyecto con autenticación funcional
- **Siguiente fase**: Implementar vistas de calendario
- **Estilo**: Diseño limpio y profesional con gradientes sutiles
- **Performance**: Optimización pendiente para fase 3

---

## 🤝 Contribución

Este proyecto está en desarrollo activo. Estamos en el **Sprint 1** construyendo el MVP.

---

**Última actualización**: Sprint 1 - Fase Base
**Próxima entrega**: Componentes de Calendario