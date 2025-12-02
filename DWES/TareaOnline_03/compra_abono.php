<?php
/**
 * Archivo: compra_abono.php
 * Descripción: Script principal para la venta de abonos de UD Almería
 * Funcionalidades:
 * - Mostrar formulario de compra de abonos
 * - Validar datos del formulario (DNI, fecha, teléfono, IBAN)
 * - Generar código de asiento único
 * - Guardar datos en la base de datos
 * - Mostrar ticket de compra
 * Requiere: config.php, conexionbd.php
 */

// ============================================================================
// INICIALIZACIÓN DE VARIABLES
// ============================================================================

// Array para almacenar mensajes de error de validación
$errores = [];

// Array para almacenar los datos del formulario
$datos = [];

// Bandera para controlar si se debe mostrar el ticket o el formulario
$mostrar_ticket = false;

// ============================================================================
// INCLUSIÓN DE ARCHIVOS DE CONFIGURACIÓN Y CONEXIÓN
// ============================================================================

// Incluir el archivo de conexión a la base de datos (que a su vez incluye config.php)
require_once __DIR__ . '/conexionbd.php'; // define $pdo

// ============================================================================
// PRECARGA DE DATOS DESDE COOKIES (para agilizar futuras compras)
// ============================================================================
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    // Precargar desde cookies si existen
    $datos['nombre'] = $_COOKIE['abonado_nombre'] ?? '';
    $datos['dni'] = $_COOKIE['abonado_dni'] ?? '';
    $datos['fecha_nacimiento'] = $_COOKIE['abonado_fecha_nacimiento'] ?? '';
    $datos['telefono'] = $_COOKIE['abonado_telefono'] ?? '';
    $datos['cuenta_bancaria'] = $_COOKIE['abonado_cuenta_bancaria'] ?? '';
}

// ============================================================================
// CARGAR TIPOS DE ABONO DESDE LA BASE DE DATOS
// ============================================================================

// Cargar tipos de abono (id, descripcion, precio) para el select dinámico
try {
    /**
     * Ejecutar consulta SELECT para obtener todos los tipos de abono
     * Campos: id (UUID), descripcion (nombre del tipo), precio (DECIMAL)
     * Ordenado alfabéticamente por descripción
     */
    $stmt = $pdo->query("SELECT id, descripcion, precio FROM tipo_abonos ORDER BY descripcion");
    
    // Obtener todos los resultados como array asociativo
    $tipo_abonos = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (Exception $e) {
    /**
     * Si hay error en la consulta, inicializar array vacío
     * Esto permite que el formulario siga funcionando aunque falle la BD
     */
    $tipo_abonos = [];
}

// ============================================================================
// FUNCIONES DE VALIDACIÓN
// ============================================================================

/**
 * Función: validarDNI
 * Descripción: Valida un DNI español verificando formato y dígito de control
 * Parámetros: $dni (string) - DNI a validar
 * Retorna: boolean - true si es válido, false en caso contrario
 */
function validarDNI($dni) {
    // Convertir a mayúsculas y eliminar espacios
    $dni = strtoupper(trim($dni));
    
    // Verificar formato DNI: exactamente 8 dígitos + 1 letra mayúscula
    if (!preg_match('/^[0-9]{8}[A-Z]$/', $dni)) {
        return false;
    }
    
    // Extraer la parte numérica (primeros 8 caracteres)
    $numero = substr($dni, 0, 8);
    
    // Extraer la letra (último carácter)
    $letra = substr($dni, 8, 1);
    
    // Tabla oficial de letras para validación de DNI
    // Se calcula haciendo módulo 23 del número
    $letras = "TRWAGMYFPDXBNJZSQVHLCKE";
    
    // Obtener la letra correcta según el algoritmo
    $letra_correcta = $letras[$numero % 23];
    
    // Comparar la letra proporcionada con la calculada
    return $letra === $letra_correcta;
}

/**
 * Función: validarFechaNacimiento
 * Descripción: Valida una fecha de nacimiento y verifica que la edad esté entre 4 y 85 años
 * Parámetros: $fecha (string) - Fecha en formato YYYY-MM-DD o DD/MM/YYYY
 * Retorna: boolean - true si es válida y la edad está en rango, false en caso contrario
 */
function validarFechaNacimiento($fecha) {
    // Verificar que el parámetro no esté vacío
    if (empty($fecha)) {
        return false;
    }
    
    // Detectar formato de fecha y extraer componentes (año, mes, día)
    // Formato ISO (YYYY-MM-DD) del input type="date" de HTML5
    if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $fecha)) {
        $partes = explode('-', $fecha);
        $año = (int)$partes[0];
        $mes = (int)$partes[1];
        $dia = (int)$partes[2];
    } else {
        // Intentar formato DD/MM/YYYY (entrada manual del usuario)
        $partes = explode('/', $fecha);
        
        // Verificar que se obtuvieron exactamente 3 partes
        if (count($partes) !== 3) {
            return false;
        }
        
        $dia = (int)$partes[0];
        $mes = (int)$partes[1];
        $año = (int)$partes[2];
    }
    
    // Validar que la fecha sea correcta usando checkdate
    // Esta función verifica que mes, día y año sean válidos (ej: no 30 de febrero)
    if (!checkdate($mes, $dia, $año)) {
        return false;
    }
    
    // Calcular la edad actual del usuario
    $fecha_nacimiento = new DateTime("$año-$mes-$dia");
    $hoy = new DateTime();
    
    // Diferencia en años entre hoy y la fecha de nacimiento
    $edad = $hoy->diff($fecha_nacimiento)->y;
    
    // Verificar que la edad esté dentro del rango permitido (4-85 años)
    if ($edad < 4 || $edad > 85) {
        return false;
    }
    
    return true;
}

