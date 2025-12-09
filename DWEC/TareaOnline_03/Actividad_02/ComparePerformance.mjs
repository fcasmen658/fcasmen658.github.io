import { performance } from 'node:perf_hooks';
import { pathToFileURL } from 'node:url';
import { ArrayManager } from './ArrayManager.mjs';
import { MapManager } from './MapManager.mjs';

const TOTAL = 10_000;

function rellenarManager(manager, label) {
    const start = performance.now();
    for (let id = 1; id <= TOTAL; id++) {
        const grade = Math.random() * 10;
        manager.add(id, grade);
    }
    const totalMs = performance.now() - start;
    console.log(`${label} | insert -> total: ${totalMs.toFixed(4)} ms (TOTAL=${TOTAL})`);
    return totalMs;
}

function probarBusquedas(manager, label, idsBusqueda = [1, 5000, 10000, 15000], repeticiones = 1000) {
    const resultados = {};
    for (const id of idsBusqueda) {
        const start = performance.now();
        for (let i = 0; i < repeticiones; i++) {
            manager.search(id);
        }
        const totalMs = performance.now() - start;
        const mediaMs = totalMs / repeticiones;
        resultados[id] = { totalMs, mediaMs };
        console.log(
            `${label} | id=${id} -> total: ${totalMs.toFixed(4)} ms, ` +
            `media: ${mediaMs.toFixed(6)} ms (${repeticiones} repeticiones)`
        );
    }
    return resultados;
}

function runComparacion() {
    console.log(`--- Inserción (TOTAL=${TOTAL} elementos) ---`);
    const arrayManager = new ArrayManager();
    const mapManager = new MapManager();

    const resultados = {
        insercion: {},
        busquedas: {}
    };

    resultados.insercion.array = rellenarManager(arrayManager, 'ArrayManager');
    resultados.insercion.map = rellenarManager(mapManager, 'MapManager');

    console.log('\n--- Búsquedas ---');
    resultados.busquedas.array = probarBusquedas(arrayManager, 'ArrayManager');
    resultados.busquedas.map = probarBusquedas(mapManager, 'MapManager');

    return resultados;
}

const isMainModule = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMainModule) {
    runComparacion();
}

export { TOTAL, rellenarManager, probarBusquedas, runComparacion };
