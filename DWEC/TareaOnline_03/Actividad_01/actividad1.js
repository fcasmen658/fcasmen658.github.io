// Ejemplo de uso manual del módulo de funciones sobre arrays numéricos
// Ejecutar con: node DWEC/TareaOnline_03/actividad1.js

(async () => {
    const {
        numeroMasAlto,
        numeroImpares,
        mediaAritmetica,
        moda,
        numeroPrimos
    } = await import('./funcionesTrabajoArray.mjs');

    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    try {
        console.log('Número más alto:', numeroMasAlto(array)); // Esperado: 10
        console.log('Cantidad de números impares:', numeroImpares(array)); // Esperado: 5
        console.log('Media aritmética:', mediaAritmetica(array)); // Esperado: 5.5
        console.log('Moda:', moda(array)); // Esperado: 1 (todas las frecuencias iguales, devuelve el primero)
        console.log('Cantidad de números primos:', numeroPrimos(array)); // Esperado: 4 (2, 3, 5, 7)
    } catch (error) {
        console.error('Error:', error.message);
    }

    // Ejemplos de errores
    const emptyArray = [];
    const invalidArray = [1, 'a', 3, null];

    try {
        console.log('Array vacío:', numeroMasAlto(emptyArray));
    } catch (error) {
        console.error('Array vacío:', error.message);
    }

    try {
        console.log('No es un array:', numeroMasAlto(12345));
    } catch (error) {
        console.error('No es un array:', error.message);
    }

    try {
        console.log('Valores no numéricos:', mediaAritmetica(invalidArray));
    } catch (error) {
        console.error('Valores no numéricos:', error.message);
    }
})();