/**
 * Función: calcularEdad
 * Descripción: Calcula la edad en años de una persona dado su fecha de nacimiento
 * Parámetros: $fecha (string) - Fecha en formato YYYY-MM-DD o DD/MM/YYYY
 * Retorna: integer - Edad en años, o 0 si hay error
 */
function calcularEdad($fecha) {
    // Detectar formato de fecha y extraer componentes
    // Formato ISO (YYYY-MM-DD) del input type="date"
    if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $fecha)) {
        $partes = explode('-', $fecha);
        $año = (int)$partes[0];
        $mes = (int)$partes[1];
        $dia = (int)$partes[2];
    } else {
        // Formato DD/MM/YYYY
        $partes = explode('/', $fecha);
        if (count($partes) !== 3) {
            return 0;
        }
        $dia = (int)$partes[0];
        $mes = (int)$partes[1];
        $año = (int)$partes[2];
    }
    
    // Crear objetos DateTime para calcular la diferencia
    $fecha_nacimiento = new DateTime("$año-$mes-$dia");
    $hoy = new DateTime();
    
    // Retornar la diferencia en años completos
    return $hoy->diff($fecha_nacimiento)->y;
}

/**
 * Función: formatearFecha
 * Descripción: Convierte una fecha de formato ISO (YYYY-MM-DD) a formato DD/MM/YYYY
 * Parámetros: $fecha (string) - Fecha en formato YYYY-MM-DD o DD/MM/YYYY
 * Retorna: string - Fecha formateada como DD/MM/YYYY
 */
function formatearFecha($fecha) {
    // Detectar si es formato ISO (YYYY-MM-DD) del input type="date"
    if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $fecha)) {
        // Dividir la fecha en partes
        $partes = explode('-', $fecha);
        $año = $partes[0];
        $mes = $partes[1];
        $dia = $partes[2];
        
        // Retornar formato DD/MM/YYYY
        return "$dia/$mes/$año";
    } else {
        // Si ya está en formato DD/MM/YYYY, devolverla sin cambios
        return $fecha;
    }
}

/**
 * Función: validarIBAN
 * Descripción: Valida un IBAN español verificando su formato y dígito de control
 * Parámetros: $iban (string) - IBAN a validar
 * Retorna: boolean - true si es válido, false en caso contrario
 */
