<?php
/**
 * Archivo: listadoabonos.php
 * Descripción: Página de listado de todos los abonos vendidos
 * Funcionalidades:
 * - Mostrar tabla de abonos comprados
 * - Mostrar información de asiento, abonado, teléfono, banco, tarifa y precio
 * - Incluir iconos y tooltips para mejor usabilidad
 * - Mostrar estadísticas totales (cantidad y recaudación)
 * Requiere: config.php, conexionbd.php
 * PROTEGIDO: Requiere autenticación de usuario
 */

// ============================================================================
// PROTECCIÓN DE ACCESO - VERIFICACIÓN DE SESIÓN
// ============================================================================

// Configuración de seguridad de sesión
ini_set('session.cookie_httponly', 1);
ini_set('session.use_only_cookies', 1);
ini_set('session.cookie_secure', 0); // Cambiar a 1 si se usa HTTPS

// Iniciar sesión
session_start();

// Variable para controlar si el usuario tiene acceso
$acceso_permitido = false;
$mensaje_acceso_denegado = '';

// Verificar si el usuario está autenticado
if (!isset($_SESSION['usuario_autenticado']) || $_SESSION['usuario_autenticado'] !== true) {
    // Acceso denegado - no hay sesión válida
    $acceso_permitido = false;
    $mensaje_acceso_denegado = 'Acceso denegado. No tiene permiso para acceder a esta información.';
} else {
    // Verificaciones adicionales de seguridad
    
    // 1. Verificar que existe el ID de usuario en la sesión
    if (!isset($_SESSION['usuario_id']) || empty($_SESSION['usuario_id'])) {
        $acceso_permitido = false;
        $mensaje_acceso_denegado = 'Sesión inválida. Por favor, inicie sesión nuevamente.';
        // Destruir sesión corrupta
        session_destroy();
    }
    // 2. Verificar que existe el username en la sesión
    elseif (!isset($_SESSION['usuario_username']) || empty($_SESSION['usuario_username'])) {
        $acceso_permitido = false;
        $mensaje_acceso_denegado = 'Sesión inválida. Por favor, inicie sesión nuevamente.';
        // Destruir sesión corrupta
        session_destroy();
    }
    // 3. Verificación de tiempo de inactividad (30 minutos)
    elseif (isset($_SESSION['ultimo_acceso']) && (time() - $_SESSION['ultimo_acceso'] > 1800)) {
        $acceso_permitido = false;
        $mensaje_acceso_denegado = 'Su sesión ha expirado por inactividad. Por favor, inicie sesión nuevamente.';
        // Destruir sesión expirada
        session_destroy();
    }
    // 4. Verificación de IP (protección contra secuestro de sesión)
    elseif (isset($_SESSION['ip_usuario']) && $_SESSION['ip_usuario'] !== $_SERVER['REMOTE_ADDR']) {
        $acceso_permitido = false;
        $mensaje_acceso_denegado = 'Sesión inválida detectada. Por favor, inicie sesión nuevamente.';
        // Destruir sesión comprometida
        session_destroy();
    }
    // 5. Verificación de User Agent (protección adicional)
    elseif (isset($_SESSION['user_agent']) && $_SESSION['user_agent'] !== $_SERVER['HTTP_USER_AGENT']) {
        $acceso_permitido = false;
        $mensaje_acceso_denegado = 'Sesión inválida detectada. Por favor, inicie sesión nuevamente.';
        // Destruir sesión comprometida
        session_destroy();
    }
    // Todas las verificaciones pasadas
    else {
        $acceso_permitido = true;
        // Actualizar tiempo de último acceso
        $_SESSION['ultimo_acceso'] = time();
    }
}

// ============================================================================
// INCLUSIÓN DE ARCHIVOS DE CONFIGURACIÓN Y CONEXIÓN
// ============================================================================

// Variables para datos
$abonos = [];
$error = null;

