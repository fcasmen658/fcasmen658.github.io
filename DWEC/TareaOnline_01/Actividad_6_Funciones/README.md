# Actividad 6 - Funciones JavaScript

## 📋 Descripción
Actividad 6. Funciones de Desarrollo Web en Entorno Cliente (DAW).

## 🎯 Funciones Implementadas

### 1. 🔢 Factorial de un Número
**Función:** `factorial(n)`
- Calcula el factorial de un número entero positivo
- **Entrada:** Número entero positivo
- **Salida:** Factorial del número o mensaje de error
- **Validaciones:** 
  - Verifica que sea un número válido
  - No acepta números negativos
  - Solo acepta números enteros

**Ejemplos:**
```javascript
factorial(5)  // 120
factorial(0)  // 1
factorial(1)  // 1
factorial(-5) // "Error: El factorial no está definido para números negativos"
```

### 2. 📊 Media Aritmética
**Función:** `mediaAritmetica(numeros)`
- Calcula la media aritmética de una lista de números
- **Entrada:** Array de números
- **Salida:** Media aritmética o mensaje de error
- **Validaciones:**
  - Verifica que sea un array
  - No acepta arrays vacíos
  - Todos los elementos deben ser números válidos

**Ejemplos:**
```javascript
mediaAritmetica([10, 20, 30])        // 20
mediaAritmetica([1, 2, 3, 4, 5])     // 3
mediaAritmetica([10.5, 15.2, 8.7])  // 11.4667
```

### 3. 🔄 Verificador de Palíndromos
**Función:** `esPalindromo(texto)`
- Verifica si una cadena de texto es un palíndromo
- **Entrada:** Cadena de texto
- **Salida:** `true` si es palíndromo, `false` si no, o mensaje de error
- **Características:**
  - Ignora espacios, acentos y mayúsculas
  - Normaliza caracteres especiales
  - Soporta palíndromos complejos

**Ejemplos:**
```javascript
esPalindromo("oso")                              // true
esPalindromo("anita lava la tina")               // true
esPalindromo("La ruta nos aporto otro paso natural") // true
esPalindromo("hola mundo")                       // false
```

### 4. 🆔 Validador de DNI Español
**Función:** `validarDNI(dni)`
- Valida si un DNI español es correcto
- **Entrada:** DNI como cadena (formato: 12345678A)
- **Salida:** `true` si es válido, `false` si no, o mensaje de error
- **Validaciones:**
  - Formato correcto: 8 dígitos + 1 letra
  - Letra correcta según algoritmo español
  - Calcula la letra usando: número % 23

**Ejemplos:**
```javascript
validarDNI("12345678Z") // true
validarDNI("12345678A") // false
validarDNI("1234567")   // "Error: El DNI debe tener 8 dígitos seguidos de 1 letra"
```

## 🏗️ Estructura del Proyecto
```
Actividad_6_Funciones/
├── index.html          # Página principal con interfaz
├── css/
│   └── styles.css      # Estilos CSS responsivos
├── js/
│   └── funciones.js    # Implementación de las funciones
└── README.md           # Este archivo
```

## 🚀 Cómo Usar

1. **Abrir la aplicación:**
   - Abrir `index.html` en cualquier navegador web moderno
   - O ejecutar: `start index.html` desde la terminal

2. **Probar las funciones:**
   - Cada función tiene su propia sección en la interfaz
   - Ingresar datos en los campos correspondientes
   - Hacer clic en los botones para ejecutar
   - Usar los botones de ejemplo para pruebas rápidas

3. **Ejemplos automáticos:**
   - Hacer clic en "🚀 Ejecutar Todos los Ejemplos" para ver todas las funciones en acción

## 💻 Tecnologías Utilizadas
- **HTML5:** Estructura semántica y accesible
- **CSS3:** Estilos modernos con Grid Layout y gradientes
- **JavaScript ES6+:** Funciones puras con validaciones completas
- **Responsive Design:** Compatible con dispositivos móviles

## 🎨 Características de la Interfaz
- Diseño moderno y responsivo
- Validación de entrada en tiempo real
- Mensajes de error y éxito diferenciados
- Ejemplos interactivos para cada función
- Documentación integrada

## 🔧 Funcionalidades Adicionales
- **Validación robusta:** Cada función incluye validaciones exhaustivas
- **Normalización de texto:** El verificador de palíndromos maneja acentos y caracteres especiales
- **Formateo visual:** Los resultados incluyen información detallada del proceso
- **Accesibilidad:** Soporte para navegación con teclado (Enter)

## 👨‍💻 Autor
**fcasmen658** - Estudiante DAW  
GitHub: [https://github.com/fcasmen658/DWEC](https://github.com/fcasmen658/DWEC)

## 📄 Licencia
Este proyecto es parte de las actividades académicas del curso DAW - Desarrollo Web en Entorno Cliente.