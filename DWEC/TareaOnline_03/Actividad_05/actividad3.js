import { Estudiante } from './estudiante.mjs';

// Generar colección de estudiantes aleatorios
const estudiantes = Array.from({ length: 5 }, () => Estudiante.crearAleatorio());

console.log('=== Estudiantes generados ===');
estudiantes.forEach((est, idx) => {
    console.log(`${idx + 1}. ${est.toString()}`);
});

// Tomamos el primero para probar JSON
const estudianteOriginal = estudiantes[0];
const json = JSON.stringify(estudianteOriginal);
console.log('\n=== JSON.stringify de un estudiante ===');
console.log(json);

const estudiantePlano = JSON.parse(json);
console.log('\n=== Objeto plano tras JSON.parse ===');
console.log('Tiene toString():', typeof estudiantePlano.toString === 'function');
console.log('Instancia de Estudiante:', estudiantePlano instanceof Estudiante);

// Reconstruir usando el método estático fromJSON
const estudianteRecuperado = Estudiante.fromJSON(json);
console.log('\n=== Estudiante recuperado con fromJSON ===');
console.log('Instancia de Estudiante:', estudianteRecuperado instanceof Estudiante);
console.log(estudianteRecuperado.toString());