function validarIBAN($iban) {
    // Convertir a mayúsculas y eliminar espacios
    $iban = strtoupper(str_replace(' ', '', trim($iban)));
    
    // Verificar que sea IBAN español: ES + 22 dígitos = 24 caracteres totales
    if (!preg_match('/^ES[0-9]{22}$/', $iban)) {
        return false;
    }
    
    // Algoritmo de validación IBAN
    // Extraer los dos dígitos de control (posiciones 2-3)
    $check = substr($iban, 2, 2);
    
    // Extraer el número de cuenta (resto del IBAN)
    $cuenta = substr($iban, 4);
    
    // Código de país para España (ES = 1428 en formato numérico)
    $codigo_pais = '1428';
    
    // Reorganizar para algoritmo de validación: número de cuenta + código país + dígitos control
    $numero_completo = $cuenta . $codigo_pais . $check;
    
    // Calcular módulo 97 del número reorganizado
    // Si el resultado es 1, el IBAN es válido
    $resto = 0;
    for ($i = 0; $i < strlen($numero_completo); $i++) {
        $resto = ($resto * 10 + intval($numero_completo[$i])) % 97;
    }
    
    // IBAN válido si el módulo 97 es exactamente 1
    return $resto === 1;
}

/**
 * Función: calcularPrecioFinal
 * Descripción: Calcula el precio final aplicando descuentos según la edad
 * - Menores de 12 años: descuento de 80€
 * - Mayores de 65 años: descuento del 50%
 * Parámetros: $precio_base (float) - precio sin descuentos, $edad (int) - edad del abonado
 * Retorna: array con ['precio' => float, 'descuento' => string]
 */
function calcularPrecioFinal($precio_base, $edad) {
    // Inicializar con el precio sin descuentos
    $precio_final = $precio_base;
    
    // Variable para almacenar el tipo de descuento aplicado
    $descuento_aplicado = "";
    
    // Aplicar descuentos según categoría de edad
    if ($edad < 12) {
        // Niños menores de 12 años: descuento fijo de 80€
        $precio_final = $precio_base - 80;
        $descuento_aplicado = "Descuento niños (-80€)";
    } elseif ($edad > 65) {
        // Pensionistas mayores de 65 años: descuento del 50%
        $precio_final = $precio_base * 0.5;
        $descuento_aplicado = "Descuento pensionistas (-50%)";
    }
    
    // Garantizar que el precio final no sea negativo (no se devuelve dinero)
    if ($precio_final < 0) {
        $precio_final = 0;
    }
    
    // Retornar array con precio final y descripción del descuento
    return [$precio_final, $descuento_aplicado];
}

/**
 * Función: guardarCookiesDatos
 * Descripción: Guarda en cookies los datos principales del abonado para precargar futuras compras.
 * Campos: nombre, dni, fecha_nacimiento, telefono, cuenta_bancaria
 */
function guardarCookiesDatos(array $datos) {
    // 180 días de duración
    $expira = time() + 60 * 60 * 24 * 30; // Tiempo de expiración de la cookie, por ahora y hasta nueva indicación lo dejo en 30 días
    $path = dirname($_SERVER['PHP_SELF']) ?: '/';
    $secure = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
    $options = [
        'expires' => $expira,
        'path' => $path,
        'secure' => $secure,
        'httponly' => true,
        'samesite' => 'Lax'
    ];

    // Guardar cada campo si está presente
    if (isset($datos['nombre'])) {
        setcookie('abonado_nombre', (string)$datos['nombre'], $options);
    }
    if (isset($datos['dni'])) {
        setcookie('abonado_dni', (string)$datos['dni'], $options);
    }
    if (isset($datos['fecha_nacimiento'])) {
        setcookie('abonado_fecha_nacimiento', (string)$datos['fecha_nacimiento'], $options);
    }
    if (isset($datos['telefono'])) {
        setcookie('abonado_telefono', (string)$datos['telefono'], $options);
    }
    if (isset($datos['cuenta_bancaria'])) {
        setcookie('abonado_cuenta_bancaria', (string)$datos['cuenta_bancaria'], $options);
    }
}

/**
 * Función: generarCodigoAsiento
 * Descripción: Genera un código de asiento único con formato específico según el tipo
 * Formato: [Letra][Bloque][/F][Fila][[-A]][Asiento]
 * Parámetros: $tipo_abono (string) - tipo de abono (tribuna, preferencia, fondo)
 * Retorna: string - código de asiento generado
 */
