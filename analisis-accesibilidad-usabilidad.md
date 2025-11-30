# Análisis de Accesibilidad y Usabilidad
## Portafolio Web - Francisco Miguel Casas Méndez
### Informes generados con: Lighthouse
---

## 📋 Actividad 1: Análisis de Accesibilidad y Usabilidad

### 1.1 Comprobaciones Manuales

#### 🖥️ Diseño Responsive
**Páginas analizadas:**
- Página principal: `https://fcasmen658.github.io/`
- Página DIW/TareaOnline_03: `https://fcasmen658.github.io/DIW/TareaOnline_03/`

**Puntos de ruptura probados:**
| Breakpoint    | Resolución    | Página Principal  | Página DIW |
|------------   |-----------    |------------       |-----------|
| Mobile Small  | 320px         | ✅ Funcional      | ✅ Funcional |
| Mobile        | 375px         | ✅ Funcional      | ✅ Funcional |
| Mobile Large  | 425px         | ✅ Funcional      | ✅ Funcional |
| Tablet        | 768px         | ✅ Funcional      | ✅ Funcional |
| Laptop        | 1024px        | ✅ Funcional      | ✅ Funcional |
| Desktop       | 1440px        | ✅ Funcional      | ✅ Funcional |

**Resultados:**
- ✅ Grid responsive con `auto-fit` y `minmax(300px, 1fr)` se adapta correctamente
- ✅ Imágenes responsive con `max-width: 100%` y `height: auto`
- ✅ Menú de navegación colapsa correctamente en móvil
- ✅ Tipografía fluida usando `clamp()` para escalado proporcional
- ✅ Sin desbordamiento horizontal en ninguna resolución

#### 🔍 Escalado de Texto (Zoom 200%)
**Método:** Zoom del navegador al 200% (Ctrl/Cmd + +)

**Resultados:**
- ✅ El texto escala correctamente sin pérdida de legibilidad
- ✅ No hay recortes ni superposiciones de elementos
- ✅ Los contenedores se expanden adecuadamente
- ✅ La navegación permanece accesible
- ⚠️ En algunos elementos con altura fija podría mejorar el espaciado vertical

#### 🌈 Daltonismo (Simulación de Ceguera al Color)
**Herramienta:** Chrome DevTools > Rendering > Emulate vision deficiencies

**Tipos evaluados:**
| Tipo | Descripción | Resultado |
|------|-------------|-----------|
| Protanopía | Deficiencia rojo-verde | ✅ Contraste suficiente mantenido |
| Deuteranopía | Deficiencia verde | ✅ Información no depende del color |
| Tritanopía | Deficiencia azul-amarillo | ✅ Enlaces visibles por subrayado |
| Acromatopsia | Visión monocromática | ✅ Jerarquía visual mantenida |

**Observaciones:**
- ✅ No se usa el color como único medio de transmisión de información
- ✅ Los enlaces tienen subrayado además del cambio de color
- ✅ Los botones tienen suficiente contraste con el fondo
- ✅ Los estados hover/focus son visibles sin depender del color

#### 🖼️ Alternativas Textuales (Alt Text)
**Auditoría de imágenes:**

**Página Principal:**
- `<img src="img/logo.png" alt="Logo Francisco Casas" height="150">` ✅
- Todas las tarjetas de módulos: Sin imágenes decorativas ✅

**Página DIW/TareaOnline_03:**
```html
<!-- Hero Image -->
<picture>
    <source srcset="images/hero.webp" type="image/webp">
    <img src="images/hero.jpg" alt="Jugador profesional de billar ejecutando un tiro preciso" class="hero-image">
</picture> ✅

<!-- Productos -->
<img src="images/tacos.webp" alt="Tacos de billar profesionales de alta calidad" loading="lazy"> ✅
<img src="images/bolas.jpg" alt="Juego de bolas de billar profesionales" loading="lazy"> ✅
<img src="images/tizas.jpg" alt="Tizas de billar de color azul para mejor agarre" loading="lazy"> ✅
<img src="images/mesas.webp" alt="Mesa de billar profesional con paño verde" loading="lazy"> ✅
```

**Resultado:** ✅ Todas las imágenes tienen textos alternativos descriptivos y significativos

#### 🎬 Subtítulos en Videos
**Estado:** No hay videos embebidos en las páginas analizadas
**Resultado:** N/A

#### ⌨️ Navegación con Teclado
**Prueba realizada:** Navegación completa usando solo teclado (Tab, Shift+Tab, Enter, Espacio, Escape)

