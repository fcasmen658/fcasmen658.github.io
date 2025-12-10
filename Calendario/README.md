# Calendario

Proyecto web de calendario perpetuo para España con fases lunares, santoral y gestión de tareas.

## Características
- Visualización mensual con festivos nacionales y autonómicos
- Santoral completo cargado desde JSON
- Fases lunares en cada día
- Añadir, editar y eliminar tareas por día
- Interfaz moderna y responsiva
- Backend Node.js/Express para persistencia de tareas

## Estructura
- `index.html`: Página principal del calendario
- `addTareas.html`: Formulario para añadir tareas
- `tareas.html`: Lista y edición de tareas
- `css/styles.css`: Hoja de estilos
- `js/calendar.js`: Lógica del calendario
- `js/santoral.json`: Santoral perpetuo
- `js/tareas.json`: Tareas por día
- `js/addTarea.js`: Lógica de añadir tareas
- `js/listaTareas.js`: Lógica de edición/borrado de tareas
- `server.js`: Backend Node.js/Express

## Instalación y uso
1. Instala dependencias:
   ```pwsh
   npm install express
   ```
2. Inicia el servidor:
   ```pwsh
   node server.js
   ```
3. Accede a `http://localhost:3000/index.html` en tu navegador

## Subir a GitHub
1. Inicializa el repositorio:
   ```pwsh
   git init
   git add .
   git commit -m "Proyecto Calendario inicial"
   ```
2. Crea el repositorio en GitHub y vincúlalo:
   ```pwsh
   git remote add origin https://github.com/tu-usuario/Calendario.git
   git push -u origin master
   ```

## Pendiente
- Mejorar la gestión de usuarios y autenticación
- Exportar/Importar tareas
- Mejorar la visualización móvil

---
Desarrollado con ❤️ por fcasmen658