function generarCodigoAsiento($tipo_abono) {
    // Determinar la primera letra según el tipo de abono
    // T = Tribuna, P = Preferencia, F = Fondo
    $primera_letra = '';
    switch ($tipo_abono) {
        case 'tribuna':
            $primera_letra = 'T';
            break;
        case 'preferencia':
            $primera_letra = 'P';
            break;
        case 'fondo':
            $primera_letra = 'F';
            break;
    }
    
    // Generar número de bloque (1-5): hay 5 bloques diferentes
    $bloque = rand(1, 5);
    
    // Generar número de fila (0-29): el estadio tiene 30 filas
    $fila = rand(0, 29);
    
    // Formatear fila con 2 dígitos (00-29)
    $fila_formateada = sprintf('%02d', $fila);
    
    // Calcular número máximo de asientos para esta fila
    // Esto representa un estadio con forma de "embudo"
    // Fila 29 (superior) tiene 200 asientos
    // Cada fila inferior tiene 2 asientos menos
    // Fila 0 (inferior) tiene 140 asientos
    $max_asientos = 200 - (2 * (29 - $fila));
    
    // Generar número de asiento aleatorio (0 hasta max_asientos-1)
    $asiento = rand(0, $max_asientos - 1);
    
    // Formatear asiento con 3 dígitos (000-199)
    $asiento_formateado = sprintf('%03d', $asiento);
    
    // Construir el código final: [Letra]B[Bloque]/F[Fila]-A[Asiento]
    // Ejemplo: TB1/F15-A095 (Tribuna, Bloque 1, Fila 15, Asiento 95)
    return $primera_letra . 'B' . $bloque . '/F' . $fila_formateada . '-A' . $asiento_formateado;
}

// ============================================================================
// PROCESAMIENTO DEL FORMULARIO (POST)
// ============================================================================

