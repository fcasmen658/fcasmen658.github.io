<?php
/**
 * Archivo: init_usuarios.php
 * Descripción: Script de inicialización para crear la tabla usuarios
 * y agregar el usuario encargado predeterminado
 * Ejecutar una sola vez para configurar la base de datos
 */

require_once __DIR__ . '/conexionbd.php';

try {
    // Crear tabla usuarios si no existe
    $sql_create_table = "
        CREATE TABLE IF NOT EXISTS usuarios (
            id VARCHAR(36) PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL
        )
    ";
    
    $pdo->exec($sql_create_table);
    echo "[OK] Tabla 'usuarios' creada correctamente.<br>";
    
    // Comprobar si ya existe el usuario 'uda'
    $stmt = $pdo->prepare("SELECT COUNT(*) as total FROM usuarios WHERE username = :username");
    $stmt->execute([':username' => 'uda']);
    $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($resultado['total'] > 0) {
        echo "[AVISO] El usuario 'uda' ya existe en la base de datos.<br>";
    } else {
        // Generar UUID v4 para el usuario
        $id = sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            mt_rand(0, 0xffff), mt_rand(0, 0xffff),
            mt_rand(0, 0xffff),
            mt_rand(0, 0x0fff) | 0x4000,
            mt_rand(0, 0x3fff) | 0x8000,
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
        );
        
        // Encriptar la contraseña usando password_hash
        $password_encriptada = password_hash('1234', PASSWORD_DEFAULT);
        
        // Insertar el usuario encargado
        $stmt = $pdo->prepare("INSERT INTO usuarios (id, username, password) VALUES (:id, :username, :password)");
        $stmt->execute([
            ':id' => $id,
            ':username' => 'uda',
            ':password' => $password_encriptada
        ]);
        
        echo "[OK] Usuario encargado 'uda' creado correctamente.<br>";
        echo "  - Username: uda<br>";
        echo "  - Password: 1234 (encriptada)<br>";
    }
    
    echo "<br><strong>[OK] Inicialización completada exitosamente.</strong><br>";
    echo "<br><a href='login.php'>Ir al login</a>";
    
} catch (PDOException $e) {
    echo "[ERROR] Error al inicializar la base de datos: " . htmlspecialchars($e->getMessage(), ENT_QUOTES, 'UTF-8');
}
?>
