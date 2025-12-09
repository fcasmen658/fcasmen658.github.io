import { Estudiante } from '../Actividad_03/estudiante.mjs';
import ModalGenerator from './ModalGenerator.mjs';

// Generar 10 estudiantes aleatorios
const estudiantes = Array.from({ length: 10 }, () => Estudiante.crearAleatorio());

// Obtener el contenedor de la lista
const listaEstudiantes = document.getElementById('estudiantes-list');

// Crear los elementos del DOM para cada estudiante
estudiantes.forEach((estudiante, index) => {
    const li = document.createElement('li');
    li.textContent = estudiante.nombreCompleto;
    li.dataset.index = index;
    
    // Evento click para abrir el modal
    li.addEventListener('click', () => {
        const info = estudiante.toString();
        ModalGenerator.newModal(info);
    });
    
    listaEstudiantes.appendChild(li);
});
