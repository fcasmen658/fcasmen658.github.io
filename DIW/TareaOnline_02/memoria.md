# Memoria del Proyecto - BillarPro
## Tarea Online 2 - Diseño de Interfaces Web

**Autor:** Francisco Miguel Casas Méndez  
**Curso:** 2º Desarrollo de Aplicaciones Web (DAW)  
**Año Académico:** 2025-2026  
**Asignatura:** Diseño de Interfaces Web  
**Tarea Online 02:** Hojas de Estilos  
**Link:** https://fcasmen658.github.io/TareaOnline_02/Actividad_4/  

---

## Actividad 1: Página de Aterrizaje (Landing Page)

### Descripción General
Se implementó una landing page completa para **BillarPro**, una tienda especializada en productos de billar profesional. La página incluye secciones de hero, productos destacados, información sobre la empresa, testimonios y footer.

### Requisitos de CSS Implementados

#### 1. Hoja de Estilos Externa
- Se utilizó un archivo `styles.css` externo para todos los estilos.
- No se emplearon estilos inline en ningún elemento HTML.
- Separación completa entre estructura (HTML) y presentación (CSS).

#### 2. Variables CSS
Se definieron variables CSS en `:root` para mantener consistencia en toda la aplicación:

**Paleta de colores:**
```css
--color-blanco-puro: #FFFFFF;
--color-negro-clasico: #212121;
--color-gris-claro: #F8F9FA;
--color-gris-medio: #6C757D;
--color-mesa-verde: #2E7D32;
--color-verde-hover: #1B5E20;
--color-azul-profundo: #1976D2;
--color-azul-hover: #1565C0;
```

**Medidas y espaciados:**
```css
--spacing-xs: 0.5rem;
--spacing-sm: 1rem;
--spacing-md: 2rem;
--spacing-lg: 4rem;
--border-radius: 8px;
```

**Tipografía:**
```css
--font-primary: 'Roboto', sans-serif;
--font-secondary: 'Open Sans', sans-serif;
--font-impact: 'Oswald', sans-serif;
--font-body: 'Atkinson Hyperlegible', sans-serif;
```

**Sombras:**
```css
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
--shadow-md: 0 4px 6px rgba(0,0,0,0.1);
--shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
```

#### 3. Responsive con Media Queries
Se implementaron breakpoints para diferentes dispositivos:

- **Tablet:** `@media (min-width: 768px)`
- **Desktop:** `@media (min-width: 1024px)`

Características responsivas:
- Grid adaptable en productos (1 columna móvil → 2 columnas tablet → 4 columnas desktop)
- Navegación móvil con menú hamburguesa
- Hero con imágenes y textos optimizados por dispositivo
- Footer reorganizable según el ancho de pantalla

#### 4. Tipografía Fluida
Se utilizó la función `clamp()` para tipografía adaptable:

```css
.hero-title {
    font-size: clamp(2rem, 5vw, 3.5rem);
}

.section-title {
    font-size: clamp(1.75rem, 4vw, 2.5rem);
}
```

#### 5. Estados y Accesibilidad
Implementación completa de pseudo-clases para interactividad:

**Enlaces:**
```css
.nav-link:hover {
    color: var(--color-mesa-verde);
}

.nav-link:focus-visible {
    outline: 2px solid var(--color-mesa-verde);
    outline-offset: 4px;
}
```

**Botones:**
```css
.btn:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}

.btn:focus-visible {
    outline: 3px solid var(--color-azul-profundo);
    outline-offset: 2px;
}
```

**Tarjetas de producto:**
```css
.product-card:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-lg);
}
```

#### 6. Validación del Código
- Código HTML validado con W3C Validator
- Código CSS validado con W3C CSS Validator
- Sin errores de sintaxis ni advertencias críticas

### Requisitos de Layout Implementados

#### 1. Etiquetas Semánticas
Estructura HTML semántica completa:

```html
<header class="header">...</header>
<main>
    <section id="inicio" class="hero">...</section>
    <section id="productos" class="featured-products">...</section>
    <section id="sobre-nosotros" class="about-section">...</section>
    <section class="testimonials-section">...</section>
</main>
<footer id="contacto" class="footer">...</footer>
```

#### 2. Header y Footer Reutilizables
- Mismo código HTML y clases en todas las páginas
- Estilos consistentes mediante clases compartidas
- Navegación funcional entre páginas
- Footer con información de contacto, enlaces rápidos y redes sociales

