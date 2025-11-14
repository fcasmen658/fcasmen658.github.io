<?php
// Variables para almacenar datos y errores
$errores = [];
$datos = [];
$mostrar_ticket = false;

// Función para validar DNI español
function validarDNI($dni) {
    $dni = strtoupper(trim($dni));
    
    // Verificar formato: 8 dígitos + 1 letra
    if (!preg_match('/^[0-9]{8}[A-Z]$/', $dni)) {
        return false;
    }
    
    // Extraer número y letra
    $numero = substr($dni, 0, 8);
    $letra = substr($dni, 8, 1);
    
    // Tabla de letras para validación
    $letras = "TRWAGMYFPDXBNJZSQVHLCKE";
    $letra_correcta = $letras[$numero % 23];
    
    return $letra === $letra_correcta;
}

// Función para validar fecha de nacimiento
function validarFechaNacimiento($fecha) {
    // Verificar que no esté vacía
    if (empty($fecha)) {
        return false;
    }
    
    // Verificar si es formato ISO (yyyy-mm-dd) del input type="date"
    if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $fecha)) {
        $partes = explode('-', $fecha);
        $año = (int)$partes[0];
        $mes = (int)$partes[1];
        $dia = (int)$partes[2];
    } else {
        // Formato dd/mm/yyyy
        $partes = explode('/', $fecha);
        if (count($partes) !== 3) {
            return false;
        }
        $dia = (int)$partes[0];
        $mes = (int)$partes[1];
        $año = (int)$partes[2];
    }
    
    // Verificar que la fecha sea válida
    if (!checkdate($mes, $dia, $año)) {
        return false;
    }
    
    // Calcular edad
    $fecha_nacimiento = new DateTime("$año-$mes-$dia");
    $hoy = new DateTime();
    $edad = $hoy->diff($fecha_nacimiento)->y;
    
    // Verificar restricciones de edad (4-85 años)
    if ($edad < 4 || $edad > 85) {
        return false;
    }
    
    return true;
}

// Función para calcular la edad
function calcularEdad($fecha) {
    // Verificar si es formato ISO (yyyy-mm-dd) del input type="date"
    if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $fecha)) {
        $partes = explode('-', $fecha);
        $año = (int)$partes[0];
        $mes = (int)$partes[1];
        $dia = (int)$partes[2];
    } else {
        // Formato dd/mm/yyyy
        $partes = explode('/', $fecha);
        if (count($partes) !== 3) {
            return 0;
        }
        $dia = (int)$partes[0];
        $mes = (int)$partes[1];
        $año = (int)$partes[2];
    }
    
    $fecha_nacimiento = new DateTime("$año-$mes-$dia");
    $hoy = new DateTime();
    return $hoy->diff($fecha_nacimiento)->y;
}

// Función para formatear fecha a dd/mm/yyyy para mostrar
function formatearFecha($fecha) {
    // Verificar si es formato ISO (yyyy-mm-dd) del input type="date"
    if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $fecha)) {
        $partes = explode('-', $fecha);
        $año = $partes[0];
        $mes = $partes[1];
        $dia = $partes[2];
        return "$dia/$mes/$año";
    } else {
        // Si ya está en formato dd/mm/yyyy, devolverla tal como está
        return $fecha;
    }
}

// Función para validar IBAN español
function validarIBAN($iban) {
    $iban = strtoupper(str_replace(' ', '', trim($iban)));
    
    // Verificar que empiece por ES y tenga 24 caracteres
    if (!preg_match('/^ES[0-9]{22}$/', $iban)) {
        return false;
    }
    
    // Algoritmo de validación IBAN
    $check = substr($iban, 2, 2);
    $cuenta = substr($iban, 4);
    $codigo_pais = '1428'; // ES = 1428
    
    $numero_completo = $cuenta . $codigo_pais . $check;
    
    // Calcular módulo 97
    $resto = 0;
    for ($i = 0; $i < strlen($numero_completo); $i++) {
        $resto = ($resto * 10 + intval($numero_completo[$i])) % 97;
    }
    
    return $resto === 1;
}

