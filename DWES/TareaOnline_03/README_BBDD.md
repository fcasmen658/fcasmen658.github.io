# Documentación de Base de Datos - Sistema de Abonos UD Almería

## 📋 Estructura de Archivos

### Archivos de Configuración y Conexión

| Archivo | Descripción | Uso |
|---------|-------------|-----|
| `config.php` | Configuración de credenciales de BD | Define constantes DB_HOST, DB_NAME, DB_USER, DB_PASS, DB_PORT |
| `conexionbd.php` | Establecimiento de conexión PDO | Crea el objeto `$pdo` usando las constantes de config.php |
| `bbdd.sql` | Script SQL completo | Crea estructura y datos iniciales de la BD |

### Flujo de Inclusión

```
Script PHP (compra_abono.php, login.php, etc.)
    ↓
require_once __DIR__ . '/conexionbd.php'
    ↓
require 'config.php'
    ↓
Objeto $pdo disponible
```

## 🗄️ Estructura de Base de Datos

### Base de Datos: `uda`
- **Charset:** utf8mb4
- **Collation:** utf8mb4_unicode_ci

### Tablas

#### 1. `tipo_abonos`
**Descripción:** Catálogo de tipos de abonos disponibles

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | VARCHAR(36) | PRIMARY KEY | UUID del tipo |
| `descripcion` | VARCHAR(100) | NOT NULL | Nombre del tipo (Tribuna, Preferencia, Fondo) |
| `precio` | DECIMAL(10,2) | NOT NULL | Precio base antes de descuentos |

**Datos iniciales:**
- Tribuna: 550.00€
- Preferencia: 420.00€
- Fondo: 280.00€

---

#### 2. `abonos`
**Descripción:** Registro de todos los abonos vendidos

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | VARCHAR(36) | PRIMARY KEY | UUID de la venta |
| `fecha` | DATETIME | NOT NULL | Fecha y hora de compra |
| `abonado` | VARCHAR(200) | NOT NULL | "Nombre Apellidos - DNI" |
| `edad` | INT | NOT NULL | Edad para aplicar descuentos |
| `telefono` | VARCHAR(15) | NOT NULL | Teléfono de contacto |
| `cuenta_bancaria` | VARCHAR(34) | NOT NULL | IBAN del abonado |
| `tipo` | VARCHAR(36) | FK, NOT NULL | ID del tipo de abono |
| `asiento` | VARCHAR(50) | UNIQUE, NOT NULL | Código único del asiento |
| `precio` | DECIMAL(10,2) | NOT NULL | Precio final con descuentos |

**Claves foráneas:**
- `tipo` → `tipo_abonos(id)` ON DELETE RESTRICT ON UPDATE CASCADE

**Índices:**
- `idx_fecha` sobre `fecha`
- `idx_tipo` sobre `tipo`
- `idx_asiento` sobre `asiento` (único)

**Reglas de negocio:**
- Descuento niños (edad < 12): -80€
- Descuento jubilados (edad > 65): -50%
- Formato asiento: `[T/P/F]B[1-5]/F[00-29]-A[000-199]`

---

#### 3. `usuarios`
**Descripción:** Usuarios con acceso al sistema de gestión

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | VARCHAR(36) | PRIMARY KEY | UUID del usuario |
| `username` | VARCHAR(50) | UNIQUE, NOT NULL | Nombre de usuario |
| `password` | VARCHAR(255) | NOT NULL | Hash con password_hash() |

**Usuario predeterminado:**
- Username: `uda`
- Password: `1234` (almacenada como hash bcrypt)

---

## 🔧 Uso de PDO

### Configuración en `config.php`

```php
define('DB_HOST', '127.0.0.1');
define('DB_NAME', 'uda');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_PORT', 3306);
```

### Conexión en `conexionbd.php`

```php
require 'config.php';

$pdo = new PDO(
    'mysql:host=' . DB_HOST . ';port=' . DB_PORT . ';dbname=' . DB_NAME . ';charset=utf8mb4',
    DB_USER,
    DB_PASS,
    array(
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false
    )
);
```

### Uso en Scripts

```php
// Incluir conexión
require_once __DIR__ . '/conexionbd.php';

// Consulta preparada
$stmt = $pdo->prepare("SELECT * FROM tipo_abonos WHERE id = :id");
$stmt->execute([':id' => $id]);
$resultado = $stmt->fetch(PDO::FETCH_ASSOC);
```

---

## 📦 Instalación

### 1. Crear la base de datos

**Opción A - Línea de comandos:**
```bash
mysql -u root -p < bbdd.sql
```

**Opción B - phpMyAdmin:**
1. Ir a "Importar"
2. Seleccionar `bbdd.sql`
3. Ejecutar

**Opción C - MySQL Workbench:**
1. File → Run SQL Script
2. Seleccionar `bbdd.sql`

### 2. Configurar credenciales

Editar `config.php` con las credenciales de tu servidor:

```php
define('DB_HOST', 'tu_servidor');
define('DB_NAME', 'uda');
define('DB_USER', 'tu_usuario');
define('DB_PASS', 'tu_contraseña');
```

### 3. Inicializar usuario (opcional)

Si el hash de contraseña no funciona, ejecutar:
```
http://localhost/DWES/TareaOnline_03/init_usuarios.php
```

### 4. Verificar conexión

Todos los scripts deben conectarse sin errores.

---

## 🔒 Seguridad

### Contraseñas
- **Nunca** se almacenan en texto plano
- Se usa `password_hash()` con PASSWORD_DEFAULT (bcrypt)
- Se verifica con `password_verify()`

### PDO Preparadas
- **Todas** las consultas usan prepared statements
- Previene inyección SQL
- Parámetros con prefijo `:` (e.g., `:username`)

### Charset
- utf8mb4 para soportar emojis y caracteres especiales
- Previene problemas de codificación

### Integridad Referencial
- Claves foráneas garantizan consistencia
- ON DELETE RESTRICT evita borrados accidentales
- ON UPDATE CASCADE propaga cambios

---

## 📊 Consultas Comunes

### Listar todos los abonos con tipo
```sql
SELECT 
    a.id, a.fecha, a.abonado, a.asiento, a.precio,
    t.descripcion as tipo_nombre
FROM abonos a
LEFT JOIN tipo_abonos t ON a.tipo = t.id
ORDER BY a.fecha DESC;
```

### Estadísticas de ventas
```sql
SELECT 
    t.descripcion,
    COUNT(*) as cantidad,
    SUM(a.precio) as recaudacion
FROM abonos a
JOIN tipo_abonos t ON a.tipo = t.id
GROUP BY t.id;
```

### Verificar asientos disponibles
```sql
SELECT asiento FROM abonos WHERE asiento = 'TB1/F15-A095';
```

---

## ✅ Checklist de Entrega

- [x] Archivo `config.php` con datos de acceso
- [x] Archivo `conexionbd.php` con conexión PDO
- [x] Archivo `bbdd.sql` con estructura y datos
- [x] Todos los scripts usan `require`/`include`
- [x] Conexión mediante PDO
- [x] Prepared statements en todas las consultas
- [x] Contraseñas encriptadas con password_hash()
- [x] Documentación completa