#### 3. Unidades de Medida
**Sobremesa:**
- Max-width absoluto en contenedores: `max-width: 1200px`
- Imágenes con dimensiones definidas donde necesario

**Móvil:**
- Unidades relativas: `%`, `rem`, `em`, `fr`
- Padding y margin con `rem` para escalabilidad
- Grid con `fr` para distribución flexible

---

## Actividad 2: Página de Ficha de Producto y Página de Búsqueda

### Ficha de Producto

#### Implementación
Se crearon 4 páginas de ficha de producto:
- `producto_tacos.html` - Taco Profesional Predator
- `producto_bolas.html` - Set de Bolas Premium Aramith
- `producto_tizas.html` - Tiza Master Chalk
- `producto_mesas.html` - Mesa de Snooker Professional

#### Grid Layout (Obligatorio)
Uso de CSS Grid para organizar la información del producto:

```css
.product-detail-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
}

@media (min-width: 768px) {
    .product-detail-grid {
        grid-template-columns: 1fr 1fr;
        gap: 3rem;
    }
}
```

#### Contenido Implementado
Cada ficha incluye:
1. **Nombre:** Título descriptivo del producto
2. **Imagen:** Con atributo `alt` descriptivo para accesibilidad
3. **Precio:** Destacado visualmente
4. **Características específicas:**
   - Especificaciones técnicas
   - Materiales de fabricación
   - Dimensiones
   - Garantía
   - Valoración con estrellas

### Página de Búsqueda

#### Implementación
Página `busqueda.html` con funcionalidad de búsqueda dinámica mediante parámetros URL.

#### Flexbox Layout (Obligatorio)
Uso de Flexbox para organizar las tarjetas de resultados:

```css
.search-results {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
}

.result-card {
    flex: 1 1 100%; /* Móvil: 1 por fila */
}

@media (min-width: 768px) {
    .result-card {
        flex: 1 1 calc(50% - 1rem); /* Sobremesa: 2 por fila */
    }
}
```

#### Funcionalidad Implementada
- Formulario de búsqueda en header funcional
- Redirección a `busqueda.html` con query parameter `?q=término`
- Visualización dinámica del término buscado mediante JavaScript
- Mínimo 4 resultados ficticios mostrados

#### Consistencia de Estilos
- Misma paleta de colores que la landing
- Header y footer idénticos
- Tipografía y espaciados coherentes
- Transiciones y estados hover consistentes

---

## Actividad 3: Librerías CSS

### Librería Seleccionada
Se integró **Bootstrap 5.3.2** mediante CDN en todas las páginas del proyecto.

### Integración
```html
<!-- Bootstrap CSS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" 
      rel="stylesheet" 
      integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" 
      crossorigin="anonymous">
<link rel="stylesheet" href="styles.css">

<!-- Bootstrap JS -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" 
        integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" 
        crossorigin="anonymous"></script>
```

**Nota:** Bootstrap se carga **antes** del CSS propio para permitir sobrescritura de estilos.

### Componentes Implementados (Mínimo 3)

#### 1. Badges (Etiquetas)
**Ubicación:** Tarjetas de productos
**Clases utilizadas:**
```html
<span class="badge bg-danger">Oferta</span>
<span class="badge bg-primary">Tacos</span>
<span class="badge bg-info">Accesorios</span>
<span class="badge bg-warning text-dark">Mesas</span>
```

**Propósito:** Destacar categorías y promociones de productos.

#### 2. Buttons (Botones)
**Ubicación:** Botones de acción en todo el sitio
**Clases utilizadas:**
```html
<button class="btn btn-success">Agregar al Carrito</button>
<a href="#" class="btn btn-primary">Ver Productos</a>
<a href="#" class="btn btn-secondary">Contáctanos</a>
```

**Propósito:** 
- Call-to-action (CTA) en hero
- Botones de agregar al carrito
- Navegación entre secciones

**Personalización CSS:**
```css
.btn-success {
    background-color: var(--color-mesa-verde);
    border-color: var(--color-mesa-verde);
}

.btn-success:hover {
    background-color: var(--color-verde-hover);
    border-color: var(--color-verde-hover);
}
```

#### 3. Alerts (Alertas)
**Ubicación:** Sección de productos destacados
**Clases utilizadas:**
```html
<div class="alert alert-info" role="alert">
    🎉 ¡Envío gratis en compras superiores a 100€!
</div>
```

