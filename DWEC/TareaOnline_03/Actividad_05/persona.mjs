import { Genero } from './genero.mjs';

const generosValidos = new Set(Object.values(Genero));

function assertNombre(nombre) {
    if (typeof nombre !== 'string' || !nombre.trim()) {
        throw new Error('Nombre completo inválido.');
    }
}

function assertGenero(valor) {
    if (!generosValidos.has(valor)) {
        throw new Error('Género inválido.');
    }
}

export class Persona {
    #nombreCompleto;
    #genero;

    constructor(nombreCompleto, genero) {
        this.nombreCompleto = nombreCompleto;
        this.genero = genero;
    }

    get nombreCompleto() {
        return this.#nombreCompleto;
    }

    set nombreCompleto(value) {
        assertNombre(value);
        this.#nombreCompleto = value.trim();
    }

    get genero() {
        return this.#genero;
    }

    set genero(value) {
        assertGenero(value);
        this.#genero = value;
    }

    toString() {
        return `Persona { nombreCompleto: "${this.#nombreCompleto}", genero: ${this.#genero} }`;
    }

    toJSON() {
        return {
            nombreCompleto: this.#nombreCompleto,
            genero: this.#genero
        };
    }

    static crearAleatorio() {
        const nombres = ['Alex García', 'María López', 'Juan Pérez', 'Lucía Martínez', 'Patricia Díaz'];
        const generoValores = Array.from(generosValidos);
        const nombre = nombres[Math.floor(Math.random() * nombres.length)];
        const genero = generoValores[Math.floor(Math.random() * generoValores.length)];
        return new Persona(nombre, genero);
    }

    static fromJSON(json) {
        const obj = typeof json === 'string' ? JSON.parse(json) : json;
        if (!obj || typeof obj !== 'object') {
            throw new Error('JSON inválido para Persona');
        }
        return new Persona(obj.nombreCompleto, obj.genero);
    }
}
