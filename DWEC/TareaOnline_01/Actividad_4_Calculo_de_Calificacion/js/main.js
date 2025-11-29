document.getElementById('formulario').addEventListener('submit', function(e) {
e.preventDefault();
const resultado = document.getElementById('resultado');
resultado.textContent = '';
resultado.className = '';

let valor = document.getElementById('nota').value.trim();

    // Comprobación de número válido
if (valor === "") {
    resultado.textContent = "Por favor, introduce una nota.";
    resultado.className = "error";
    return;
}

    // Normaliza el separador decimal: convierte cualquier ',' en '.'
valor = valor.replace(',', '.');

    // ¿Es número?
if (isNaN(valor)) {
    resultado.textContent = "Error: La entrada no es un número válido.";
    resultado.className = "error";
    return;
}

let nota = parseFloat(valor);
    // Rango válido
if (nota < 0 || nota > 10) {
    resultado.textContent = "Error: La nota debe estar entre 0 y 10.";
    resultado.className = "error";
    return;
}

    // Calificación textual según la nota
let calificacion = "";
if (nota < 4.50) { // Cambio aquí para ajustar el límite de Suspenso a 4.49
    calificacion = "Suspenso";
} else if (nota < 6) { // Cambio aquí para ajustar el límite de Aprobado desde 4.50 a 6
    calificacion = "Aprobado";
} else if (nota < 7) {
    calificacion = "Bien";
} else if (nota < 9) {
    calificacion = "Notable";
} else {
    calificacion = "Sobresaliente";
}

resultado.textContent = `Tu calificación es: ${calificacion}`;
// Aplicar clase de error si es suspenso, sino quitar todas las clases
resultado.className = (calificacion === "Suspenso") ? "error" : "";
});