**Propósito:** Comunicar promociones y mensajes importantes a los usuarios.

### Funcionalidad JavaScript de Bootstrap
Se integró el JavaScript de Bootstrap para:
- Interactividad de componentes
- Menú responsive móvil
- Sistema de alertas dismissibles

### Compatibilidad con CSS Propio
- Bootstrap se aplica primero
- CSS propio sobrescribe estilos cuando es necesario
- Variables CSS propias mantienen coherencia visual
- Sistema de utilidades de Bootstrap (`d-flex`, `gap-2`, `w-100`, etc.) complementa estilos personalizados

---

## Actividad 4: Hoja de Estilos Alternativa (Modo Oscuro)

### Descripción General
Implementación completa de modo oscuro con persistencia, detección automática de preferencias del sistema y control manual mediante botón de alternancia.

### Variables CSS para Modo Oscuro

#### Redefinición de Variables
Se crearon dos conjuntos de variables CSS:

**Modo Claro (`:root`):**
```css
:root {
    --color-fondo-principal: #FFFFFF;
    --color-fondo-secundario: #F8F9FA;
    --color-superficie: #FFFFFF;
    --color-texto-primario: #212121;
    --color-texto-secundario: #6C757D;
    --color-texto-terciario: #9CA3AF;
    --color-borde: #E5E7EB;
}
```

**Modo Oscuro (`:root.theme-dark`):**
```css
:root.theme-dark {
    --color-fondo-principal: #1E1E1E;
    --color-fondo-secundario: #252525;
    --color-superficie: #2D2D2D;
    --color-texto-primario: #E0E0E0;
    --color-texto-secundario: #B0B0B0;
    --color-texto-terciario: #808080;
    --color-borde: #404040;
}
```

#### Detección Automática (Media Query)
```css
@media (prefers-color-scheme: dark) {
    :root {
        --color-fondo-principal: #1E1E1E;
        --color-fondo-secundario: #252525;
        /* ... resto de variables ... */
    }
}
```

### Contraste Adecuado

#### Ratios de Contraste Implementados
Se verificó que todos los textos cumplan con WCAG AA (≥4.5:1):

**Modo Claro:**
- Texto sobre fondo blanco: `#212121` sobre `#FFFFFF` → **18.59:1** ✓
- Texto secundario: `#6C757D` sobre `#FFFFFF` → **4.69:1** ✓

**Modo Oscuro:**
- Texto sobre fondo oscuro: `#E0E0E0` sobre `#1E1E1E` → **12.63:1** ✓
- Enlaces: `#42A5F5` sobre `#1E1E1E` → **8.59:1** ✓

### Legibilidad de Enlaces, Botones y Superficies

#### Superficies (No Negro Puro)
Se evitó el uso de negro puro (`#000000`) para áreas grandes:

```css
/* Fondo principal: Gris muy oscuro en lugar de negro puro */
--color-fondo-principal: #1E1E1E; /* No #000000 */
--color-superficie: #2D2D2D;
```

