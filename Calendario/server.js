// server.js - Backend sencillo para añadir tareas a tareas.json
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

const tareasPath = path.join(__dirname, 'js', 'tareas.json');

app.use(express.json());
app.use(express.static(__dirname)); // Servir archivos estáticos

// Endpoint para obtener tareas
app.get('/js/tareas.json', (req, res) => {
    fs.readFile(tareasPath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'No se pudo leer tareas.json' });
        res.type('application/json').send(data);
    });
});

// Endpoint para actualizar tareas
app.put('/js/tareas.json', (req, res) => {
    const tareas = req.body;
    fs.writeFile(tareasPath, JSON.stringify(tareas, null, 2), 'utf8', err => {
        if (err) return res.status(500).json({ error: 'No se pudo guardar tareas.json' });
        res.json({ ok: true });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
