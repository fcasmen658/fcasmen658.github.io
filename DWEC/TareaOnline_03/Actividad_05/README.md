# Actividad 03 - Personas y Estudiantes

## Estructura

- `genero.mjs`: enumerado con `hombre`, `mujer`, `prefiero_no_decirlo`.
- `ciclos.mjs`: enumerado con `SMR`, `DAW`, `DAM`, `ASIR`.
- `persona.mjs`: clase `Persona` con encapsulacion, validacion, `toString`, `crearAleatorio`, `fromJSON`.
- `estudiante.mjs`: extiende `Persona`, añade `fechaMatriculacion`, `cicloFormativo`, `notaMedia`, validaciones, `toString`, `crearAleatorio`, `fromJSON`.
- `actividad3.js`: script de uso y demostracion.

## Ejecucion

```bash
node DWEC/TareaOnline_03/Actividad_03/actividad3.js
```

## Notas sobre JSON

- `JSON.stringify` serializa solo datos; los metodos de clase no viajan en el JSON.
- `JSON.parse` devuelve un objeto plano sin la cadena de prototipos, por eso no es `instanceof Estudiante` ni tiene los metodos.
- Los metodos estaticos `fromJSON` recrean instancias validando y restaurando los metodos.
