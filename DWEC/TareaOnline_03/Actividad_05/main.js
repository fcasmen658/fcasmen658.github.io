import { Estudiante } from '../Actividad_03/estudiante.mjs';
import ModalGenerator from './ModalGenerator.mjs';

// WeakMap para asociar elementos DOM con objetos Estudiante
const estudianteMap = new WeakMap();

// Generar 10 estudiantes aleatorios
const estudiantes = Array.from({ length: 10 }, () => Estudiante.crearAleatorio());

// Obtener el contenedor de la lista
const listaEstudiantes = document.getElementById('estudiantes-list');

// Función para manejar el click
function handleClick(event) {
    const estudiante = estudianteMap.get(event.currentTarget);
    if (estudiante) {
        const info = estudiante.toString();
        ModalGenerator.newModal(info);
    }
}

// Crear los elementos del DOM para cada estudiante
estudiantes.forEach((estudiante) => {
    const li = document.createElement('li');
    li.textContent = estudiante.nombreCompleto;
    
    // Asociar el elemento DOM con el objeto Estudiante en el WeakMap
    estudianteMap.set(li, estudiante);
    
    // Evento click usando la función compartida
    li.addEventListener('click', handleClick);
    
    listaEstudiantes.appendChild(li);
});