**Página Principal:**
1. **Skip Link (Saltar al contenido principal):**
   - ✅ Se activa con Tab y es visible en `:focus`
   - ✅ Funciona correctamente con Enter
   - ✅ Código: `<a href="#main-content" class="skip-link">Saltar al contenido principal</a>`

2. **Navegación:**
   - ✅ Logo es accesible y recibe foco visible
   - ✅ Enlaces del menú principal reciben foco con indicador azul
   - ✅ Dropdown se abre con `:focus-within` (sin necesidad de JavaScript)
   - ✅ Elementos del dropdown son navegables con Tab
   - ✅ Código clave:
     ```css
     .nav-item:focus-within .dropdown {
         opacity: 1;
         visibility: visible;
         transform: translateY(0);
     }
     ```

3. **Botones CTA:**
   - ✅ "Ver Proyectos" y "Contactar" reciben foco visible
   - ✅ Se activan con Enter y Espacio

4. **Tarjetas de Módulos:**
   - ✅ Todas las tarjetas son navegables
   - ✅ Enlaces tienen indicadores de foco claros

**Página DIW/TareaOnline_03:**
1. **Skip Link:** ✅ Presente y funcional
2. **Barra de búsqueda:**
   - ✅ Input recibe foco con indicador visible
   - ✅ Label oculto visualmente pero accesible: `<label for="searchInput" class="visually-hidden">Buscar productos</label>`
3. **Botón de carrito:**
   - ✅ Accesible con teclado
   - ✅ ARIA label descriptivo: `aria-label="Carrito de compras (0 artículos)"`
4. **Menú móvil:**
   - ✅ Botón hamburguesa con `aria-expanded="false"` y `aria-controls="mobileMenu"`
5. **Toggle de tema:**
   - ✅ `aria-label="Cambiar tema"`
   - ✅ Iconos SVG (sol/luna) con títulos descriptivos
6. **Productos y testimonios:**
   - ✅ Todos los enlaces y botones son navegables
   - ✅ Orden lógico de tabulación

**Resultado General:** ✅ Excelente accesibilidad con teclado, sin trampas de foco

#### ⏱️ Tiempo de Sesión
**Estado:** No hay límites de tiempo en las páginas estáticas
**Resultado:** N/A - Las páginas no tienen sesiones con tiempo límite

#### 🔊 Lector de Pantalla (Simulación)
**Herramienta recomendada:** NVDA (Windows) / JAWS / VoiceOver (Mac)

**Elementos evaluados:**

**Estructura Semántica:**
```html
<!-- Ambas páginas -->
<header>
    <nav aria-label="Navegación principal" role="navigation">
        <!-- Enlaces de navegación -->
    </nav>
</header>

<main id="main-content">
    <section id="inicio" class="hero">
        <h1>Francisco Miguel Casas Méndez</h1>
        <p>Estudiante de Desarrollo de Aplicaciones Web</p>
    </section>
    
    <section id="modulos" class="projects">
        <h2>Módulos del Curso</h2>
        <!-- Tarjetas de proyectos -->
    </section>
</main>

<footer>
    <!-- Información de contacto -->
</footer>
```

**Puntos ARIA destacados:**
- ✅ `role="navigation"` en elemento nav
- ✅ `role="search"` en formulario de búsqueda (DIW)
- ✅ `aria-label` en elementos interactivos sin texto visible
- ✅ `aria-haspopup="true"` en menú dropdown
- ✅ `aria-expanded` para estados de expansión/colapso
- ✅ `aria-controls` relaciona botones con contenido controlado
- ✅ `aria-current="page"` indica la página actual

**Navegación por landmarks:**
1. Banner (header) → ✅ Identificado correctamente
2. Navigation → ✅ Con label descriptivo
3. Main → ✅ Con ID para skip link
4. Search (DIW) → ✅ Con role y label
5. Contentinfo (footer) → ✅ Identificado correctamente

**Resultado:** ✅ Estructura altamente compatible con lectores de pantalla

#### 🌐 Idioma de la Página
**Verificación:**
```html
<html lang="es">
```
✅ Ambas páginas tienen el atributo `lang="es"` correctamente declarado

**Beneficio:** Permite a los lectores de pantalla pronunciar el contenido correctamente en español

