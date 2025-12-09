# Tarea Online 03 - DWEC

## Desarrollo Web en Entorno Cliente

**Fecha de inicio:** 8 de diciembre de 2025

---

## 📋 Descripción del Proyecto

Tarea Online 03 centrada en el desarrollo de funcionalidades JavaScript modernas utilizando ECMAScript 6+. Se implementan funciones para trabajar con arrays numéricos y manipulación de datos.

---

## 🗂️ Estructura del Proyecto

```
TareaOnline_03/
├── README.md
├── funcionesTrabajoArray.mjs
└── test_funcionesTrabajoArray.mjs
```

---

## 🚀 Funcionalidades Implementadas

### 1.1. Funciones sobre arrays numéricos

#### `funcionesTrabajoArray.mjs`

Módulo que contiene funciones para trabajar con arrays numéricos:

**1. `numeroMasAlto(array)`**
- Devuelve el valor más alto contenido en el array
- Utiliza el operador spread (`...`) con `Math.max()`
- Lanza error si el array está vacío

**2. `numeroImpares(array)`**
- Devuelve la cantidad de números impares en el array
- Utiliza `filter()` para contar impares (num % 2 !== 0)
- Retorna 0 si el array está vacío

**3. `mediaAritmetica(array)`**
- Devuelve la media aritmética de los números
- Utiliza `reduce()` para sumar todos los elementos
- Divide la suma entre la longitud del array
- Lanza error si el array está vacío

**4. `moda(array)`**
- Devuelve el número que más se repite (moda estadística)
- Utiliza un objeto para contar frecuencias con `reduce()`
- Usa `Object.entries()` para iterar sobre las frecuencias
- Si hay empate, devuelve el primero encontrado
- Lanza error si el array está vacío

**5. `numeroPrimos(array)`**
- Devuelve la cantidad de números primos en el array
- Incluye función auxiliar `esPrimo()` para verificar primalidad
- Algoritmo optimizado: verifica solo hasta la raíz cuadrada
- Utiliza `filter()` para contar números primos
- Retorna 0 si el array está vacío

#### Características técnicas:
- ✅ Formato ES Modules (`.mjs`)
- ✅ Uso de `export` para exportar funciones
- ✅ Documentación JSDoc completa
- ✅ Validación de parámetros
- ✅ Manejo de casos extremos (arrays vacíos)
- ✅ Uso de funcionalidades ES6+: arrow functions, spread operator, `reduce()`, `filter()`, template literals

---

## 📝 Registro de Cambios

### 2025-12-08

- Inicialización del proyecto
- Creación de README.md
- **Actividad 1.1**: Implementación de `funcionesTrabajoArray.mjs`
  - `numeroMasAlto()`: Encuentra el valor máximo
  - `numeroImpares()`: Cuenta números impares
  - `mediaAritmetica()`: Calcula la media
  - `moda()`: Encuentra el valor más repetido
  - `numeroPrimos()`: Cuenta números primos
- Creación de `test_funcionesTrabajoArray.mjs` para pruebas

---

## 🛠️ Tecnologías Utilizadas

- HTML5
- CSS3
- JavaScript

---

## ⚙️ Instalación y Uso

### Ejecutar pruebas de funciones de arrays

```bash
node test_funcionesTrabajoArray.mjs
```

### Importar funciones en tu código

```javascript
import {
    numeroMasAlto,
    numeroImpares,
    mediaAritmetica,
    moda,
    numeroPrimos
} from './funcionesTrabajoArray.mjs';

const numeros = [5, 12, 8, 3, 7, 2, 11];
console.log(numeroMasAlto(numeros));     // 12
console.log(numeroImpares(numeros));     // 4
console.log(mediaAritmetica(numeros));   // 6.857...
console.log(moda([1, 2, 2, 3]));         // 2
console.log(numeroPrimos(numeros));      // 4
```

---

## 📌 Notas

[Pendiente]
