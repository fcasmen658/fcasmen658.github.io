<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {

    // Recoger y sanitizar los datos del formulario
    // Con función htmlspecialchars() prevenimos ataques de Cross-Site 
    // Scripting (XSS) convirtiendo caracteres HTML potencialmente peligrosos 
    // en entidades HTML seguras.
    // Cuando la entrada del usuario contiene caracteres como <, >, &, o comillas,
    // esta función los transforma en sus equivalentes de entidades HTML (&lt;, &gt;, &amp;, etc.),
    // que los navegadores mostrarán como texto literal en lugar de interpretarlos como código HTML.
    
    $nombre = htmlspecialchars($_POST['nombre'] ?? '');
    $dni = htmlspecialchars($_POST['dni'] ?? '');
    $fecha_nacimiento = htmlspecialchars($_POST['fecha_nacimiento'] ?? '');
    $telefono = htmlspecialchars($_POST['telefono'] ?? '');
    $cuenta_bancaria = htmlspecialchars($_POST['cuenta_bancaria'] ?? '');
    $tipo_abono = htmlspecialchars($_POST['tipo_abono'] ?? '');
    $terminos = isset($_POST['terminos']) ? "Aceptados" : "No aceptados";

    // Determinar el precio y el nombre del abono
    $precio = 0;
    $abono_nombre = "No especificado";
    switch ($tipo_abono) {
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
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <!-- Asegura que la página se vea bien en dispositivos móviles -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="styles/ticket.css">
    <title>Ticket de Compra - UD Almería</title>
</head>
<body>

    <div class="ticket">
        <h2>Ticket de Compra</h2>
        <p><strong>Aficionado:</strong> <?php echo $nombre; ?></p>
        <p><strong>DNI:</strong> <?php echo $dni; ?></p>
        <p><strong>Fecha de Nacimiento:</strong> <?php echo $fecha_nacimiento; ?></p>
        <p><strong>Teléfono:</strong> <?php echo $telefono; ?></p>
        <p><strong>Cuenta Bancaria:</strong> <?php echo $cuenta_bancaria; ?></p>
        <p><strong>Tipo de Abono:</strong> <?php echo $abono_nombre; ?></p>
        <p><strong>Términos:</strong> <?php echo $terminos; ?></p>
        <p class="total">Total: <?php echo $precio; ?>€</p>
        <p class="footer">¡Gracias por su compra!</p>
    </div>

</body>
</html>
<?php
} else {
    // Si no es una petición POST, redirigir al formulario
    header('Location: formulario.html');
    exit();
}
?>