// Verificar si se ha enviado un formulario por POST
if ($_SERVER["REQUEST_METHOD"] === "POST") {

    // ========================================================================
    // RECOLECCIÓN DE DATOS DEL FORMULARIO
    // ========================================================================
    
    // Recoger datos del formulario (todos son obligatorios según el enunciado)
    // La función isset() verifica que exista el parámetro POST
    // La función trim() elimina espacios al inicio y final
    
    // Nombre y apellidos del abonado
    $datos['nombre'] = isset($_POST['nombre']) ? trim($_POST['nombre']) : '';
    
    // Documento Nacional de Identidad (DNI)
    $datos['dni'] = isset($_POST['dni']) ? trim($_POST['dni']) : '';
    
    // Fecha de nacimiento del abonado
    $datos['fecha_nacimiento'] = isset($_POST['fecha_nacimiento']) ? trim($_POST['fecha_nacimiento']) : '';
    
    // Número de teléfono de contacto
    $datos['telefono'] = isset($_POST['telefono']) ? trim($_POST['telefono']) : '';
    
    // Número de cuenta bancaria (IBAN)
    $datos['cuenta_bancaria'] = isset($_POST['cuenta_bancaria']) ? trim($_POST['cuenta_bancaria']) : '';
    
    // ID del tipo de abono seleccionado (Tribuna, Preferencia, Fondo)
    $datos['tipo_abono'] = isset($_POST['tipo_abono']) ? $_POST['tipo_abono'] : '';
    
    // Checkbox de aceptación de términos y condiciones
    $datos['terminos'] = isset($_POST['terminos']);
    
    // ========================================================================
    // VALIDACIÓN DE DATOS
    // ========================================================================
    
    // Validación del nombre y apellidos
    // Verificar que no esté vacío
    if (empty($datos['nombre'])) {
        $errores['nombre'] = "El nombre y apellidos no puede estar vacío.";
    } 
    // Verificar que solo contiene letras, acentos y espacios
    elseif (!preg_match('/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/', $datos['nombre'])) {
        $errores['nombre'] = "El nombre solo puede contener letras.";
    }
    
    // Validación del DNI
    // Verificar que no esté vacío
    if (empty($datos['dni'])) {
        $errores['dni'] = "El DNI no puede estar vacío.";
    } 
    // Usar función de validación que verifica formato y dígito de control
    elseif (!validarDNI($datos['dni'])) {
        $errores['dni'] = "El DNI debe tener 8 dígitos y una letra válida (ej: 12345678Z).";
    }
    
    // Validación de la fecha de nacimiento
    // Verificar que no esté vacía
    if (empty($datos['fecha_nacimiento'])) {
        $errores['fecha_nacimiento'] = "La fecha de nacimiento no puede estar vacía.";
    } 
    // Usar función de validación que verifica formato y rango de edad
    elseif (!validarFechaNacimiento($datos['fecha_nacimiento'])) {
        $errores['fecha_nacimiento'] = "La fecha debe ser válida y la edad entre 4 y 85 años.";
    }
    
    // Validación del teléfono
    // Verificar que no esté vacío
    if (empty($datos['telefono'])) {
        $errores['telefono'] = "El teléfono no puede estar vacío.";
    } 
    // Verificar que tiene 9 dígitos y empieza por 6, 7 o 9 (teléfonos españoles)
    elseif (!preg_match('/^[679][0-9]{8}$/', $datos['telefono'])) {
        $errores['telefono'] = "El teléfono debe tener 9 dígitos y empezar por 6, 7 o 9.";
    }
    
    // Validación de la cuenta bancaria (IBAN)
    // Verificar que no esté vacía
    if (empty($datos['cuenta_bancaria'])) {
        $errores['cuenta_bancaria'] = "La cuenta bancaria no puede estar vacía.";
    } 
    // Usar función de validación IBAN que verifica formato y dígito de control
    elseif (!validarIBAN($datos['cuenta_bancaria'])) {
        $errores['cuenta_bancaria'] = "La cuenta bancaria debe ser un IBAN español válido (ej: ES91 2100 0418 4502 0005 1332).";
    }
    
    // Validación del tipo de abono
    // Verificar que se haya seleccionado un tipo (no puede estar vacío)
    if (empty($datos['tipo_abono'])) {
        $errores['tipo_abono'] = "Debe seleccionar un tipo de abono.";
    }
    
    // Validación de términos y condiciones
    // Verificar que el usuario ha aceptado los términos
    if (!$datos['terminos']) {
        $errores['terminos'] = "Debe aceptar los términos y condiciones.";
    }
    
    // ========================================================================
    // PROCESAMIENTO SI LA VALIDACIÓN ES EXITOSA
    // ========================================================================
    
    // Si no hay errores de validación, proceder con la compra
    if (empty($errores)) {
        
        // 1) Verificar que el tipo de abono seleccionado existe en la base de datos
        // Búsqueda en el array $tipo_abonos obtenido al inicio del script
        $tipoSeleccionado = null;
        foreach ($tipo_abonos as $ta) {
            if ($ta['id'] === $datos['tipo_abono']) {
                $tipoSeleccionado = $ta;
                break;
            }
        }

        // Si el tipo de abono no existe, registrar error
        if (!$tipoSeleccionado) {
            $errores['tipo_abono'] = 'Tipo de abono no válido.';
        } else {
            // ================================================================
            // GENERACIÓN DE DATOS PARA LA COMPRA
            // ================================================================
            
            // Generar ID único (UUID v4) para esta venta
            // UUID es un identificador único universal de 128 bits
            $idVenta = sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
                mt_rand(0, 0xffff), mt_rand(0, 0xffff),
                mt_rand(0, 0xffff),
                mt_rand(0, 0x0fff) | 0x4000,  // versión 4
                mt_rand(0, 0x3fff) | 0x8000,  // variante RFC 4122
                mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
            );

            // Obtener la fecha y hora actual de la compra
            $fechaCompra = new DateTime();

            // Abonado: "Nombre Apellidos - Dni"
            $abonado = $datos['nombre'] . ' - ' . $datos['dni'];

            // Edad: teniendo en cuenta solo el año
            $anioNacimiento = null;
            if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $datos['fecha_nacimiento'])) {
                $anioNacimiento = (int)substr($datos['fecha_nacimiento'], 0, 4);
            } elseif (preg_match('/^\d{2}\/\d{2}\/\d{4}$/', $datos['fecha_nacimiento'])) {
                $parts = explode('/', $datos['fecha_nacimiento']);
                $anioNacimiento = (int)$parts[2];
            }
            $edadAno = $anioNacimiento ? ((int)date('Y') - $anioNacimiento) : calcularEdad($datos['fecha_nacimiento']);

            // Calcular precio a partir del precio del tipo de abono en BD
            $precio_base = (float)$tipoSeleccionado['precio'];
            list($precio_final, $descuento_aplicado) = calcularPrecioFinal($precio_base, $edadAno);
            $tarifa_especial = $descuento_aplicado !== '' ? 1 : 0;

            // Generar asiento único con hasta 5 intentos
            $asiento = null;
            $intento = 0;
            while ($intento < 5) {
                $desc = strtolower($tipoSeleccionado['descripcion']);
                $primeraLetra = '';
                if (strpos($desc, 'tribuna') !== false) $primeraLetra = 'T';
                elseif (strpos($desc, 'preferencia') !== false) $primeraLetra = 'P';
                else $primeraLetra = 'F';

                $bloque = rand(1,5);
                $fila = rand(0,29);
                $fila_formateada = sprintf('%02d', $fila);
                $max_asientos = 200 - (2 * (29 - $fila));
                $asiento_num = rand(0, max(0, $max_asientos - 1));
                $asiento_form = sprintf('%03d', $asiento_num);
                $posible = $primeraLetra . 'B' . $bloque . '/F' . $fila_formateada . '-A' . $asiento_form;

                // comprobar existencia en BD
                $stmtCheck = $pdo->prepare('SELECT COUNT(*) as c FROM abonos WHERE asiento = :asiento');
                $stmtCheck->execute([':asiento' => $posible]);
                $rowc = $stmtCheck->fetch();
                if ($rowc && isset($rowc['c']) && $rowc['c'] == 0) {
                    $asiento = $posible;
                    break;
                }
                $intento++;
            }

            if ($asiento === null) {
                $errores['asiento'] = 'No hay asientos disponibles. Venta cancelada.';
            } else {
                // Guardar en la BBDD tabla abonos
                try {
                    $sql = 'INSERT INTO abonos (id, fecha, abonado, edad, telefono, cuenta_bancaria, tipo, asiento, precio) VALUES
                            (:id, :fecha, :abonado, :edad, :telefono, :cuenta_bancaria, :tipo, :asiento, :precio)';
                    $stmtIns = $pdo->prepare($sql);
                    $stmtIns->execute([
                        ':id' => $idVenta,
                        ':fecha' => $fechaCompra->format('Y-m-d H:i:s'),
                        ':abonado' => $abonado,
                        ':edad' => $edadAno,
                        ':telefono' => $datos['telefono'],
                        ':cuenta_bancaria' => $datos['cuenta_bancaria'],
                        ':tipo' => $tipoSeleccionado['id'],
                        ':asiento' => $asiento,
                        ':precio' => $precio_final,
                    ]);

                    // Guardar cookies con los datos para futuras compras
                    guardarCookiesDatos($datos);

                    // Preparar datos para mostrar ticket
                    $mostrar_ticket = true;
                    $datos['fecha_compra'] = $fechaCompra->format('d/m/Y H:i:s');
                    $datos['abonado'] = $datos['nombre'];
                    $datos['dni'] = $datos['dni'];
                    $datos['telefono'] = $datos['telefono'];
                    $datos['tipo_abono'] = $tipoSeleccionado['descripcion'];
                    $datos['codigo_asiento'] = $asiento;
                    $datos['precio_final'] = $precio_final;
                    $datos['tarifa_especial'] = $tarifa_especial;
                    $datos['edad'] = $edadAno;
                } catch (PDOException $e) {
                    $errores['bd'] = 'Error al guardar la venta: ' . $e->getMessage();
                }
            }
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
        /* Estilo del botón flotante consolidado en styles/general.css */
    </style>
    <?php else: ?>
    <style>
        body {
            background-image: linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)), url('img/fondo2.jpg');
            background-size: cover;
            background-repeat: no-repeat;
            background-attachment: fixed;
            background-color: #f4f4f4;
        }
        .ticket {
                background-image: linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)), url('img/fondo2.jpg');
                background-size: cover;
                background-repeat: no-repeat;
                background-attachment: fixed;
                background-color: #f4f4f4;
                font-family: 'Courier New', Courier, monospace;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                margin: 0;
                padding: 20px;
                box-sizing: border-box;
            }
            .ticket-content {
                background-color: #fff;
                border: 2px dashed #d41c1c;
                padding: 25px;
                width: 100%;
                max-width: 450px;
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
            margin: 8px 0;
            word-wrap: break-word;
        }
            .ticket-content .precio-section {
            border-top: 1px solid #eee;
            margin-top: 15px;
            padding-top: 15px;
        }
            .ticket-content .precio-base {
            color: #666;
            font-size: 0.9em;
        }
            .ticket-content .descuento {
            color: #28a745;
            font-weight: bold;
        }
            .ticket-content .total {
            font-weight: bold;
            font-size: 1.3em;
            text-align: right;
            margin-top: 10px;
            border-top: 2px solid #333;
            padding-top: 10px;
            color: #d41c1c;
        }
            .ticket-content .asiento {
            background-color: #f8f9fa;
            border: 1px solid #dee2e6;
            padding: 10px;
            margin: 15px 0;
            text-align: center;
            font-weight: bold;
            font-size: 1.1em;
            border-radius: 5px;
        }
            .ticket-content .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 0.8em;
            color: #777;
            border-top: 1px solid #eee;
            padding-top: 15px;
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
            display: inline-block;
        }
        .volver a:hover {
            background-color: #d41c1c;
            color: white;
        }
        /* Estilo del botón flotante consolidado en styles/general.css */
    </style>
    <?php endif; ?>