**Justificación:** El negro puro causa fatiga visual en pantallas. El gris muy oscuro (#1E1E1E) mantiene profesionalismo sin el contraste agresivo.

#### Enlaces
Colores diferenciados para modo oscuro:

```css
:root.theme-dark a {
    color: #42A5F5; /* Azul más claro para mejor contraste */
}

:root.theme-dark a:hover {
    color: #64B5F6;
}

:root.theme-dark .footer-links a {
    color: var(--color-texto-secundario);
}

:root.theme-dark .footer-links a:hover {
    color: var(--color-mesa-verde);
}
```

#### Botones
Asegurado texto blanco en botones con fondos oscuros:

```css
:root.theme-dark .btn-primary,
:root.theme-dark .btn-secondary {
    color: var(--color-blanco-puro) !important;
}
```

#### Componentes Específicos
Estilos mejorados para modo oscuro:

```css
/* Tarjetas de producto */
:root.theme-dark .product-card {
    background: var(--color-superficie);
    border-color: var(--color-borde);
}

/* Testimonios */
:root.theme-dark .testimonial-card {
    background: var(--color-superficie);
    border-color: var(--color-borde);
}

/* Filtros de catálogo */
:root.theme-dark .catalog-filters {
    background: var(--color-superficie);
    border: 1px solid var(--color-borde);
}

/* Botones de categoría */
:root.theme-dark .category-btn {
    background: var(--color-fondo-secundario);
    color: var(--color-texto-primario);
}

:root.theme-dark .category-btn.active {
    background: var(--color-azul-profundo);
    color: #fff;
}
```

### Funcionalidad JavaScript del Modo Oscuro

#### Sistema de Alternancia de Tema
Se implementó un sistema completo de gestión de temas:

**Inicialización:**
```javascript
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        enableDarkMode();
    } else {
        enableLightMode();
    }
}
```

**Activación de Modos:**
```javascript
function enableDarkMode() {
    document.documentElement.classList.add('theme-dark');
    document.documentElement.classList.remove('theme-light');
    localStorage.setItem('theme', 'dark');
    updateThemeButton(true);
}

function enableLightMode() {
    document.documentElement.classList.add('theme-light');
    document.documentElement.classList.remove('theme-dark');
    localStorage.setItem('theme', 'light');
    updateThemeButton(false);
}
```

**Alternancia Manual:**
```javascript
function toggleTheme() {
    if (document.documentElement.classList.contains('theme-dark')) {
        enableLightMode();
    } else {
        enableDarkMode();
    }
}
```

#### Botón de Alternancia
Implementado en header de todas las páginas:

```html
<button class="theme-toggle-btn" id="themeToggle" aria-label="Cambiar tema">
    <svg class="sun-icon"><!-- Icono de sol --></svg>
    <svg class="moon-icon" style="display: none;"><!-- Icono de luna --></svg>
</button>
```

**Estilos del botón:**
```css
.theme-toggle-btn {
    padding: 0.5rem;
    border: 2px solid var(--color-borde);
    border-radius: var(--border-radius);
    color: var(--color-texto-primario);
    background-color: transparent;
    transition: all 0.3s ease;
}

.theme-toggle-btn:hover {
    background-color: var(--color-fondo-secundario);
    border-color: var(--color-mesa-verde);
    transform: scale(1.05);
}
```

#### Persistencia con localStorage
- Preferencia guardada en `localStorage.setItem('theme', 'dark'|'light')`
- Recuperada automáticamente al cargar cualquier página
- Sincronizada entre todas las páginas del sitio

#### Detección de Preferencias del Sistema
```javascript
// Escucha cambios en la preferencia del sistema
const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
darkModeQuery.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        if (e.matches) {
            enableDarkMode();
        } else {
            enableLightMode();
        }
    }
});
```

### Transiciones Suaves
Todas las propiedades relacionadas con el tema tienen transiciones:

```css
body {
    transition: background-color 0.3s ease, color 0.3s ease;
}

.header {
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.product-card {
    transition: background-color 0.3s ease, border-color 0.3s ease, transform 0.2s;
}
```

### Elementos Adaptados al Modo Oscuro

#### Hero SVG Overlay
El SVG decorativo del hero se adapta automáticamente:

```css
.hero-svg-overlay path:first-child {
    fill: var(--color-fondo-principal); /* Blanco en claro, oscuro en dark */
}
```

#### Imágenes
Opacidad reducida en modo oscuro para mejor integración:

```css
:root.theme-dark .product-image,
:root.theme-dark .hero-image img {
    opacity: 0.9;
    transition: opacity 0.3s ease;
}

:root.theme-dark .product-card:hover .product-image {
    opacity: 1;
}
```

#### Footer
Títulos y enlaces adaptados:

```css
.footer-heading {
    color: var(--color-mesa-verde); /* Verde en ambos modos */
}

:root.theme-dark .footer-links a {
    color: var(--color-texto-secundario);
}

:root.theme-dark .footer-links a:hover {
    color: var(--color-mesa-verde);
}
```

---

## Estructura Final del Proyecto

```
TareaOnline_02/
├── Actividades_1_&_2/
│   ├── index.html
│   ├── productos.html
│   ├── busqueda.html
│   ├── producto_tacos.html
│   ├── producto_bolas.html
│   ├── producto_tizas.html
│   ├── producto_mesas.html
│   ├── styles.css
│   ├── script.js
│   └── images/
│
├── Actividad_3/
│   ├── (mismos archivos con Bootstrap integrado)
│
└── Actividad_4/
    ├── (mismos archivos con modo oscuro)
    └── (todos los archivos HTML + CSS + JS con tema)
```

---

## Tecnologías Utilizadas

### HTML5
- Estructura semántica
- Atributos ARIA para accesibilidad
- Formularios con atributos nativos de validación

### CSS3
- Variables CSS (Custom Properties)
- Grid Layout
- Flexbox
- Media Queries
- Pseudo-clases y pseudo-elementos
- Transformaciones y transiciones
- Función `clamp()` para tipografía fluida

### JavaScript (Vanilla)
- Manipulación del DOM
- LocalStorage API
- MediaQuery API (matchMedia)
- Event Listeners
- Gestión de estado del tema

### Bootstrap 5.3.2
- Sistema de Grid
- Componentes (Badges, Buttons, Alerts)
- Utilidades (spacing, display, flex)

### Fuentes
- Google Fonts:
  - Roboto (títulos y navegación)
  - Open Sans (cuerpo de texto)
  - Oswald (títulos impactantes)
  - Atkinson Hyperlegible (accesibilidad)

---

## Características de Accesibilidad

### Implementadas
1. **Etiquetas semánticas:** `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`
2. **Atributos ARIA:** `aria-label` en botones de iconos
3. **Alt text:** Descripciones detalladas en todas las imágenes
4. **Contraste:** Todos los textos cumplen WCAG AA (≥4.5:1)
5. **Focus visible:** Estados `:focus-visible` en elementos interactivos
6. **Navegación por teclado:** Todos los elementos interactivos accesibles con Tab
7. **Fuente legible:** Atkinson Hyperlegible para mejor legibilidad
8. **Modo oscuro:** Reduce fatiga visual en entornos con poca luz

---

## Funcionalidades Destacadas

### 1. Búsqueda Funcional
- Formulario en header con método GET
- Parámetros URL (`?q=término`)
- Visualización dinámica del término buscado
- Resultados responsivos con Flexbox

### 2. Carrito de Compras
- Contador funcional en header
- Incremento al pulsar "Agregar al Carrito"
- Persistencia en sesión mediante JavaScript
- Feedback visual al agregar productos

### 3. Menú Móvil
- Hamburguesa animada
- Slide-in desde arriba
- Cierre automático al seleccionar opción
- Transiciones suaves

### 4. Filtrado de Productos
- Botones de categoría funcionales
- Muestra/oculta productos según categoría
- Opción "Todos" para ver catálogo completo
- Estados activos visuales

### 5. Modo Oscuro Inteligente
- Detección automática de preferencias del sistema
- Alternancia manual con botón
- Persistencia entre páginas
- Sincronización en tiempo real

---

## Validación y Testing

### Navegadores Testeados
- ✓ Google Chrome
- ✓ Mozilla Firefox
- ✓ Microsoft Edge
- ✓ Safari (escritorio)

### Dispositivos Testeados
- ✓ Desktop (1920x1080, 1366x768)
- ✓ Tablet (768x1024)
- ✓ Móvil (375x667, 414x896)

### Herramientas de Validación
- ✓ W3C HTML Validator
- ✓ W3C CSS Validator
- ✓ Lighthouse (Performance, Accessibility, Best Practices, SEO)
- ✓ WebAIM Contrast Checker

---

## Conclusiones

### Objetivos Alcanzados
✓ Landing page completa y responsiva  
✓ Páginas de ficha de producto con Grid Layout  
✓ Página de búsqueda con Flexbox  
✓ Integración de Bootstrap en 3 o más componentes  
✓ Modo oscuro funcional con accesibilidad  
✓ Código validado sin errores  
✓ Header y footer reutilizables  
✓ Tipografía fluida y responsive  
✓ Estados hover/focus implementados  
✓ Variables CSS para mantenibilidad  

### Aprendizajes Clave
1. **Variables CSS:** Facilitan mantenimiento y cambios globales
2. **Grid vs Flexbox:** Cada uno tiene su uso óptimo (Grid para layouts 2D, Flex para 1D)
3. **Bootstrap:** Acelera desarrollo pero requiere personalización para identidad única
4. **Modo Oscuro:** Requiere planificación desde el inicio con variables semánticas
5. **Accesibilidad:** No es opcional, debe integrarse desde el diseño

### Mejoras Futuras
- Animaciones más complejas con CSS/JS
- Optimización de imágenes (WebP, lazy loading)
- PWA (Progressive Web App) features
- Backend para funcionalidad de carrito real
- Sistema de autenticación de usuarios
- Integración con pasarela de pagos

---

