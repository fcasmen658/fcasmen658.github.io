import { Persona } from './persona.mjs';
import { Genero } from './genero.mjs';
import { CicloFormativo } from './ciclos.mjs';

const ciclosValidos = new Set(Object.values(CicloFormativo));
const generosValidos = new Set(Object.values(Genero));

function assertFecha(fechaValor) {
    const fecha = new Date(fechaValor);
    if (Number.isNaN(fecha.getTime())) {
        throw new Error('Fecha de matriculación inválida.');
    }
    const hoy = new Date();
    if (fecha > hoy) {
        throw new Error('La fecha de matriculación no puede ser futura.');
    }
    return fecha.toISOString().slice(0, 10);
}

function assertCiclo(valor) {
    if (!ciclosValidos.has(valor)) {
        throw new Error('Ciclo formativo inválido.');
    }
}

function assertNota(valor) {
    if (typeof valor !== 'number' || Number.isNaN(valor) || valor < 0 || valor > 10) {
        throw new Error('Nota media inválida (debe estar entre 0 y 10).');
    }
}

export class Estudiante extends Persona {
    #fechaMatriculacion;
    #cicloFormativo;
    #notaMedia;

    constructor(nombreCompleto, genero, fechaMatriculacion, cicloFormativo, notaMedia) {
        super(nombreCompleto, genero);
        if (!generosValidos.has(genero)) {
            throw new Error('Género inválido.');
        }
        this.fechaMatriculacion = fechaMatriculacion;
        this.cicloFormativo = cicloFormativo;
        this.notaMedia = notaMedia;
    }

    get fechaMatriculacion() {
        return this.#fechaMatriculacion;
    }

    set fechaMatriculacion(value) {
        this.#fechaMatriculacion = assertFecha(value);
    }

    get cicloFormativo() {
        return this.#cicloFormativo;
    }

    set cicloFormativo(value) {
        assertCiclo(value);
        this.#cicloFormativo = value;
    }

    get notaMedia() {
        return this.#notaMedia;
    }

    set notaMedia(value) {
        assertNota(value);
        this.#notaMedia = value;
    }

    toString() {
        return `Estudiante { nombreCompleto: "${this.nombreCompleto}", genero: ${this.genero}, fechaMatriculacion: ${this.#fechaMatriculacion}, cicloFormativo: ${this.#cicloFormativo}, notaMedia: ${this.#notaMedia} }`;
    }

    toJSON() {
        return {
            ...super.toJSON(),
            fechaMatriculacion: this.#fechaMatriculacion,
            cicloFormativo: this.#cicloFormativo,
            notaMedia: this.#notaMedia
        };
    }

    static crearAleatorio() {
        const persona = Persona.crearAleatorio();
        const ciclos = Array.from(ciclosValidos);
        const ciclo = ciclos[Math.floor(Math.random() * ciclos.length)];

        const hoy = new Date();
        const diasRango = 365 * 4;
        const offsetDias = Math.floor(Math.random() * diasRango);
        const fecha = new Date(hoy.getTime() - offsetDias * 24 * 60 * 60 * 1000);
        const fechaISO = fecha.toISOString().slice(0, 10);

        const nota = Math.round((Math.random() * 10) * 100) / 100;

        return new Estudiante(persona.nombreCompleto, persona.genero, fechaISO, ciclo, nota);
    }

    static fromJSON(json) {
        const obj = typeof json === 'string' ? JSON.parse(json) : json;
        if (!obj || typeof obj !== 'object') {
            throw new Error('JSON inválido para Estudiante');
        }
        return new Estudiante(
            obj.nombreCompleto,
            obj.genero,
            obj.fechaMatriculacion,
            obj.cicloFormativo,
            obj.notaMedia
        );
    }
}
