/**
 * Archivo: funcionesTrabajoArray.mjs
 * Descripción: Funciones para trabajar con arrays numéricos
 * Utiliza las nuevas funcionalidades de ECMAScript
 */

/**
 * validarArrayNumerico
 * Valida que el parámetro sea un array válido de números
 * @param {*} array - Parámetro a validar
 * @throws {Error} Si no es un array, está vacío o contiene elementos no numéricos
 */
export function validarArrayNumerico(array) {
    // Comprobar que es un array
    if (!Array.isArray(array)) {
        throw new Error('El parámetro debe ser un array.');
    }

    // Comprobar que no está vacío
    if (array.length === 0) {
        throw new Error('El array no puede estar vacío.');
    }

    // Comprobar que todos los elementos son numéricos
    const todosSonNumeros = array.every(elemento => typeof elemento === 'number' && !isNaN(elemento));
    if (!todosSonNumeros) {
        throw new Error('Todos los elementos del array deben ser numéricos.');
    }
}

/**
 * numeroMasAlto
 * Devuelve el valor más alto contenido en el array
 * @param {number[]} array - Array de números
 * @returns {number} El número más alto del array
 */
export function numeroMasAlto(array) {
    validarArrayNumerico(array);
    return Math.max(...array);
}

/**
 * numeroImpares
 * Devuelve la cantidad de números impares contenidos en el array
 * @param {number[]} array - Array de números
 * @returns {number} Cantidad de números impares
 */
export function numeroImpares(array) {
    validarArrayNumerico(array);
    return array.filter(num => num % 2 !== 0).length;
}

/**
 * mediaAritmetica
 * Devuelve la media aritmética de los valores del array
 * @param {number[]} array - Array de números
 * @returns {number} Media aritmética
 */
export function mediaAritmetica(array) {
    validarArrayNumerico(array);
    const suma = array.reduce((acc, num) => acc + num, 0);
    return suma / array.length;
}

/**
 * moda
 * Devuelve el valor de la moda (el número que más veces se repite) dentro del array
 * Si hay varios valores con la misma frecuencia máxima, devuelve el primero encontrado
 * @param {number[]} array - Array de números
 * @returns {number} El número que más se repite (moda)
 */
export function moda(array) {
    validarArrayNumerico(array);

    // Crear un objeto para contar las frecuencias
    const frecuencias = array.reduce((acc, num) => {
        acc[num] = (acc[num] || 0) + 1;
        return acc;
    }, {});

    // Encontrar la frecuencia máxima
    let maxFrecuencia = 0;
    let valorModa = array[0];

    for (const [valor, frecuencia] of Object.entries(frecuencias)) {
        if (frecuencia > maxFrecuencia) {
            maxFrecuencia = frecuencia;
            valorModa = Number(valor);
        }
    }

    return valorModa;
}

/**
 * esPrimo
 * Función auxiliar para determinar si un número es primo
 * @param {number} num - Número a verificar
 * @returns {boolean} True si es primo, false en caso contrario
 */
export function esPrimo(num) {
    if (num < 2) return false;
    if (num === 2) return true;
    if (num % 2 === 0) return false;

    // Solo verificar divisores impares hasta la raíz cuadrada
    const raiz = Math.sqrt(num);
    for (let i = 3; i <= raiz; i += 2) {
        if (num % i === 0) return false;
    }
    return true;
}

/**
 * numeroPrimos
 * Devuelve la cantidad de números primos contenidos en el array
 * @param {number[]} array - Array de números
 * @returns {number} Cantidad de números primos
 */
export function numeroPrimos(array) {
    validarArrayNumerico(array);
    return array.filter(num => esPrimo(num)).length;
}
