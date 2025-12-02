<?php
/**
 * Archivo: login.php
 * Descripción: Script de autenticación para el encargado
 * Funcionalidades:
 * - Mostrar formulario de login
 * - Validar campos no vacíos
 * - Autenticar con base de datos
 * - Redirigir al listado si es correcto o mostrar error
 */

// Iniciar sesión al principio del script
session_start();

// Si ya está autenticado, redirigir directamente al listado
if (isset($_SESSION['usuario_autenticado']) && $_SESSION['usuario_autenticado'] === true) {
    header('Location: listadoabonos.php');
    exit;
}

// Incluir conexión a la base de datos
require_once __DIR__ . '/conexionbd.php';

// Variables para el formulario
$errores = [];
$mensaje_error = '';
$username = '';

// Procesar el formulario si se envió por POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // Recoger datos del formulario
    $username = isset($_POST['username']) ? trim($_POST['username']) : '';
    $password = isset($_POST['password']) ? trim($_POST['password']) : '';
    
    // Validaciones
    if (empty($username)) {
        $errores['username'] = 'El nombre de usuario no puede estar vacío.';
    }
    
    if (empty($password)) {
        $errores['password'] = 'La contraseña no puede estar vacía.';
    }
    
    // Si no hay errores de validación, verificar credenciales
    if (empty($errores)) {
        try {
            // Buscar usuario en la base de datos
            $stmt = $pdo->prepare("SELECT id, username, password FROM usuarios WHERE username = :username");
            $stmt->execute([':username' => $username]);
            $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
            
            // Verificar si existe el usuario y si la contraseña es correcta
            if ($usuario && password_verify($password, $usuario['password'])) {
                // Autenticación exitosa
                // Regenerar ID de sesión por seguridad (protección contra fijación de sesión)
                session_regenerate_id(true);
                
                // Guardar datos en la sesión
                $_SESSION['usuario_autenticado'] = true;
                $_SESSION['usuario_id'] = $usuario['id'];
                $_SESSION['usuario_username'] = $usuario['username'];
                $_SESSION['ultimo_acceso'] = time(); // Timestamp para control de inactividad
                $_SESSION['ip_usuario'] = $_SERVER['REMOTE_ADDR']; // IP para verificación adicional
                $_SESSION['user_agent'] = $_SERVER['HTTP_USER_AGENT']; // User agent para verificación
                
                // Redirigir al listado de abonos
                header('Location: listadoabonos.php');
                exit;
            } else {
                // Credenciales incorrectas
                $mensaje_error = 'Usuario o contraseña incorrectos. Por favor, inténtelo de nuevo.';
            }
            
        } catch (PDOException $e) {
            $mensaje_error = 'Error al conectar con la base de datos. Inténtelo más tarde.';
        }
    }
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - UD Almería</title>
    <link rel="stylesheet" href="styles/general.css">
    <style>
        .login-container {
            max-width: 400px;
            margin: 50px auto;
            padding: 30px;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .login-container h1 {
            text-align: center;
            color: #d41c1c;
            margin-bottom: 10px;
        }
        
        .login-container .subtitle {
            text-align: center;
            color: #666;
            margin-bottom: 30px;
            font-size: 0.9em;
        }
        
        .error {
            color: #d41c1c;
            font-size: 0.9em;
            margin-top: 5px;
            display: block;
        }
        
        .campo-error {
            border-color: #d41c1c !important;
            border-width: 2px !important;
        }
        
        .mensaje-error {
            background-color: #ffebee;
            border: 1px solid #d41c1c;
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 5px;
            color: #d41c1c;
            text-align: center;
        }
        
        .login-container label {
            display: block;
            margin-bottom: 8px;
            color: #333;
            font-weight: bold;
        }
        
        .login-container input[type="text"],
        .login-container input[type="password"] {
            width: 100%;
            padding: 12px;
            margin-bottom: 5px;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box;
            font-size: 14px;
        }
        
        .login-container input[type="text"]:focus,
        .login-container input[type="password"]:focus {
            outline: none;
            border-color: #d41c1c;
        }
        
        .login-container button {
            width: 100%;
            padding: 12px;
            background-color: #d41c1c;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            margin-top: 20px;
        }
        
        .login-container button:hover {
            background-color: #b01515;
        }
        
        .volver-inicio {
            text-align: center;
            margin-top: 20px;
        }
        
        .volver-inicio a {
            color: #666;
            text-decoration: none;
            font-size: 0.9em;
        }
        
        .volver-inicio a:hover {
            color: #d41c1c;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <img src="img/logo.png" alt="Logo UD Almería" style="display: block; margin: 0 auto 20px; max-width: 150px;">
        <h1>Acceso Encargado</h1>
        <p class="subtitle">Sistema de Gestión de Abonos</p>
        
        <?php if (!empty($mensaje_error)): ?>
        <div class="mensaje-error">
            <?php echo htmlspecialchars($mensaje_error, ENT_QUOTES, 'UTF-8'); ?>
        </div>
        <?php endif; ?>
        
        <form method="post" action="<?php echo htmlspecialchars($_SERVER['PHP_SELF'], ENT_QUOTES, 'UTF-8'); ?>">
            <div>
                <label for="username">Usuario:</label>
                <input type="text" 
                    id="username" 
                    name="username" 
                    placeholder="Ingrese su usuario"
                    value="<?php echo htmlspecialchars($username, ENT_QUOTES, 'UTF-8'); ?>"
                    class="<?php echo isset($errores['username']) ? 'campo-error' : ''; ?>"
                    autofocus>
                <?php if (isset($errores['username'])): ?>
                    <span class="error"><?php echo htmlspecialchars($errores['username'], ENT_QUOTES, 'UTF-8'); ?></span>
                <?php endif; ?>
            </div>
            
            <div style="margin-top: 20px;">
                <label for="password">Contraseña:</label>
                <input type="password" 
                    id="password" 
                    name="password" 
                    placeholder="Ingrese su contraseña"
                    class="<?php echo isset($errores['password']) ? 'campo-error' : ''; ?>">
                <?php if (isset($errores['password'])): ?>
                    <span class="error"><?php echo htmlspecialchars($errores['password'], ENT_QUOTES, 'UTF-8'); ?></span>
                <?php endif; ?>
            </div>
            
            <button type="submit">Iniciar Sesión</button>
        </form>
        
        <div class="volver-inicio">
            <a href="compra_abono.php">&larr; Volver a compra de abonos</a>
        </div>
    </div>
</body>
</html>