</head>
<body>

<?php if ($mostrar_ticket): ?>
    <!-- Mostrar ticket de compra -->
    <div class="ticket">
        <div class="ticket-content">
        <h2>🎫 Ticket de Compra</h2>
        <p><strong>Fecha de compra:</strong> <?php echo htmlspecialchars($datos['fecha_compra'] ?? ''); ?></p>
        <p><strong>Abonado:</strong> <?php echo htmlspecialchars($datos['abonado'] ?? ''); ?> - <?php echo htmlspecialchars($datos['dni'] ?? ''); ?></p>
        <p><strong>Teléfono:</strong> <?php echo htmlspecialchars($datos['telefono'] ?? ''); ?></p>
        <p><strong>Tipo de Abono:</strong> <?php echo htmlspecialchars($datos['tipo_abono'] ?? ''); ?></p>
        
        <div class="asiento">
            <strong>🪑 Asiento Asignado:</strong><br>
            <?php echo htmlspecialchars($datos['codigo_asiento'] ?? ''); ?>
        </div>
        
        <div class="precio-section">
            <p class="total">💰 Total a pagar: <?php echo isset($datos['precio_final']) ? number_format($datos['precio_final'], 2) : '0.00'; ?>€</p>
            <?php if (isset($datos['tarifa_especial']) && $datos['tarifa_especial']): ?>
                <p class="descuento">✅ Tarifa especial aplicada</p>
            <?php endif; ?>
        </div>
        
        <p><strong>Términos:</strong> Aceptados ✓</p>
        
        <div class="footer">
            <p>🏟️ ¡Gracias por tu apoyo al UD Almería!</p>
            <p>Presenta este ticket el día del partido</p>
        </div>
        
        <div class="volver">
            <a href="<?php echo htmlspecialchars($_SERVER['PHP_SELF'], ENT_QUOTES, 'UTF-8'); ?>">← Realizar otra compra</a>
        </div>
        </div>
    </div>

    <!-- Botón flotante para ver listado -->
    <a href="listadoabonos.php" class="btn-listado">📋 Ver Listado de Abonos</a>

