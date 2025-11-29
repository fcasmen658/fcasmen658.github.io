/**
 * Actividad 6 - Funciones JavaScript
 * Desarrollo Web en Entorno Cliente
 * @author fcasmen658
 */

// ================================
// 1. FUNCIÓN FACTORIAL
// ================================

/**
 * Calcula el factorial de un número positivo
 * @param {number} n - Número positivo del cual calcular el factorial
 * @returns {number|string} - El factorial del número o mensaje de error
 */
function factorial(n) {
    // Validación de entrada
    if (typeof n !== 'number' || isNaN(n)) {
        return 'Error: Debe ingresar un número válido';
    }
    
    if (n < 0) {
        return 'Error: El factorial no está definido para números negativos';
    }
    
    if (n % 1 !== 0) {
        return 'Error: El factorial solo está definido para números enteros';
    }
    
    // Casos especiales
    if (n === 0 || n === 1) {
        return 1;
    }
    
    // Cálculo iterativo del factorial
    let resultado = 1;
    for (let i = 2; i <= n; i++) {
        resultado *= i;
    }
    
    return resultado;
}

/**
 * Función auxiliar para mostrar el resultado del factorial
 */
function calcularFactorial() {
    const input = document.getElementById('factorialInput');
    const resultado = document.getElementById('factorialResult');
    
    const numero = parseFloat(input.value);
    const fact = factorial(numero);
    
    if (typeof fact === 'string') {
        resultado.className = 'result error';
        resultado.innerHTML = fact;
    } else {
        resultado.className = 'result success';
        resultado.innerHTML = `El factorial de ${numero} es: <strong>${fact.toLocaleString()}</strong>`;
    }
}

// ================================
// 2. FUNCIÓN MEDIA ARITMÉTICA
// ================================

/**
 * Calcula la media aritmética de una lista de números
 * @param {Array<number>} numeros - Array de números
 * @returns {number|string} - La media aritmética o mensaje de error
 */
function mediaAritmetica(numeros) {
    // Validación de entrada
    if (!Array.isArray(numeros)) {
        return 'Error: Debe proporcionar un array de números';
    }
    
    if (numeros.length === 0) {
        return 'Error: El array no puede estar vacío';
    }
    
    // Validar que todos los elementos sean números
    for (let i = 0; i < numeros.length; i++) {
        if (typeof numeros[i] !== 'number' || isNaN(numeros[i])) {
            return `Error: El elemento en la posición ${i} no es un número válido`;
        }
    }
    
    // Calcular la suma
    let suma = 0;
    for (let i = 0; i < numeros.length; i++) {
        suma += numeros[i];
    }
    
    // Calcular y retornar la media
    return suma / numeros.length;
}

/**
 * Función auxiliar para mostrar el resultado de la media aritmética
 */
function calcularMedia() {
    const input = document.getElementById('mediaInput');
    const resultado = document.getElementById('mediaResult');
    
    try {
        // Convertir la cadena de entrada en array de números
        const texto = input.value.trim();
        if (!texto) {
            throw new Error('Debe ingresar al menos un número');
        }
        
        // Separar por comas, espacios o punto y coma
        const numerosTexto = texto.split(/[,;\s]+/).filter(item => item.trim() !== '');
        const numeros = numerosTexto.map(num => {
            const numero = parseFloat(num.trim());
            if (isNaN(numero)) {
                throw new Error(`"${num}" no es un número válido`);
            }
            return numero;
        });
        
        const media = mediaAritmetica(numeros);
        
        if (typeof media === 'string') {
            resultado.className = 'result error';
            resultado.innerHTML = media;
        } else {
            resultado.className = 'result success';
            resultado.innerHTML = `
                <strong>Números:</strong> [${numeros.join(', ')}]<br>
                <strong>Cantidad:</strong> ${numeros.length}<br>
                <strong>Suma:</strong> ${numeros.reduce((a, b) => a + b, 0)}<br>
                <strong>Media aritmética:</strong> ${media.toFixed(4)}
            `;
        }
    } catch (error) {
        resultado.className = 'result error';
        resultado.innerHTML = `Error: ${error.message}`;
    }
}

// ================================
// 3. FUNCIÓN PALÍNDROMO
// ================================

/**
 * Verifica si una cadena de texto es un palíndromo
 * @param {string} texto - Cadena de texto a verificar
 * @returns {boolean|string} - true si es palíndromo, false si no, o mensaje de error
 */
function esPalindromo(texto) {
    // Validación de entrada
    if (typeof texto !== 'string') {
        return 'Error: Debe proporcionar una cadena de texto';
    }
    
    if (texto.trim() === '') {
        return 'Error: La cadena no puede estar vacía';
    }
    
    // Normalizar el texto: convertir a minúsculas y eliminar espacios, acentos y caracteres especiales
    const textoNormalizado = texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Eliminar diacríticos (acentos)
        .replace(/[^a-z0-9]/g, ''); // Mantener solo letras y números
    
    // Verificar si es palíndromo comparando con su reverso
    const textoReverso = textoNormalizado.split('').reverse().join('');
    
    return textoNormalizado === textoReverso;
}

/**
 * Función auxiliar para mostrar el resultado del palíndromo
 */