// Solo cargar datos si el acceso está permitido
if ($acceso_permitido) {
    // Incluir el archivo de conexión a la base de datos (que a su vez incluye config.php)
    require_once __DIR__ . '/conexionbd.php'; // define $pdo

    // ============================================================================
    // OBTENER LISTADO DE ABONOS DE LA BASE DE DATOS
    // ============================================================================

    // Obtener todos los abonos ordenados por asiento descendente (Z a A)
    try {
    /**
     * Consulta JOIN para obtener datos de abonos y sus tipos asociados
     * SELECT: Campos de la tabla abonos y el nombre del tipo de la tabla tipo_abonos
     * FROM: tabla abonos (a)
     * LEFT JOIN: tabla tipo_abonos (ta) para obtener la descripción del tipo
     * ORDER BY: Ordenado por asiento en orden descendente
     */
    $stmt = $pdo->query("
        SELECT 
            a.id,
            a.fecha,
            a.abonado,
            a.edad,
            a.telefono,
            a.cuenta_bancaria,
            a.tipo,
            a.asiento,
            a.precio,
            ta.descripcion as tipo_nombre
        FROM abonos a
        LEFT JOIN tipo_abonos ta ON a.tipo = ta.id
        ORDER BY a.asiento DESC
    ");
    
    // Obtener todos los resultados como array asociativo
    $abonos = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (Exception $e) {
        // En caso de error, inicializar array vacío y guardar el mensaje de error
        $abonos = [];
        $error = "Error al obtener los abonos: " . $e->getMessage();
    }
} // Fin del if ($acceso_permitido)

// ============================================================================
// FUNCIONES AUXILIARES
// ============================================================================

/**
 * Función: obtenerIconoTipo
 * Descripción: Retorna el icono y información del tipo de abono
 * Parámetros: $tipo_nombre (string) - Nombre del tipo de abono
 * Retorna: array - [icono, clase_css, nombre_tipo]
 */
function obtenerIconoTipo($tipo_nombre) {
    // Convertir a minúsculas para búsqueda insensible a mayúsculas
    $tipo = strtolower($tipo_nombre);
    
    // Asignar icono según el tipo de abono
    if (strpos($tipo, 'tribuna') !== false) {
        return ['🥇', 'oro', 'Tribuna'];
    } elseif (strpos($tipo, 'preferencia') !== false) {
        return ['🥈', 'plata', 'Preferencia'];
    } else {
        return ['🥉', 'bronce', 'Fondo'];
    }
}

/**
 * Función: obtenerTarifaEspecial
 * Descripción: Determina si el abonado tiene tarifa especial según su edad
 * - Mayores de 65 años: Tarifa Jubilado/a
 * - Menores de 12 años: Tarifa Niño/a
 * - Otros: Tarifa Normal
 * Parámetros: $edad (integer) - Edad del abonado
 * Retorna: array - [texto_tarifa, clase_css]
 */
function obtenerTarifaEspecial($edad) {
    // Comprobar si es pensionista (edad > 65)
    if ($edad > 65) {
        return ['Tarifa Jubilado/a', 'jubilado'];
    } 
    // Comprobar si es niño (edad < 12)
    elseif ($edad < 12) {
        return ['Tarifa Niño/a', 'nino'];
    }
    // Caso normal: sin descuento
    return ['Tarifa Normal', 'normal'];
}

?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Listado de Abonos - UD Almería</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 40px 20px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
        }

        .header {
            background: white;
            padding: 30px;
            border-radius: 10px;
            margin-bottom: 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            text-align: center;
        }

        .header h1 {
            color: #d41c1c;
            margin-bottom: 10px;
            font-size: 2.5em;
        }

        .header p {
            color: #666;
            font-size: 1.1em;
        }

        .info-total {
            background: white;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .info-total p {
            color: #333;
            font-size: 1.1em;
            margin-bottom: 10px;
        }

        .info-total strong {
            color: #d41c1c;
            font-size: 1.3em;
        }

        .error {
            background: #ffebee;
            color: #d41c1c;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 30px;
            border-left: 5px solid #d41c1c;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border-radius: 10px;
            overflow: hidden;
            table-layout: fixed;
        }

        thead {
            background: #d41c1c;
            color: white;
        }

        th {
            padding: 20px;
            text-align: left;
            font-weight: 600;
            border-bottom: 2px solid #d41c1c;
        }

        td {
            padding: 15px 20px;
            border-bottom: 1px solid #eee;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        tr:hover {
            background-color: #f9f9f9;
        }

        thead tr:hover {
            background-color: #d41c1c !important;
        }

        tr:last-child td {
            border-bottom: none;
        }

        .tipo-icon {
            font-size: 1.5em;
            text-align: center;
            width: 40px;
        }

        .asiento-code {
            font-family: 'Courier New', monospace;
            font-weight: bold;
            color: #d41c1c;
            font-size: 1.1em;
        }

        .abonado-info {
            font-weight: 500;
            color: #333;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: block;
        }

        .icon-button {
            cursor: help;
            font-size: 1.3em;
            display: inline-block;
            padding: 5px;
            border-radius: 5px;
            transition: all 0.3s ease;
        }

        .icon-button:hover {
            background-color: #f0f0f0;
            transform: scale(1.1);
        }

        .tarifa-especial {
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 0.9em;
            font-weight: 600;
            text-align: center;
        }

        .tarifa-jubilado {
            background-color: #e3f2fd;
            color: #1565c0;
        }

        .tarifa-nino {
            background-color: #f3e5f5;
            color: #6a1b9a;
        }

        .tarifa-normal {
            background-color: #f0f0f0;
            color: #666;
        }

        .precio {
            font-weight: bold;
            color: #27ae60;
            font-size: 1.1em;
        }

        .volver {
            text-align: center;
            margin-top: 30px;
        }

        .volver a {
            display: inline-block;
            background: white;
            color: #d41c1c;
            padding: 12px 30px;
            border-radius: 5px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .volver a:hover {
            background: #d41c1c;
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
        }

        .no-data {
            background: white;
            padding: 40px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .no-data h2 {
            color: #666;
            margin-bottom: 20px;
        }

        .no-data p {
            color: #999;
            font-size: 1.1em;
        }

        .usuario-info {
            background: #f8f9fa;
            padding: 10px 20px;
            border-radius: 5px;
            margin-top: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .usuario-info span {
            color: #666;
            font-size: 0.9em;
        }

        .btn-logout {
            background: #d41c1c;
            color: white;
            padding: 8px 20px;
            border-radius: 5px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
        }

        .btn-logout:hover {
            background: #b01515;
        }

        .acceso-denegado {
            background: white;
            padding: 60px 40px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            max-width: 600px;
            margin: 100px auto;
        }

        .acceso-denegado .icono {
            font-size: 5em;
            margin-bottom: 20px;
        }

        .acceso-denegado h2 {
            color: #d41c1c;
            margin-bottom: 20px;
            font-size: 2em;
        }

        .acceso-denegado p {
            color: #666;
            font-size: 1.2em;
            margin-bottom: 30px;
            line-height: 1.6;
        }

        .acceso-denegado .btn-login {
            display: inline-block;
            background: #d41c1c;
            color: white;
            padding: 15px 40px;
            border-radius: 5px;
            text-decoration: none;
            font-weight: 600;
            font-size: 1.1em;
            transition: all 0.3s ease;
        }

        .acceso-denegado .btn-login:hover {
            background: #b01515;
            transform: translateY(-2px);
            box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
        }
    </style>
</head>
<body>

<div class="container">
    <?php if (!$acceso_permitido): ?>
        <!-- Mensaje de Acceso Denegado -->
        <div class="acceso-denegado">
            <div class="icono">🔒</div>
            <h2>Acceso Denegado</h2>
            <p><?php echo htmlspecialchars($mensaje_acceso_denegado, ENT_QUOTES, 'UTF-8'); ?></p>
            <p style="font-size: 0.95em; color: #999;">
                Para ver el listado de abonos vendidos debe autenticarse como encargado de la empresa.
            </p>
            <a href="login.php" class="btn-login">🔐 Ir al Login</a>
        </div>
    <?php else: ?>
        <!-- Contenido protegido - Solo visible si está autenticado -->
        <div class="header">
            <h1>📋 Listado de Abonos</h1>
            <p>UD Almería - Sistema de Gestión de Abonos</p>
            <div class="usuario-info">
                <span>👤 Usuario: <strong><?php echo htmlspecialchars($_SESSION['usuario_username'], ENT_QUOTES, 'UTF-8'); ?></strong></span>
                <a href="logout.php" class="btn-logout">🚪 Cerrar Sesión</a>
            </div>
        </div>

    <?php if (isset($error)): ?>
        <div class="error">
            <strong>Error:</strong> <?php echo htmlspecialchars($error); ?>
        </div>
    <?php endif; ?>

    <?php if (count($abonos) > 0): ?>
        <div class="info-total">
            <p>Total de abonos solicitados: <strong><?php echo count($abonos); ?></strong></p>
            <p>Recaudación total: <strong><?php echo number_format(array_sum(array_column($abonos, 'precio')), 2); ?>€</strong></p>
        </div>

        <table>
            <thead>
                <tr>
                    <th style="width: 50px; text-align: center;">Tipo</th>
                    <th style="width: 130px;">Asiento</th>
                    <th style="width: 200px;">Abonado</th>
                    <th style="width: 50px; text-align: center;">Teléfono</th>
                    <th style="width: 50px; text-align: center;">Banco</th>
                    <th style="width: 130px;">Tarifa Especial</th>
                    <th style="width: 90px; text-align: right;">Precio</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($abonos as $abono): ?>
                    <?php
                        list($icono, $clase, $nombre) = obtenerIconoTipo($abono['tipo_nombre']);
                        list($tarifa_texto, $tarifa_clase) = obtenerTarifaEspecial($abono['edad']);
                    ?>
                    <tr>
                        <td class="tipo-icon" title="<?php echo htmlspecialchars($nombre); ?>">
                            <?php echo $icono; ?>
                        </td>
                        <td class="asiento-code"><?php echo htmlspecialchars($abono['asiento']); ?></td>
                        <td class="abonado-info"><?php echo htmlspecialchars($abono['abonado']); ?></td>
                        <td style="text-align: center;">
                            <span class="icon-button" title="<?php echo htmlspecialchars($abono['telefono']); ?>">
                                ☎️
                            </span>
                        </td>
                        <td style="text-align: center;">
                            <span class="icon-button" title="<?php echo htmlspecialchars($abono['cuenta_bancaria']); ?>">
                                🏦
                            </span>
                        </td>
                        <td>
                            <span class="tarifa-especial tarifa-<?php echo $tarifa_clase; ?>">
                                <?php echo htmlspecialchars($tarifa_texto); ?>
                            </span>
                        </td>
                        <td class="precio" style="text-align: right;">
                            <?php echo number_format($abono['precio'], 2); ?>€
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    <?php else: ?>
        <div class="no-data">
            <h2>No hay abonos registrados</h2>
            <p>Aún no se han solicitado abonos en el sistema.</p>
        </div>
    <?php endif; ?>

        <div class="volver">
            <a href="compra_abono.php">← Volver al formulario de compra</a>
        </div>
    <?php endif; ?>
</div>

</body>
</html>