// Procesamiento del formulario
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    
    // Recoger datos del formulario
    $datos['nombre'] = trim($_POST['nombre'] ?? '');
    $datos['dni'] = trim($_POST['dni'] ?? '');
    $datos['fecha_nacimiento'] = trim($_POST['fecha_nacimiento'] ?? '');
    $datos['telefono'] = trim($_POST['telefono'] ?? '');
    $datos['cuenta_bancaria'] = trim($_POST['cuenta_bancaria'] ?? '');
    $datos['tipo_abono'] = $_POST['tipo_abono'] ?? '';
    $datos['terminos'] = isset($_POST['terminos']);
    
    // Validación del nombre y apellidos
    if (empty($datos['nombre'])) {
        $errores['nombre'] = "El nombre y apellidos no puede estar vacío.";
    } elseif (!preg_match('/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/', $datos['nombre'])) {
        $errores['nombre'] = "El nombre solo puede contener letras.";
    }
    
    // Validación del DNI
    if (empty($datos['dni'])) {
        $errores['dni'] = "El DNI no puede estar vacío.";
    } elseif (!validarDNI($datos['dni'])) {
        $errores['dni'] = "El DNI debe tener 8 dígitos y una letra válida (ej: 12345678Z).";
    }
    
    // Validación de la fecha de nacimiento
    if (empty($datos['fecha_nacimiento'])) {
        $errores['fecha_nacimiento'] = "La fecha de nacimiento no puede estar vacía.";
    } elseif (!validarFechaNacimiento($datos['fecha_nacimiento'])) {
        $errores['fecha_nacimiento'] = "La fecha debe ser válida (dd/mm/yyyy) y la edad entre 4 y 85 años.";
    }
    
    // Validación del teléfono
    if (empty($datos['telefono'])) {
        $errores['telefono'] = "El teléfono no puede estar vacío.";
    } elseif (!preg_match('/^[679][0-9]{8}$/', $datos['telefono'])) {
        $errores['telefono'] = "El teléfono debe tener 9 dígitos y empezar por 6, 7 o 9.";
    }
    
    // Validación de la cuenta bancaria
    if (empty($datos['cuenta_bancaria'])) {
        $errores['cuenta_bancaria'] = "La cuenta bancaria no puede estar vacía.";
    } elseif (!validarIBAN($datos['cuenta_bancaria'])) {
        $errores['cuenta_bancaria'] = "La cuenta bancaria debe ser un IBAN español válido (ej: ES91 2100 0418 4502 0005 1332).";
    }
    
    // Validación del tipo de abono
    if (empty($datos['tipo_abono'])) {
        $errores['tipo_abono'] = "Debe seleccionar un tipo de abono.";
    }
    
    // Validación de términos
    if (!$datos['terminos']) {
        $errores['terminos'] = "Debe aceptar los términos y condiciones.";
    }
    
    // Si no hay errores, mostrar el ticket
    if (empty($errores)) {
        $mostrar_ticket = true;
        
        // Determinar el precio y el nombre del abono
        $precio = 0;
        $abono_nombre = "No especificado";
        switch ($datos['tipo_abono']) {
            case 'tribuna':
                $precio = 500;
                $abono_nombre = "Tribuna";
                break;
            case 'preferencia':
                $precio = 300;
                $abono_nombre = "Preferencia";
                break;
            case 'fondo':
                $precio = 110;
                $abono_nombre = "Fondo";
                break;
        }
    }
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $mostrar_ticket ? 'Ticket de Compra' : 'Venta de Abonos'; ?> - UD Almería</title>
    <?php if (!$mostrar_ticket): ?>
    <link rel="stylesheet" href="styles/general.css">
    <style>
        /* Estilos adicionales para asegurar consistencia */
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
        .error-summary {
            background-color: #ffebee;
            border: 1px solid #d41c1c;
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 5px;
            text-align: left;
        }
        .error-summary strong {
            color: #d41c1c;
        }
        .error-summary ul {
            margin: 10px 0 0 20px;
            color: #d41c1c;
        }
        /* Mantener la consistencia del formulario */
        h1 {
            color: #d41c1c;
        }
    </style>
    <?php else: ?>
    <style>
        body {
            font-family: 'Courier New', Courier, monospace;
            background-color: #f4f4f4;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
            box-sizing: border-box;
        }
        .ticket {
            background-color: #fff;
            border: 2px dashed #d41c1c;
            padding: 25px;
            width: 100%;
            max-width: 400px;
            box-shadow: 0 0 15px rgba(0,0,0,0.1);
        }
        .ticket h2 {
            text-align: center;
            color: #d41c1c;
            margin-top: 0;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
        }
        .ticket p {
            margin: 10px 0;
            word-wrap: break-word;
        }
        .ticket .total {
            font-weight: bold;
            font-size: 1.2em;
            text-align: right;
            margin-top: 20px;
            border-top: 2px solid #333;
            padding-top: 10px;
        }
        .ticket .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 0.8em;
            color: #777;
        }
        .volver {
            text-align: center;
            margin-top: 20px;
        }
        .volver a {
            color: #d41c1c;
            text-decoration: none;
            padding: 10px 20px;
            border: 1px solid #d41c1c;
            border-radius: 3px;
        }
        .volver a:hover {
            background-color: #d41c1c;
            color: white;
        }
    </style>
    <?php endif; ?>
