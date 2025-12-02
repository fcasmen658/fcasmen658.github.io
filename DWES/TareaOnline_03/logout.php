<?php
/**
 * Archivo: logout.php
 * Descripción: Script para cerrar sesión del usuario
 * Funcionalidades:
 * - Destruir sesión activa
 * - Redirigir al login
 */

// Iniciar sesión
session_start();

// Destruir todas las variables de sesión
$_SESSION = [];

// Si se desea destruir la sesión completamente, también se debe borrar la cookie de sesión
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// Destruir la sesión
session_destroy();

// Redirigir al login
header('Location: login.php');
exit;
?>
