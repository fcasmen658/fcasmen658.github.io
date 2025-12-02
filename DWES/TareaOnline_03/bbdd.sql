-- ============================================================================
-- SCRIPT DE BASE DE DATOS: UD ALMERÍA - SISTEMA DE GESTIÓN DE ABONOS
-- ============================================================================
-- Base de datos: uda
-- Sistema de venta y gestión de abonos para el club UD Almería
-- ============================================================================

-- Eliminar base de datos si existe (cuidado en producción)
DROP DATABASE IF EXISTS uda;

-- Crear base de datos con codificación UTF-8
CREATE DATABASE uda CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Seleccionar la base de datos
USE uda;

-- ============================================================================
-- TABLA: tipo_abonos
-- ============================================================================
-- Descripción: Almacena los diferentes tipos de abonos disponibles
-- Campos:
--   - id: Identificador único (UUID)
--   - descripcion: Nombre del tipo de abono
--   - precio: Precio base del abono (antes de descuentos)
-- ============================================================================

CREATE TABLE tipo_abonos (
    id VARCHAR(36) PRIMARY KEY COMMENT 'UUID del tipo de abono',
    descripcion VARCHAR(100) NOT NULL COMMENT 'Nombre del tipo de abono',
    precio DECIMAL(10, 2) NOT NULL COMMENT 'Precio base del abono'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Tipos de abonos disponibles para la venta';

-- ============================================================================
-- TABLA: abonos
-- ============================================================================
-- Descripción: Almacena la información de todos los abonos vendidos
-- Campos:
--   - id: Identificador único de la venta (UUID)
--   - fecha: Fecha y hora de la compra
--   - abonado: Nombre completo y DNI del abonado
--   - edad: Edad del abonado (para aplicar descuentos)
--   - telefono: Teléfono de contacto
--   - cuenta_bancaria: IBAN para el cargo del abono
--   - tipo: Referencia al tipo de abono (FK)
--   - asiento: Código único del asiento asignado
--   - precio: Precio final pagado (con descuentos aplicados)
-- ============================================================================

CREATE TABLE abonos (
    id VARCHAR(36) PRIMARY KEY COMMENT 'UUID de la venta',
    fecha DATETIME NOT NULL COMMENT 'Fecha y hora de compra',
    abonado VARCHAR(200) NOT NULL COMMENT 'Nombre completo y DNI del abonado',
    edad INT NOT NULL COMMENT 'Edad del abonado',
    telefono VARCHAR(15) NOT NULL COMMENT 'Teléfono de contacto',
    cuenta_bancaria VARCHAR(34) NOT NULL COMMENT 'IBAN del abonado',
    tipo VARCHAR(36) NOT NULL COMMENT 'ID del tipo de abono',
    asiento VARCHAR(50) NOT NULL UNIQUE COMMENT 'Código único del asiento',
    precio DECIMAL(10, 2) NOT NULL COMMENT 'Precio final pagado',
    FOREIGN KEY (tipo) REFERENCES tipo_abonos(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Registro de abonos vendidos';

-- Índices para mejorar el rendimiento de consultas
CREATE INDEX idx_fecha ON abonos(fecha);
CREATE INDEX idx_tipo ON abonos(tipo);
CREATE INDEX idx_asiento ON abonos(asiento);

-- ============================================================================
-- TABLA: usuarios
-- ============================================================================
-- Descripción: Almacena los usuarios con acceso al sistema de gestión
-- Campos:
--   - id: Identificador único del usuario (UUID)
--   - username: Nombre de usuario para login
--   - password: Contraseña encriptada con password_hash()
-- ============================================================================

CREATE TABLE usuarios (
    id VARCHAR(36) PRIMARY KEY COMMENT 'UUID del usuario',
    username VARCHAR(50) UNIQUE NOT NULL COMMENT 'Nombre de usuario',
    password VARCHAR(255) NOT NULL COMMENT 'Contraseña encriptada'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Usuarios con acceso al sistema de gestión';

-- ============================================================================
-- DATOS INICIALES: tipo_abonos
-- ============================================================================
-- Insertar los tres tipos de abonos disponibles
-- Precios base (antes de aplicar descuentos por edad)
-- ============================================================================

INSERT INTO tipo_abonos (id, descripcion, precio) VALUES
    ('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'Tribuna', 550.00),
    ('b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e', 'Preferencia', 420.00),
    ('c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f', 'Fondo', 280.00);

-- ============================================================================
-- DATOS INICIALES: usuarios
-- ============================================================================
-- Usuario predeterminado para el encargado
-- Username: uda
-- Password: 1234 (encriptada con password_hash usando PASSWORD_DEFAULT)
-- Nota: El hash puede variar según el servidor, regenerar con init_usuarios.php
-- ============================================================================

INSERT INTO usuarios (id, username, password) VALUES
    ('d4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a', 'uda', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Nota: La contraseña anterior es un hash de ejemplo.
-- Para generar un hash válido de "1234", ejecutar init_usuarios.php o usar:
-- SELECT PASSWORD('1234'); -- En versiones antiguas de MySQL
-- O en PHP: password_hash('1234', PASSWORD_DEFAULT);

-- ============================================================================
-- DATOS DE EJEMPLO: abonos (opcional)
-- ============================================================================
-- Algunos registros de ejemplo para pruebas
-- ============================================================================

INSERT INTO abonos (id, fecha, abonado, edad, telefono, cuenta_bancaria, tipo, asiento, precio) VALUES
    ('e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9b', '2024-08-15 10:30:00', 'Juan Pérez García - 12345678Z', 45, '612345678', 'ES9121000418450200051332', 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'TB1/F15-A095', 550.00),
    ('f6a7b8c9-d0e1-4f5a-3b4c-5d6e7f8a9b0c', '2024-08-16 11:45:00', 'María López Ruiz - 87654321A', 10, '687654321', 'ES6500491500051234567892', 'c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f', 'FB3/F08-A042', 200.00),
    ('a7b8c9d0-e1f2-4a5b-4c5d-6e7f8a9b0c1d', '2024-08-17 14:20:00', 'Carlos Martínez Sánchez - 11223344B', 70, '698765432', 'ES7100810109876543210987', 'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e', 'PB2/F20-A120', 210.00);

-- ============================================================================
-- VERIFICACIÓN DE LA ESTRUCTURA
-- ============================================================================
-- Mostrar información de las tablas creadas
-- ============================================================================

SHOW TABLES;

-- ============================================================================
-- COMENTARIOS FINALES
-- ============================================================================
-- Este script crea la estructura completa de la base de datos para el sistema
-- de gestión de abonos del UD Almería.
--
-- Para ejecutar este script:
-- 1. Desde línea de comandos: mysql -u root -p < bbdd.sql
-- 2. Desde phpMyAdmin: Importar > Seleccionar archivo > Ejecutar
-- 3. Desde MySQL Workbench: File > Run SQL Script
--
-- Después de ejecutar este script:
-- 1. Verificar que las 3 tablas se crearon correctamente
-- 2. Comprobar que existen 3 tipos de abonos
-- 3. Verificar que existe el usuario 'uda'
-- 4. Configurar config.php con las credenciales correctas
-- 5. Probar la conexión ejecutando conexionbd.php
--
-- Seguridad:
-- - Las contraseñas están encriptadas con password_hash()
-- - Se usa charset utf8mb4 para soportar todos los caracteres
-- - Las claves foráneas garantizan integridad referencial
-- - Los campos asiento son únicos para evitar duplicados
-- ============================================================================
