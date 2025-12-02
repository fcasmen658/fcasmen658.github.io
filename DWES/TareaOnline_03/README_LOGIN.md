# Sistema de Login - UD Almería

## 📋 Descripción

Sistema de autenticación para el acceso al listado de abonos vendidos del UD Almería.

## 🗄️ Estructura de la Base de Datos

### Tabla `usuarios`

```sql
CREATE TABLE IF NOT EXISTS usuarios (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
)
```

## 🚀 Instalación

### 1. Inicializar la base de datos

Ejecuta el script `init_usuarios.php` **una sola vez** para:
- Crear la tabla `usuarios`
- Crear el usuario encargado predeterminado

```
http://localhost/TareaOnline_03/init_usuarios.php
```

### 2. Credenciales predeterminadas

- **Usuario:** `uda`
- **Contraseña:** `1234`

La contraseña está encriptada con `password_hash()` y se verifica con `password_verify()`.

## 🔐 Flujo de Autenticación

1. **Acceso al login** (`login.php`)
   - Formulario con campos de usuario y contraseña
   - Validación de campos vacíos

2. **Validación de credenciales**
   - Búsqueda del usuario en la base de datos
   - Verificación de contraseña encriptada
   - Si es correcto: crear sesión y redirigir a listado
   - Si es incorrecto: mostrar mensaje de error

3. **Acceso al listado** (`listadoabonos.php`)
   - **PROTEGIDO**: Requiere autenticación
   - Muestra todos los abonos vendidos
   - Información del usuario en cabecera
   - Botón para cerrar sesión

4. **Cerrar sesión** (`logout.php`)
   - Destruye la sesión activa
   - Elimina cookies de sesión
   - Redirige al login

## 📁 Archivos del Sistema

| Archivo | Descripción |
|---------|-------------|
| `init_usuarios.php` | Script de inicialización (ejecutar una sola vez) |
| `login.php` | Formulario de login y validación de credenciales |
| `logout.php` | Script para cerrar sesión |
| `listadoabonos.php` | Listado protegido de abonos (requiere autenticación) |

## 🔒 Características de Seguridad

- ✅ Contraseñas encriptadas con `password_hash(PASSWORD_DEFAULT)`
- ✅ Verificación segura con `password_verify()`
- ✅ Regeneración de ID de sesión tras login exitoso
- ✅ Protección contra acceso directo a páginas protegidas
- ✅ Validación de campos vacíos
- ✅ Escape de salida HTML con `htmlspecialchars()`
- ✅ Destrucción completa de sesión al cerrar

## 🧪 Pruebas

1. Accede a `login.php`
2. Ingresa credenciales incorrectas → debe mostrar error
3. Deja campos vacíos → debe mostrar errores de validación
4. Ingresa credenciales correctas (`uda` / `1234`) → debe redirigir al listado
5. En el listado, verifica que muestra el usuario actual
6. Intenta acceder directamente a `listadoabonos.php` sin sesión → debe redirigir al login
7. Cierra sesión → debe destruir la sesión y volver al login

## 🎨 Estilos

El sistema utiliza los estilos de `styles/general.css` más estilos personalizados inline para mantener coherencia visual con el resto de la aplicación.

## 📝 Notas Técnicas

- Las sesiones se inician con `session_start()` al principio de cada script protegido
- La verificación de autenticación se realiza comprobando `$_SESSION['usuario_autenticado']`
- El logout elimina tanto las variables de sesión como la cookie del navegador
- Los mensajes de error son genéricos para evitar revelar si el usuario existe o no