</head>
<body>

<?php if ($mostrar_ticket): ?>
    <!-- Mostrar ticket de compra -->
    <div class="ticket">
        <h2>Ticket de Compra</h2>
        <p><strong>Aficionado:</strong> <?php echo htmlspecialchars($datos['nombre']); ?></p>
        <p><strong>DNI:</strong> <?php echo htmlspecialchars($datos['dni']); ?></p>
        <p><strong>Fecha de Nacimiento:</strong> <?php echo formatearFecha($datos['fecha_nacimiento']); ?></p>
        <p><strong>Teléfono:</strong> <?php echo htmlspecialchars($datos['telefono']); ?></p>
        <p><strong>Cuenta Bancaria:</strong> <?php echo htmlspecialchars($datos['cuenta_bancaria']); ?></p>
        <p><strong>Tipo de Abono:</strong> <?php echo $abono_nombre; ?></p>
        <p><strong>Términos:</strong> Aceptados</p>
        <p class="total">Total: <?php echo $precio; ?>€</p>
        <p class="footer">¡Gracias por su compra!</p>
        <p class="footer">Fecha de emisión: <?php echo date('d/m/Y H:i:s'); ?></p>
        <div class="volver">
            <a href="<?php echo $_SERVER['PHP_SELF']; ?>">← Volver al formulario</a>
        </div>
    </div>

