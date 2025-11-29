<?php
/**
 * Archivo: conexionbd.php
 * Descripción: Archivo que establece la conexión a la base de datos mediante PDO
 * Incluye manejo de errores y configuración de atributos PDO
 * Requiere: config.php (incluye las credenciales de conexión)
 */

// ============================================================================
// INCLUSIÓN DEL ARCHIVO DE CONFIGURACIÓN
// ============================================================================

// Incluir el archivo de configuración que contiene los datos de conexión
require 'config.php';

// ============================================================================
// ESTABLECIMIENTO DE LA CONEXIÓN A LA BASE DE DATOS
// ============================================================================

try {
    /**
     * Crear una nueva instancia de PDO
     * Parámetros:
     * 1. DSN (Data Source Name): especifica el tipo de BD, host, puerto y nombre de la BD
     * 2. Usuario: credencial de acceso a la BD
     * 3. Contraseña: credencial de acceso a la BD
     * 4. Opciones: array con configuraciones adicionales
     */
    $pdo = new PDO(
        // DSN: mysql:host=servidor;port=puerto;dbname=nombreBD;charset=codificación
        'mysql:host=' . DB_HOST . ';port=' . DB_PORT . ';dbname=' . DB_NAME . ';charset=utf8mb4',
        // Usuario de la base de datos
        DB_USER,
        // Contraseña de la base de datos
        DB_PASS,
        // Opciones de configuración de PDO
        array(
            // Lanzar excepciones en caso de error
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            // Obtener resultados como arrays asociativos
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            // Emular prepared statements (compatibilidad)
            PDO::ATTR_EMULATE_PREPARES => false
        )
    );
    
    // ========================================================================
    // CONFIRMACIÓN DE CONEXIÓN EXITOSA
    // ========================================================================
    // Si llegamos aquí, la conexión fue establecida correctamente
    // El objeto $pdo está disponible para usarse en el resto del script
    
} catch (PDOException $e) {
    /**
     * MANEJO DE ERRORES
     * Si hay un error en la conexión, se captura la excepción PDOException
     */
    
    // Mostrar mensaje de error al usuario (evitar exponer detalles sensibles en producción)
    die('Error de conexión a la base de datos: ' . htmlspecialchars($e->getMessage()));
    
    // En producción, se recomienda:
    // - Registrar el error en un archivo de log
    // - Mostrar un mensaje genérico al usuario
    // - No mostrar detalles técnicos en la pantalla
}

// ============================================================================
// FIN DE CONEXIÓN A LA BASE DE DATOS
// ============================================================================
?>
