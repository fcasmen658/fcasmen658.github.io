// actividad1.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';

import {
    numeroMasAlto,
    numeroImpares,
    mediaAritmetica,
    moda,
    numeroPrimos
} from './funcionesTrabajoArray.mjs';

const arrayEjemplo = [1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

test('numeroMasAlto devuelve el máximo', () => {
    assert.equal(numeroMasAlto(arrayEjemplo), 10);
});

test('numeroImpares cuenta correctamente', () => {
    assert.equal(numeroImpares(arrayEjemplo), 6); // 1,1,3,5,7,9
});

test('mediaAritmetica calcula correctamente', () => {
    assert.equal(mediaAritmetica([1, 2, 3]), 2);
});

test('moda devuelve el valor más repetido', () => {
    assert.equal(moda(arrayEjemplo), 1);
});

test('numeroPrimos cuenta los primos', () => {
    assert.equal(numeroPrimos(arrayEjemplo), 4); // 2,3,5,7
});

test('lanza error si no es un array', () => {
    assert.throws(
        () => numeroMasAlto(123),
        /array/i
    );
});

    test('lanza error si el array está vacío', () => {
    assert.throws(
        () => numeroMasAlto([]),
        /vacío|vacio/i
    );
});

test('lanza error si hay valores no numéricos', () => {
    assert.throws(
        () => mediaAritmetica([1, 'a', 3]),
        /numéric/i
    );
});