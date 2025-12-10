// addTarea.js: Lógica para añadir tareas al archivo tareas.json
// NOTA: Debido a restricciones de seguridad del navegador, este script solo funcionará correctamente si el sitio está alojado en un servidor con backend que permita la escritura de archivos.
// Para pruebas locales, se recomienda usar un servidor con soporte para peticiones POST/PUT (por ejemplo, Node.js, Python Flask, etc.)

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('addTaskForm');
    const successMsg = document.getElementById('successMsg');
    const errorMsg = document.getElementById('errorMsg');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        successMsg.style.display = 'none';
        errorMsg.style.display = 'none';

        const date = form.date.value;
        const task = form.task.value.trim();
        if (!date || !task) {
            errorMsg.textContent = 'Por favor, completa todos los campos.';
            errorMsg.style.display = 'block';
            return;
        }
        // Convertir fecha a formato MM-DD
        const [year, month, day] = date.split('-');
        const key = `${month}-${day}`;

        try {
            // Obtener tareas actuales
            const resp = await fetch('js/tareas.json');
            let tareas = {};
            if (resp.ok) {
                tareas = await resp.json();
            }
            // Añadir la tarea
            if (!tareas[key]) {
                tareas[key] = [];
            } else if (typeof tareas[key] === 'string') {
                tareas[key] = [tareas[key]];
            }
            tareas[key].push(task);

            // Guardar tareas (esto requiere backend)
            const saveResp = await fetch('js/tareas.json', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tareas, null, 2)
            });
            if (saveResp.ok) {
                successMsg.style.display = 'block';
                form.reset();
            } else {
                throw new Error('No se pudo guardar la tarea. (¿Backend disponible?)');
            }
        } catch (err) {
            errorMsg.textContent = err.message;
            errorMsg.style.display = 'block';
        }
    });
});