<?php else: ?>
    <!-- Mostrar formulario -->
    <div class="container">
        <img src="img/logo.png" alt="Logo UD Almería" class="logo">
        <h1>Venta de Abonos UD Almería</h1>
        <p style="text-align: center; color: #666; margin-bottom: 20px;">
            Precios con descuentos especiales:<br>
            • Niños menores de 12 años: -80€<br>
            • Pensionistas mayores de 65 años: -50%
        </p>

        <?php if (!empty($errores)): ?>
        <div class="error-summary">
            <strong>Por favor, corrija los siguientes errores:</strong>
            <ul>
                <?php foreach ($errores as $error): ?>
                <li><?php echo htmlspecialchars($error, ENT_QUOTES, 'UTF-8'); ?></li>
                <?php endforeach; ?>
            </ul>
        </div>
        <?php endif; ?>

        <form method="post" action="<?php echo htmlspecialchars($_SERVER['PHP_SELF'], ENT_QUOTES, 'UTF-8'); ?>">
            <label for="nombre">Nombre y apellidos:</label>
            <input type="text" 
                id="nombre" 
                name="nombre" 
                placeholder="Juan Pérez García"
                value="<?php echo htmlspecialchars($datos['nombre'] ?? ''); ?>"
                class="<?php echo isset($errores['nombre']) ? 'campo-error' : ''; ?>">
            <?php if (isset($errores['nombre'])): ?>
                <span class="error"><?php echo $errores['nombre']; ?></span>
            <?php endif; ?>

            <label for="dni">DNI:</label>
            <input type="text" 
                id="dni" 
                name="dni" 
                placeholder="12345678Z"
                value="<?php echo htmlspecialchars($datos['dni'] ?? ''); ?>"
                class="<?php echo isset($errores['dni']) ? 'campo-error' : ''; ?>">
            <?php if (isset($errores['dni'])): ?>
                <span class="error"><?php echo $errores['dni']; ?></span>
            <?php endif; ?>

            <label for="fecha_nacimiento">Fecha de nacimiento (dd/mm/yyyy):</label>
            <input type="text" 
                id="fecha_nacimiento" 
                name="fecha_nacimiento" 
                placeholder="01/01/1990"
                value="<?php echo htmlspecialchars($datos['fecha_nacimiento'] ?? ''); ?>"
                class="<?php echo isset($errores['fecha_nacimiento']) ? 'campo-error' : ''; ?>">
            <?php if (isset($errores['fecha_nacimiento'])): ?>
                <span class="error"><?php echo $errores['fecha_nacimiento']; ?></span>
            <?php endif; ?>

            <label for="telefono">Teléfono:</label>
            <input type="text" 
                id="telefono" 
                name="telefono" 
                placeholder="612345678"
                value="<?php echo htmlspecialchars($datos['telefono'] ?? ''); ?>"
                class="<?php echo isset($errores['telefono']) ? 'campo-error' : ''; ?>">
            <?php if (isset($errores['telefono'])): ?>
                <span class="error"><?php echo $errores['telefono']; ?></span>
            <?php endif; ?>

            <label for="cuenta_bancaria">Cuenta bancaria (IBAN):</label>
            <input type="text" 
                id="cuenta_bancaria" 
                name="cuenta_bancaria" 
                placeholder="ES91 2100 0418 4502 0005 1332"
                value="<?php echo htmlspecialchars($datos['cuenta_bancaria'] ?? ''); ?>"
                class="<?php echo isset($errores['cuenta_bancaria']) ? 'campo-error' : ''; ?>">
            <?php if (isset($errores['cuenta_bancaria'])): ?>
                <span class="error"><?php echo $errores['cuenta_bancaria']; ?></span>
            <?php endif; ?>

            <label for="tipo_abono">Tipo de abono:</label>
            <select id="tipo_abono" 
                    name="tipo_abono" 
                    class="<?php echo isset($errores['tipo_abono']) ? 'campo-error' : ''; ?>">
                <option value="">-</option>
                <?php foreach ($tipo_abonos as $ta): ?>
                    <option value="<?php echo htmlspecialchars($ta['id']); ?>" <?php echo ($datos['tipo_abono'] ?? '') === $ta['id'] ? 'selected' : ''; ?>>
                        <?php echo htmlspecialchars($ta['descripcion']); ?> (<?php echo number_format($ta['precio'], 2); ?>€)
                    </option>
                <?php endforeach; ?>
            </select>
            <?php if (isset($errores['tipo_abono'])): ?>
                <span class="error"><?php echo $errores['tipo_abono']; ?></span>
            <?php endif; ?>

            <div class="terminos">
                <input type="checkbox" 
                    id="terminos" 
                    name="terminos" 
                    <?php echo ($datos['terminos'] ?? false) ? 'checked' : ''; ?>
                    class="<?php echo isset($errores['terminos']) ? 'campo-error' : ''; ?>">
                <label for="terminos">Acepto términos y condiciones</label>
                <?php if (isset($errores['terminos'])): ?>
                    <span class="error"><?php echo $errores['terminos']; ?></span>
                <?php endif; ?>
            </div>

            <button type="submit">🛒 Comprar Abono</button>
        </form>
    </div>

    <!-- Botón flotante para ver listado -->
    <a href="listadoabonos.php" class="btn-listado">📋 Ver Listado de Abonos</a>

<?php endif; ?>

</body>
</html>