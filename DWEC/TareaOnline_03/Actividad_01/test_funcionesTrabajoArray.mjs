/**
 * Archivo: test_funcionesTrabajoArray.mjs
 * Descripción: Pruebas para las funciones de trabajo con arrays
 */

import {
    numeroMasAlto,
    numeroImpares,
    mediaAritmetica,
    moda,
    numeroPrimos
} from './funcionesTrabajoArray.mjs';

console.log('=== PRUEBAS DE FUNCIONES SOBRE ARRAYS NUMÉRICOS ===\n');

// Array de prueba
const arrayPrueba = [5, 12, 8, 130, 44, 3, 7, 2, 11, 5, 5, 8, 13];

console.log('Array de prueba:', arrayPrueba);
console.log('');

// Prueba 1: numeroMasAlto
console.log('1. numeroMasAlto()');
console.log('   Resultado:', numeroMasAlto(arrayPrueba));
console.log('   Esperado: 130');
console.log('');

// Prueba 2: numeroImpares
console.log('2. numeroImpares()');
console.log('   Resultado:', numeroImpares(arrayPrueba));
console.log('   Esperado: 7 (números impares: 5, 3, 7, 11, 5, 5, 13)');
console.log('');

// Prueba 3: mediaAritmetica
console.log('3. mediaAritmetica()');
const media = mediaAritmetica(arrayPrueba);
console.log('   Resultado:', media);
console.log('   Esperado:', (5+12+8+130+44+3+7+2+11+5+5+8+13)/13);
console.log('');

// Prueba 4: moda
console.log('4. moda()');
console.log('   Resultado:', moda(arrayPrueba));
console.log('   Esperado: 5 (aparece 3 veces)');
console.log('');

// Prueba 5: numeroPrimos
console.log('5. numeroPrimos()');
console.log('   Resultado:', numeroPrimos(arrayPrueba));
console.log('   Esperado: 6 (números primos: 5, 3, 7, 2, 11, 5, 5, 13)');
console.log('');

// Pruebas adicionales con diferentes arrays
console.log('=== PRUEBAS ADICIONALES ===\n');

const array2 = [1, 2, 3, 4, 5];
console.log('Array:', array2);
console.log('Número más alto:', numeroMasAlto(array2));
console.log('Números impares:', numeroImpares(array2));
console.log('Media aritmética:', mediaAritmetica(array2));
console.log('Moda:', moda(array2));
console.log('Números primos:', numeroPrimos(array2));
console.log('');

const array3 = [10, 10, 10, 20, 20, 30];
console.log('Array:', array3);
console.log('Moda:', moda(array3), '(esperado: 10)');
console.log('');

// Pruebas de validación de errores
console.log('=== PRUEBAS DE VALIDACIÓN ===\n');

const pruebasError = [
    {
        descripcion: 'Parámetro no es array',
        llamada: () => numeroMasAlto('no array'),
        esperado: 'El parámetro debe ser un array.'
    },
    {
        descripcion: 'Array vacío',
        llamada: () => mediaAritmetica([]),
        esperado: 'El array no puede estar vacío.'
    },
    {
        descripcion: 'Array con elementos no numéricos',
        llamada: () => numeroImpares([1, 'a', 3]),
        esperado: 'Todos los elementos del array deben ser numéricos.'
    }
];

pruebasError.forEach(prueba => {
    try {
        prueba.llamada();
        console.log(`❌ ${prueba.descripcion}: no lanzó error`);
    } catch (error) {
        const coincide = error.message === prueba.esperado;
        console.log(`${coincide ? '✅' : '❌'} ${prueba.descripcion}:`, error.message, `(esperado: ${prueba.esperado})`);
    }
});

console.log('=== TODAS LAS PRUEBAS COMPLETADAS ===');
