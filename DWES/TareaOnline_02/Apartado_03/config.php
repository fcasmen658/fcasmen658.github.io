<?php
/**
 * Archivo: config.php
 * Descripción: Archivo de configuración con los datos de acceso a la base de datos
 * Este archivo contiene las credenciales y parámetros necesarios para conectarse
 * a la base de datos MySQL mediante PDO
 */

// ============================================================================
// CONFIGURACIÓN DE LA BASE DE DATOS
// ============================================================================

// Servidor/Host donde se encuentra la base de datos
define('DB_HOST', '127.0.0.1');

// Nombre de la base de datos
define('DB_NAME', 'uda');

// Usuario para acceder a la base de datos
define('DB_USER', 'root');

// Contraseña del usuario (en este caso vacía)
define('DB_PASS', '');

// Puerto de conexión (por defecto 3306 para MySQL)
define('DB_PORT', 3306);

// ============================================================================
// FIN DE CONFIGURACIÓN
// ============================================================================
?>