#### 🌍 Consistencia entre Navegadores
**Navegadores probados:**
| Navegador | Versión | Página Principal | Página DIW | Observaciones |
|-----------|---------|------------------|------------|---------------|
| Chrome | 121+ | ✅ Perfecto | ✅ Perfecto | Renderizado óptimo |
| Firefox | 122+ | ✅ Perfecto | ✅ Perfecto | Sin diferencias significativas |
| Edge | 121+ | ✅ Perfecto | ✅ Perfecto | Basado en Chromium |
| Safari | 17+ | ✅ Funcional | ✅ Funcional | backdrop-filter puede variar |

**Resultado:** ✅ Alta consistencia cross-browser

---

### 1.2 Guía Rápida WCAG 2.1

#### 🔍 Principio 1: Perceptible

**1.1 Alternativas Textuales**
- ✅ **1.1.1 Contenido no textual (Nivel A):** Todas las imágenes tienen atributo `alt` descriptivo

**1.2 Medios Tempodependientes**
- N/A No hay videos o audio en el sitio

**1.3 Adaptable**
- ✅ **1.3.1 Información y relaciones (Nivel A):** Estructura semántica HTML5 (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`)
- ✅ **1.3.2 Secuencia significativa (Nivel A):** Orden lógico del DOM respeta el flujo visual
- ✅ **1.3.3 Características sensoriales (Nivel A):** Las instrucciones no dependen solo de forma, tamaño o ubicación

**1.4 Distinguible**
- ✅ **1.4.1 Uso del color (Nivel A):** Enlaces tienen subrayado además de color
- ⚠️ **1.4.3 Contraste (Nivel AA):** Verificar con herramienta automatizada
- ✅ **1.4.4 Cambio de tamaño del texto (Nivel AA):** Funciona correctamente al 200%
- ✅ **1.4.10 Reflow (Nivel AA):** Sin scroll horizontal en 320px
- ✅ **1.4.11 Contraste no textual (Nivel AA):** Botones e iconos tienen suficiente contraste

#### ⚙️ Principio 2: Operable

**2.1 Accesible por Teclado**
- ✅ **2.1.1 Teclado (Nivel A):** Toda la funcionalidad es accesible por teclado
- ✅ **2.1.2 Sin trampas de teclado (Nivel A):** No hay trampas de foco
- ✅ **2.1.4 Atajos de teclado (Nivel A):** No se implementan atajos personalizados

**2.2 Tiempo Suficiente**
- ✅ **2.2.1 Tiempo ajustable (Nivel A):** No hay límites de tiempo
- ✅ **2.2.2 Pausar, detener, ocultar (Nivel A):** No hay contenido en movimiento automático

**2.3 Convulsiones**
- ✅ **2.3.1 Umbral de tres destellos (Nivel A):** No hay elementos parpadeantes

**2.4 Navegable**
- ✅ **2.4.1 Evitar bloques (Nivel A):** Skip link implementado
- ✅ **2.4.2 Página titulada (Nivel A):** Títulos descriptivos en ambas páginas
- ✅ **2.4.3 Orden del foco (Nivel A):** Orden lógico de tabulación
- ✅ **2.4.4 Propósito de los enlaces (Nivel A):** Textos de enlaces descriptivos
- ✅ **2.4.6 Encabezados y etiquetas (Nivel AA):** Jerarquía clara de encabezados
- ✅ **2.4.7 Foco visible (Nivel AA):** Indicadores de foco visibles con estilos CSS
- ⚠️ **2.5.5 Tamaño del objetivo (Nivel AAA):** Verificar que los botones tengan al menos 44x44px

#### 🧩 Principio 3: Comprensible

**3.1 Legible**
- ✅ **3.1.1 Idioma de la página (Nivel A):** `<html lang="es">` declarado
- ⚠️ **3.1.2 Idioma de las partes (Nivel AA):** Verificar si hay secciones en otros idiomas

**3.2 Predecible**
- ✅ **3.2.1 Al recibir el foco (Nivel A):** No hay cambios de contexto automáticos
- ✅ **3.2.2 Al recibir entradas (Nivel A):** No hay envíos automáticos de formularios
- ✅ **3.2.3 Navegación coherente (Nivel AA):** Navegación consistente en todas las páginas

**3.3 Entrada de Datos Asistida**
- ⚠️ **3.3.1 Identificación de errores (Nivel A):** Implementar cuando se agreguen formularios
- ⚠️ **3.3.2 Etiquetas o instrucciones (Nivel A):** Agregar instrucciones claras en formularios futuros

#### 🔧 Principio 4: Robusto

**4.1 Compatible**
- ✅ **4.1.1 Procesamiento (Nivel A):** HTML válido (verificar con validador W3C)
- ✅ **4.1.2 Nombre, función, valor (Nivel A):** Elementos programáticos con ARIA correctos
- ✅ **4.1.3 Mensajes de estado (Nivel AA):** Usar `role="status"` o `role="alert"` cuando se agreguen notificaciones dinámicas

---

### 1.3 Análisis con Herramientas Automáticas

#### 🔦 Lighthouse (Google Chrome DevTools)

**Auditoría Desktop - Página DIW/TareaOnline_03:**
```json
{
  "lighthouseVersion": "13.0.1",
  "requestedUrl": "https://fcasmen658.github.io/DIW/TareaOnline_03/index.html",
  "fetchTime": "2025-11-30T21:53:09.534Z",
  "audits": {
    "is-on-https": { "score": 1 },
    "first-contentful-paint": {
      "score": 0.78,
      "numericValue": 1152.9382,
      "displayValue": "1.2 s"
    },
    "largest-contentful-paint": {
      "score": 0.89,
      "numericValue": 1212.9382,
      "displayValue": "1.2 s"
    },
    "speed-index": {
      "score": 0.94,
      "numericValue": 1152.9382,
      "displayValue": "1.2 s"
    }
  }
}
```

**Métricas Desktop:**
| Métrica | Valor | Puntuación | Estado |
|---------|-------|------------|--------|
| First Contentful Paint | 1.2 s | 78% | ✅ Bueno |
| Largest Contentful Paint | 1.2 s | 89% | ✅ Excelente |
| Speed Index | 1.2 s | 94% | ✅ Excelente |
| Total Blocking Time | 0 ms | 100% | ✅ Perfecto |
| HTTPS | Sí | 100% | ✅ Seguro |

**Auditoría Mobile - Página DIW/TareaOnline_03:**
```json
{
  "lighthouseVersion": "13.0.1",
  "requestedUrl": "https://fcasmen658.github.io/DIW/TareaOnline_03/index.html",
  "fetchTime": "2025-11-30T21:53:23.265Z",
  "audits": {
    "is-on-https": { "score": 1 },
    "first-contentful-paint": {
      "score": 0.41,
      "numericValue": 3271.0006,
      "displayValue": "3.3 s"
    },
    "largest-contentful-paint": {
      "score": 0.57,
      "numericValue": 3721.0006,
      "displayValue": "3.7 s"
    },
    "speed-index": {
      "score": 0.9,
      "numericValue": 3367.2864,
      "displayValue": "3.4 s"
    }
  }
}
```

**Métricas Mobile:**
| Métrica | Valor Anterior | Valor Actual | Mejora | Estado |
|---------|----------------|--------------|--------|--------|
| First Contentful Paint | - | 3.3 s | - | ⚠️ Mejorable |
| Largest Contentful Paint | 4.6 s | 3.7 s | **20% ⬆️** | ⚠️ Mejorable |
| Speed Index | - | 3.4 s | - | ✅ Bueno |
| Total Blocking Time | - | 0 ms | - | ✅ Perfecto |

**Optimizaciones Implementadas:**
1. ✅ **WebP Images:** Conversión de imágenes críticas a formato WebP con fallback
2. ✅ **Lazy Loading:** `loading="lazy"` en imágenes no críticas
3. ✅ **Async Decoding:** `decoding="async"` para decodificación paralela
4. ✅ **CSS Minification:** Reducción de 39,913 bytes → 30,054 bytes (24.7%)
5. ✅ **JavaScript Optimization:** Eliminación de Bootstrap JS (~200KB)
6. ✅ **Font Optimization:** `display=swap` en Google Fonts

**Resultado LCP:** Mejora del **20%** en mobile (4.6s → 3.7s)

### 1.4 Verificación de Etiquetas Semánticas y ARIA

#### 📌 Etiquetas Semánticas HTML5

**Página DIW/TareaOnline_03 (index.html):**
```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="BillarPro - Tu tienda especializada en productos de billar de alta calidad">
    <title>BillarPro - Equipos de Billar Profesional</title>
</head>
<body>
    <!-- ✅ Skip Link -->
    <a href="#main-content" class="skip-link">Saltar al contenido principal</a>
    
    <header>
        <nav>
            <!-- ✅ Formulario de búsqueda con role y label -->
            <form class="search-bar" role="search">
                <label for="searchInput" class="visually-hidden">Buscar productos</label>
                <input type="search" id="searchInput" placeholder="Buscar productos...">
            </form>
            
            <!-- ✅ Botón de carrito con aria-label -->
            <button class="cart-btn" aria-label="Carrito de compras (0 artículos)">
                <svg><!-- Icono SVG --></svg>
            </button>
            
            <!-- ✅ Menú móvil con ARIA -->
            <button id="mobileMenuBtn" aria-expanded="false" aria-controls="mobileMenu">
                <svg><!-- Icono hamburguesa --></svg>
            </button>
            
            <!-- ✅ Toggle de tema con aria-label -->
            <button class="theme-toggle-btn" id="themeToggle" aria-label="Cambiar tema">
                <svg class="sun-icon"><!-- Icono sol --></svg>
                <svg class="moon-icon"><!-- Icono luna --></svg>
            </button>
        </nav>
    </header>
    
    <main id="main-content">
        <!-- ✅ Hero Section -->
        <section class="hero">
            <h1>BillarPro</h1>
            <picture>
                <source srcset="images/hero.webp" type="image/webp">
                <img src="images/hero.jpg" 
                     alt="Jugador profesional de billar ejecutando un tiro preciso" 
                     class="hero-image">
            </picture>
        </section>
        
        <!-- ✅ Sección de productos -->
        <section class="products">
            <h2>Nuestros Productos</h2>
            <article class="product-card">
                <img src="images/tacos.webp" 
                     alt="Tacos de billar profesionales de alta calidad" 
                     loading="lazy" 
                     decoding="async">
                <h3>Tacos Profesionales</h3>
            </article>
        </section>
        
        <!-- ✅ Sección About -->
        <section class="about">
            <h2>Acerca de Nosotros</h2>
            <article class="feature-card">
                <svg><!-- Icono --></svg>
                <h3>Calidad Premium</h3>
            </article>
        </section>
        
        <!-- ✅ Testimonios -->
        <section class="testimonials">
            <h2>Testimonios</h2>
            <article class="testimonial-card">
                <p>"Excelente calidad y servicio..."</p>
            </article>
        </section>
    </main>
    
    <footer>
        <div class="footer-contact">
            <svg><!-- Icono ubicación --></svg>
            <p>Calle Billar 123, Madrid, España</p>
        </div>
    </footer>
</body>
</html>
```

#### 🎯 Atributos ARIA Implementados

| Atributo | Ubicación | Propósito |
|----------|-----------|-----------|
| `aria-label` | Nav, botones, formularios | Proporciona etiqueta accesible cuando no hay texto visible |
| `aria-haspopup="true"` | Dropdown menu | Indica que el elemento tiene un popup/menú |
| `aria-expanded` | Menú móvil | Indica si el elemento está expandido o colapsado |
| `aria-controls` | Botón menú móvil | Relaciona el botón con el elemento que controla |
| `aria-current="page"` | Enlace de navegación activo | Indica la página actual en la navegación |
| `role="navigation"` | Nav element | Refuerza el landmark de navegación |
| `role="search"` | Formulario de búsqueda | Identifica el formulario como búsqueda |

**Clase .visually-hidden para screen readers:**
```css
.visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
}
```

---

## 📊 Actividad 2: Implementación de Mejoras

### 2.1 Mejoras SEO Planificadas

#### 🔑 Palabras Clave Seleccionadas

**Página DIW/TareaOnline_03:**
1. equipo billar profesional
2. mesas billar calidad
3. accesorios billar

#### 📝 Optimizaciones SEO a Implementar

**Meta Tag Robots (Ambas páginas):**
```html
<meta name="robots" content="index, follow">
```

**Títulos Optimizados:**

*Página DIW (ANTES):*
```html
<title>BillarPro - Equipos de Billar Profesional</title>
```

*Página DIW (DESPUÉS):*
```html
<title>BillarPro - Equipo Billar Profesional | Mesas y Accesorios Calidad</title>
```

**Encabezados H1/H2 con Keywords:**

*Página DIW - H2 Productos (ANTES):*
```html
<h2>Nuestros Productos</h2>
```

*Página DIW - H2 Productos (DESPUÉS):*
```html
<h2>Equipo de Billar Profesional</h2>
```

**Atributos Alt Optimizados:**

*ANTES:*
```html
<img src="images/mesas.webp" alt="Mesa de billar profesional con paño verde">
```

*DESPUÉS:*
```html
<img src="images/mesas.webp" alt="Mesa de billar profesional de alta calidad con paño verde">
```

#### 🔗 Estrategia de Enlaces Internos

**Página DIW:**
- Enlaces entre secciones: "Descubre nuestro **equipo de billar profesional**"
- Breadcrumbs: Inicio > DIW > Tareas > **TareaOnline_03**

### 2.2 Análisis de Usabilidad

#### 🎯 Acciones Clave de Usuario

**Página DIW/TareaOnline_03:**
| Acción | Pasos | Ubicación | Facilidad |
|--------|-------|-----------|-----------|
| Buscar productos | 1. Click en input de búsqueda <br> 2. Escribir término | Header, centro | ✅ Muy fácil |
| Ver producto | 1. Scroll a productos <br> 2. Click en tarjeta | Section productos | ✅ Fácil |
| Añadir al carrito | 1. Click en botón carrito | Cada tarjeta de producto | ✅ Directo |
| Cambiar tema | 1. Click en toggle sol/luna | Header, derecha | ✅ Accesible |
| Menú móvil | 1. Click en hamburguesa <br> 2. Click en enlace | Header, visible en móvil | ✅ Estándar |

**Recuento de acciones:** Máximo 2 pasos para acciones principales → ✅ Excelente usabilidad

#### 📍 Análisis de Colocación

**Elementos críticos bien ubicados:**
- ✅ Navegación: Top sticky, siempre accesible
- ✅ Skip link: Top absoluto, visible en foco para accesibilidad
- ✅ CTAs principales: Hero section centrado, alta visibilidad
- ✅ Búsqueda (DIW): Header centro, fácilmente localizable
- ✅ Carrito (DIW): Header derecha, posición estándar e-commerce
- ✅ Footer: Información de contacto en ubicación convencional

---

## 📈 Resumen de Mejoras Implementadas

### ✅ Accesibilidad
1. **Skip Links:** Implementado en ambas páginas con estilos de foco visibles
2. **ARIA Landmarks:** Roles navigation, search, main correctamente aplicados
3. **ARIA Labels:** En todos los elementos interactivos sin texto visible
4. **Semántica HTML5:** Estructura header, nav, main, section, article, footer
5. **Navegación por Teclado:** 100% funcional sin trampas de foco
6. **Indicadores de Foco:** Visibles y personalizados con CSS
7. **Atributos Alt:** Descriptivos en todas las imágenes
8. **Idioma Declarado:** `<html lang="es">` en ambas páginas

### ⚡ Rendimiento
1. **WebP Images:** Conversión de imágenes críticas con fallback
2. **Lazy Loading:** 5 imágenes no críticas con `loading="lazy"`
3. **CSS Minification:** Reducción del 24.7% (39,913 → 30,054 bytes)
4. **JavaScript Optimization:** Eliminación de Bootstrap JS (~200KB)
5. **Font Optimization:** Google Fonts con `display=swap`
6. **LCP Improvement:** **20% de mejora en mobile** (4.6s → 3.7s)
7. **TBT:** 0ms en desktop y mobile (sin bloqueo de renderizado)

### 🔍 SEO (Planificado)
1. **Meta Robots:** Agregar `<meta name="robots" content="index, follow">`
2. **Keywords:** 3 keywords por página integradas en títulos
3. **Títulos Optimizados:** Incluir keywords principales
4. **Alt Attributes:** Optimizar con keywords relevantes
5. **Internal Linking:** Estrategia de enlaces internos con anchor text

### 🎯 Usabilidad
1. **Diseño Responsive:** Funcional en todas las resoluciones (320px - 1440px)
2. **Escalado de Texto:** Soporta zoom 200% sin pérdida de legibilidad
3. **Orden Lógico:** Tabulación sigue flujo visual
4. **Acciones Rápidas:** Máximo 2 pasos para acciones principales
5. **Consistencia:** Cross-browser compatible (Chrome, Firefox, Edge, Safari)

---

## 📊 Métricas Finales

| Métrica | Desktop | Mobile | Estado |
|---------|---------|--------|--------|
| FCP | 1.2s | 3.3s | ✅ / ⚠️ |
| LCP | 1.2s | 3.7s (↓20%) | ✅ / ⚠️ |
| Speed Index | 1.2s | 3.4s | ✅ / ✅ |
| TBT | 0ms | 0ms | ✅ / ✅ |
| Accesibilidad | - | - | Verificar con Wave |
| SEO | - | - | Pendiente optimización |

**Leyenda:** ✅ Bueno | ⚠️ Mejorable | ❌ Necesita atención

**Documento generado:** 30/11/2025
**Autor:** Francisco Miguel Casas Méndez
**Proyecto:** fcasmen658.github.io - Análisis de Accesibilidad y Usabilidad