<?php else: ?>
    <!-- Mostrar formulario -->
    <div class="container">
        <img src="img/logo.png" alt="Logo UD Almería" class="logo">
        <h1>Venta de Abonos UD Almería</h1>

        <?php if (!empty($errores)): ?>
        <div class="error-summary">
            <strong>Por favor, corrija los siguientes errores:</strong>
            <ul>
                <?php foreach ($errores as $error): ?>
                <li><?php echo $error; ?></li>
                <?php endforeach; ?>
            </ul>
        </div>
        <?php endif; ?>

        <form method="post" action="<?php echo $_SERVER['PHP_SELF']; ?>">
            <label for="nombre">Nombre y apellidos:</label>
            <input type="text" 
                id="nombre" 
                name="nombre" 
                placeholder="Juan Pérez García"
                value="<?php echo htmlspecialchars($datos['nombre'] ?? ''); ?>"
                class="<?php echo isset($errores['nombre']) ? 'campo-error' : ''; ?>"
                required>
            <?php if (isset($errores['nombre'])): ?>
                <span class="error"><?php echo $errores['nombre']; ?></span>
            <?php endif; ?>

            <label for="dni">DNI:</label>
            <input type="text" 
                id="dni" 
                name="dni" 
                placeholder="12345678Z"
                value="<?php echo htmlspecialchars($datos['dni'] ?? ''); ?>"
                class="<?php echo isset($errores['dni']) ? 'campo-error' : ''; ?>"
                required>
            <?php if (isset($errores['dni'])): ?>
                <span class="error"><?php echo $errores['dni']; ?></span>
            <?php endif; ?>

            <label for="fecha_nacimiento">Fecha de nacimiento (dd/mm/yyyy):</label>
            <input type="date" 
                id="fecha_nacimiento" 
                name="fecha_nacimiento" 
                placeholder="01/01/1990"
                value="<?php echo htmlspecialchars($datos['fecha_nacimiento'] ?? ''); ?>"
                class="<?php echo isset($errores['fecha_nacimiento']) ? 'campo-error' : ''; ?>"
                required>
            <?php if (isset($errores['fecha_nacimiento'])): ?>
                <span class="error"><?php echo $errores['fecha_nacimiento']; ?></span>
            <?php endif; ?>

            <label for="telefono">Teléfono:</label>
            <input type="tel" 
                id="telefono" 
                name="telefono" 
                placeholder="612345678"
                value="<?php echo htmlspecialchars($datos['telefono'] ?? ''); ?>"
                class="<?php echo isset($errores['telefono']) ? 'campo-error' : ''; ?>"
                required>
            <?php if (isset($errores['telefono'])): ?>
                <span class="error"><?php echo $errores['telefono']; ?></span>
            <?php endif; ?>

            <label for="cuenta_bancaria">Cuenta bancaria (IBAN):</label>
            <input type="text" 
                id="cuenta_bancaria" 
                name="cuenta_bancaria" 
                placeholder="ES91 2100 0418 4502 0005 1332"
                value="<?php echo htmlspecialchars($datos['cuenta_bancaria'] ?? ''); ?>"
                class="<?php echo isset($errores['cuenta_bancaria']) ? 'campo-error' : ''; ?>"
                required>
            <?php if (isset($errores['cuenta_bancaria'])): ?>
                <span class="error"><?php echo $errores['cuenta_bancaria']; ?></span>
            <?php endif; ?>

            <label for="tipo_abono">Tipo de abono:</label>
            <select id="tipo_abono" 
                    name="tipo_abono" 
                    class="<?php echo isset($errores['tipo_abono']) ? 'campo-error' : ''; ?>"
                    required>
                <option value="">Seleccione un tipo de abono</option>
                <option value="tribuna" <?php echo ($datos['tipo_abono'] ?? '') === 'tribuna' ? 'selected' : ''; ?>>Tribuna (500€)</option>
                <option value="preferencia" <?php echo ($datos['tipo_abono'] ?? '') === 'preferencia' ? 'selected' : ''; ?>>Preferencia (300€)</option>
                <option value="fondo" <?php echo ($datos['tipo_abono'] ?? '') === 'fondo' ? 'selected' : ''; ?>>Fondo (110€)</option>
            </select>
            <?php if (isset($errores['tipo_abono'])): ?>
                <span class="error"><?php echo $errores['tipo_abono']; ?></span>
            <?php endif; ?>

            <div class="terminos">
                <input type="checkbox" 
                    id="terminos" 
                    name="terminos" 
                    <?php echo ($datos['terminos'] ?? false) ? 'checked' : ''; ?>
                    class="<?php echo isset($errores['terminos']) ? 'campo-error' : ''; ?>"
                    required>
                <label for="terminos">Acepto términos y condiciones</label>
                <?php if (isset($errores['terminos'])): ?>
                    <span class="error"><?php echo $errores['terminos']; ?></span>
                <?php endif; ?>
            </div>

            <button type="submit">Comprar</button>
        </form>
    </div>

<?php endif; ?>

</body>
</html>