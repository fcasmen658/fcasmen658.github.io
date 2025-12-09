# Actividad 02 - Arrays vs Maps

## Estructura

- `DataManager.mjs`: clase base con `add` y `search` abstractos.
- `ArrayManager.mjs`: usa array de objetos `{ id, grade }` con actualizacion si ya existe.
- `MapManager.mjs`: usa `Map`, reemplaza valor si ya existe.
- `ComparePerformance.mjs`: script para medir insercion y busqueda con ambas implementaciones.

## Uso

Ejecutar la comparativa:

```bash
node DWEC/TareaOnline_03/Actividad_02/ComparePerformance.mjs
```
Ajusta `TOTAL`, `idsBusqueda` o `repeticiones` dentro del script si necesitas otros escenarios.


## Resultados obtenidos (TOTAL=10_000, repeticiones=1000)

Insercion:

- ArrayManager: 66.8621 ms
- MapManager: 2.2785 ms

Busqueda (total ms | media ms):

- ArrayManager id=1: 0.2110 | 0.000211
- ArrayManager id=5000: 32.4308 | 0.032431
- ArrayManager id=10000: 61.8018 | 0.061802
- ArrayManager id=15000 (fallida): 10.6443 | 0.010644
- MapManager id=1: 0.1956 | 0.000196
- MapManager id=5000: 0.0735 | 0.000074
- MapManager id=10000: 0.1011 | 0.000101
- MapManager id=15000 (fallida): 0.0897 | 0.000090

## Conclusiones

- Insercion: MapManager es claramente mas rapido que ArrayManager.
- Busqueda: MapManager gana para primer valor, intermedio, ultimo y fallido; ArrayManager escala lineal.
- Razon: Map ofrece accesos promedio O(1) por clave; Array requiere recorrido O(n) para buscar o actualizar.
- Si se inserta mucho: usar Map (insercion O(1) promedio frente a O(n) por la busqueda previa en array).
- Si se busca mucho: usar Map (busqueda O(1) promedio frente a O(n) en array).
- Orden Big-O: Array (insertar con actualizacion O(n), buscar O(n)); Map (insertar O(1) promedio, buscar O(1) promedio).