function verificarPalindromo() {
    const input = document.getElementById('palindromoInput');
    const resultado = document.getElementById('palindromoResult');
    
    const texto = input.value;
    const esPali = esPalindromo(texto);
    
    if (typeof esPali === 'string') {
        resultado.className = 'result error';
        resultado.innerHTML = esPali;
    } else {
        const textoNormalizado = texto
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]/g, '');
        
        if (esPali) {
            resultado.className = 'result success';
            resultado.innerHTML = `
                <strong>✓ SÍ es un palíndromo</strong><br>
                <strong>Texto original:</strong> "${texto}"<br>
                <strong>Texto normalizado:</strong> "${textoNormalizado}"<br>
                <strong>Texto invertido:</strong> "${textoNormalizado.split('').reverse().join('')}"
            `;
        } else {
            resultado.className = 'result error';
            resultado.innerHTML = `
                <strong>✗ NO es un palíndromo</strong><br>
                <strong>Texto original:</strong> "${texto}"<br>
                <strong>Texto normalizado:</strong> "${textoNormalizado}"<br>
                <strong>Texto invertido:</strong> "${textoNormalizado.split('').reverse().join('')}"
            `;
        }
    }
}

// ================================
// 4. FUNCIÓN VALIDACIÓN DNI
// ================================

/**
 * Valida si un DNI español es correcto
 * @param {string} dni - DNI a validar (formato: 12345678A)
 * @returns {boolean|string} - true si es válido, false si no, o mensaje de error
 */
function validarDNI(dni) {
    // Validación de entrada
    if (typeof dni !== 'string') {
        return 'Error: El DNI debe ser una cadena de texto';
    }
    
    const dniLimpio = dni.trim().toUpperCase();
    
    if (dniLimpio === '') {
        return 'Error: El DNI no puede estar vacío';
    }
    
    // Verificar formato: 8 dígitos + 1 letra
    const formatoDNI = /^[0-9]{8}[A-Z]$/;
    if (!formatoDNI.test(dniLimpio)) {
        return 'Error: El DNI debe tener 8 dígitos seguidos de 1 letra (ej: 12345678A)';
    }
    
    // Extraer número y letra
    const numero = parseInt(dniLimpio.substring(0, 8));
    const letra = dniLimpio.charAt(8);
    
    // Tabla de letras del DNI español
    const letrasValidas = 'TRWAGMYFPDXBNJZSQVHLCKE';
    
    // Calcular la letra que debería corresponder
    const letraCalculada = letrasValidas.charAt(numero % 23);
    
    // Verificar si la letra es correcta
    return letra === letraCalculada;
}

/**
 * Función auxiliar para mostrar el resultado de la validación del DNI
 */
function validarDNIInput() {
    const input = document.getElementById('dniInput');
    const resultado = document.getElementById('dniResult');
    
    const dni = input.value;
    const esValido = validarDNI(dni);
    
    if (typeof esValido === 'string') {
        resultado.className = 'result error';
        resultado.innerHTML = esValido;
    } else {
        const dniLimpio = dni.trim().toUpperCase();
        const numero = parseInt(dniLimpio.substring(0, 8));
        const letra = dniLimpio.charAt(8);
        const letrasValidas = 'TRWAGMYFPDXBNJZSQVHLCKE';
        const letraCalculada = letrasValidas.charAt(numero % 23);
        
        if (esValido) {
            resultado.className = 'result success';
            resultado.innerHTML = `
                <strong>✓ DNI VÁLIDO</strong><br>
                <strong>DNI:</strong> ${dniLimpio}<br>
                <strong>Número:</strong> ${numero.toLocaleString()}<br>
                <strong>Letra proporcionada:</strong> ${letra}<br>
                <strong>Letra calculada:</strong> ${letraCalculada}<br>
                <strong>Resto de la división:</strong> ${numero} ÷ 23 = ${Math.floor(numero/23)} (resto: ${numero % 23})
            `;
        } else {
            resultado.className = 'result error';
            resultado.innerHTML = `
                <strong>✗ DNI INVÁLIDO</strong><br>
                <strong>DNI:</strong> ${dniLimpio}<br>
                <strong>Número:</strong> ${numero.toLocaleString()}<br>
                <strong>Letra proporcionada:</strong> ${letra}<br>
                <strong>Letra correcta:</strong> ${letraCalculada}<br>
                <strong>Explicación:</strong> La letra debería ser "${letraCalculada}" (posición ${numero % 23} en la tabla)
            `;
        }
    }
}

// ================================
// FUNCIONES DE PRUEBA AUTOMÁTICA
// ================================

/**
 * Ejecuta ejemplos predefinidos para todas las funciones
 */
function ejecutarEjemplos() {
    // Ejemplos Factorial
    document.getElementById('factorialInput').value = '5';
    calcularFactorial();
    
    // Ejemplos Media
    document.getElementById('mediaInput').value = '10, 20, 30, 40, 50';
    calcularMedia();
    
    // Ejemplos Palíndromo
    document.getElementById('palindromoInput').value = 'La ruta nos aporto otro paso natural';
    verificarPalindromo();
    
    // Ejemplos DNI
    document.getElementById('dniInput').value = '12345678Z';
    validarDNIInput();
}

// ================================
// INICIALIZACIÓN
// ================================

/**
 * Función que se ejecuta cuando se carga la página
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Actividad 6 - Funciones JavaScript cargada correctamente');
    
    // Agregar eventos de Enter para los inputs
    document.getElementById('factorialInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') calcularFactorial();
    });
    
    document.getElementById('mediaInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') calcularMedia();
    });
    
    document.getElementById('palindromoInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') verificarPalindromo();
    });
    
    document.getElementById('dniInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') validarDNIInput();
    });
});