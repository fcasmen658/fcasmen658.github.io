// listaTareas.js: Muestra, edita y elimina tareas desde tareas.json

document.addEventListener('DOMContentLoaded', function() {
    const tareasList = document.getElementById('tareasList');
    const selectedTaskSection = document.getElementById('selectedTaskSection');
    const editTask = document.getElementById('editTask');
    const editTaskBtn = document.getElementById('editTaskBtn');
    const deleteTaskBtn = document.getElementById('deleteTaskBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    let tareas = {};
    let selectedKey = null;
    let selectedIndex = null;

    async function loadTareas() {
        try {
            const resp = await fetch('js/tareas.json');
            tareas = resp.ok ? await resp.json() : {};
        } catch {
            tareas = {};
        }
        renderList();
        hideEditSection();
    }

    function renderList() {
        if (Object.keys(tareas).length === 0) {
            tareasList.innerHTML = '<p>No hay tareas registradas.</p>';
            return;
        }
        let html = '<ul style="list-style:none;padding:0;">';
        for (const key of Object.keys(tareas)) {
            const tareasDia = Array.isArray(tareas[key]) ? tareas[key] : [tareas[key]];
            html += `<li style="margin-bottom:16px;"><strong>${key}</strong><ul style="margin:6px 0 0 16px;">`;
            tareasDia.forEach((t, i) => {
                html += `<li><button type="button" class="print-button" data-key="${key}" data-index="${i}">${t}</button></li>`;
            });
            html += '</ul></li>';
        }
        html += '</ul>';
        tareasList.innerHTML = html;
        Array.from(tareasList.querySelectorAll('button')).forEach(btn => {
            btn.onclick = () => selectTask(btn.dataset.key, parseInt(btn.dataset.index));
        });
    }

    function selectTask(key, idx) {
        selectedKey = key;
        selectedIndex = idx;
        editTask.value = tareas[key][idx];
        selectedTaskSection.style.display = 'block';
    }

    function hideEditSection() {
        selectedKey = null;
        selectedIndex = null;
        editTask.value = '';
        selectedTaskSection.style.display = 'none';
    }

    editTaskBtn.addEventListener('click', async function() {
        if (selectedKey == null || selectedIndex == null) return;
        const newText = editTask.value.trim();
        if (!newText) return;
        tareas[selectedKey][selectedIndex] = newText;
        await saveTareas();
        loadTareas();
    });

    deleteTaskBtn.addEventListener('click', async function() {
        if (selectedKey == null || selectedIndex == null) return;
        tareas[selectedKey].splice(selectedIndex, 1);
        if (tareas[selectedKey].length === 0) delete tareas[selectedKey];
        await saveTareas();
        loadTareas();
    });

    cancelEditBtn.addEventListener('click', function() {
        hideEditSection();
    });

    async function saveTareas() {
        await fetch('js/tareas.json', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tareas, null, 2)
        });
    }

    loadTareas();
});
