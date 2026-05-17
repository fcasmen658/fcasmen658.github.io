// ===================================
// VARIABLES GLOBALES
// ===================================
// Elementos interactivos donde los atajos de teclado deben ignorarse
const INTERACTIVE_TAGS = ["INPUT", "TEXTAREA", "SELECT"];
function isTyping() {
  const el = document.activeElement;
  return (
    INTERACTIVE_TAGS.includes(el?.tagName) ||
    el?.isContentEditable
  );
}
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const menuIcon = mobileMenuBtn?.querySelector(".menu-icon");
const closeIcon = mobileMenuBtn?.querySelector(".close-icon");
const mobileMenuLabel = mobileMenuBtn?.querySelector(".visually-hidden");
const mobileLinks = document.querySelectorAll(".nav-link-mobile");

// ===================================
// TEMA OSCURO / CLARO
// ===================================
const themeToggle = document.getElementById("themeToggle");
const sunIcon = themeToggle?.querySelector(".sun-icon");
const moonIcon = themeToggle?.querySelector(".moon-icon");
const root = document.documentElement;

// Cargar preferencia guardada o detectar preferencia del sistema
function initTheme() {
  const savedTheme = localStorage.getItem("theme");
  const systemPrefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)",
  ).matches;

  if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
    enableDarkMode();
  } else {
    enableLightMode();
  }
}

function enableDarkMode() {
  root.classList.add("theme-dark");
  root.classList.remove("theme-light");
  if (sunIcon && moonIcon) {
    sunIcon.style.display = "none";
    moonIcon.style.display = "block";
  }
  localStorage.setItem("theme", "dark");
}

function enableLightMode() {
  root.classList.remove("theme-dark");
  root.classList.add("theme-light");
  if (sunIcon && moonIcon) {
    sunIcon.style.display = "block";
    moonIcon.style.display = "none";
  }
  localStorage.setItem("theme", "light");
}

function toggleTheme() {
  if (root.classList.contains("theme-dark")) {
    enableLightMode();
  } else {
    enableDarkMode();
  }
}

// Inicializar tema al cargar la página
initTheme();

// Event listener para el botón de tema
if (themeToggle) {
  themeToggle.addEventListener("click", toggleTheme);
}

// Escuchar cambios en la preferencia del sistema
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) {
      if (e.matches) {
        enableDarkMode();
      } else {
        enableLightMode();
      }
    }
  });

// ===================================
// MENÚ MÓVIL
// ===================================
function toggleMobileMenu() {
  if (!mobileMenu || !mobileMenuBtn || !menuIcon || !closeIcon) {
    return;
  }

  const isOpen = mobileMenu.classList.contains("active");
  const newState = !isOpen;

  if (newState) {
    mobileMenu.classList.add("active");
    menuIcon.style.display = "none";
    closeIcon.style.display = "block";
    mobileMenuBtn.setAttribute("aria-expanded", "true");
    mobileMenuBtn.setAttribute("aria-label", "Cerrar menú");
    mobileMenuBtn.setAttribute("title", "Cerrar menú");
    if (mobileMenuLabel) {
      mobileMenuLabel.textContent = "Cerrar menú principal";
    }
  } else {
    mobileMenu.classList.remove("active");
    menuIcon.style.display = "block";
    closeIcon.style.display = "none";
    mobileMenuBtn.setAttribute("aria-expanded", "false");
    mobileMenuBtn.setAttribute("aria-label", "Abrir menú");
    mobileMenuBtn.setAttribute("title", "Abrir menú");
    if (mobileMenuLabel) {
      mobileMenuLabel.textContent = "Abrir menú principal";
    }
  }
}

// Event listener para el botón del menú móvil
if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener("click", toggleMobileMenu);
}

// Cerrar menú cuando se hace clic en un enlace
mobileLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (!mobileMenu || !menuIcon || !closeIcon || !mobileMenuBtn) {
      return;
    }
    mobileMenu.classList.remove("active");
    menuIcon.style.display = "block";
    closeIcon.style.display = "none";
    mobileMenuBtn.setAttribute("aria-expanded", "false");
    mobileMenuBtn.setAttribute("aria-label", "Abrir menú");
    mobileMenuBtn.setAttribute("title", "Abrir menú");
    if (mobileMenuLabel) {
      mobileMenuLabel.textContent = "Abrir menú principal";
    }
  });
});

// ===================================
// SCROLL SUAVE PARA NAVEGACIÓN
// ===================================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");

    // Ignorar si es solo "#"
    if (href === "#") {
      e.preventDefault();
      return;
    }

    const target = document.querySelector(href);

    if (target) {
      e.preventDefault();

      // Calcular offset del header
      const headerHeight = document.querySelector(".header").offsetHeight;
      const targetPosition =
        target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  });
});

// ===================================
// HEADER STICKY CON SOMBRA AL SCROLL
// ===================================
const header = document.querySelector(".header");
let lastScroll = 0;

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;

  // Agregar/quitar sombra según el scroll
  if (currentScroll > 50) {
    header.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
  } else {
    header.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.05)";
  }

  lastScroll = currentScroll;
});

// ===================================
// ANIMACIONES AL HACER SCROLL
// IntersectionObserver activa la clase .is-visible en los elementos
// marcados con .animate-on-scroll. La animación es 100 % CSS;
// el JS solo añade/gestiona la clase.
// ===================================

// Si el usuario prefiere movimiento reducido, hacemos todo visible
// directamente sin esperar al observer (fallback inmediato).
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

const elementosAnimados = document.querySelectorAll(".animate-on-scroll");

if (prefersReducedMotion) {
  // Modo accesible: visibilidad inmediata, sin transición
  elementosAnimados.forEach((el) => el.classList.add("is-visible"));
} else {
  const observerOptions = {
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        // Dejar de observar el elemento una vez que ya fue revelado
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  elementosAnimados.forEach((el) => observer.observe(el));
}

// ===================================
// FUNCIONALIDAD DEL CARRITO
// ===================================
const cartButtons = document.querySelectorAll(".btn-cart, .btn-success");
const cartBadge = document.querySelector(".cart-badge");
let cartCount = parseInt(cartBadge?.textContent || "0");

cartButtons.forEach((button) => {
  button.addEventListener("click", function (e) {
    // Solo prevenir si es un botón de agregar al carrito
    if (this.textContent.includes("Agregar al Carrito")) {
      e.preventDefault();
    }

    // Incrementar contador solo si es botón de carrito
    if (this.textContent.includes("Agregar al Carrito")) {
      cartCount++;
      if (cartBadge) {
        cartBadge.textContent = cartCount;
      }

      // Animación del botón
      this.style.transform = "scale(0.95)";
      setTimeout(() => {
        this.style.transform = "scale(1)";
      }, 100);

      // Animación del badge del carrito
      if (cartBadge) {
        cartBadge.style.transform = "scale(1.3)";
        setTimeout(() => {
          cartBadge.style.transform = "scale(1)";
        }, 200);
      }
    }

    // Notificación visual (opcional)
    showNotification("Producto agregado al carrito");
  });
});

// ===================================
// NOTIFICACIONES
// ===================================
function showNotification(message) {
  // Crear elemento de notificación
  const notification = document.createElement("div");
  notification.textContent = message;
  // Leer variables CSS del documento para respetar el tema activo
  const rootStyles = getComputedStyle(document.documentElement);
  const bgColor = rootStyles.getPropertyValue("--color-mesa-verde").trim();
  const textColor = rootStyles.getPropertyValue("--color-blanco-puro").trim();

  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: ${bgColor};
        color: ${textColor};
        padding: 1rem 1.5rem;
        border-radius: 0.625rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        font-family: 'Roboto', sans-serif;
        font-weight: 500;
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;

  // Agregar al body
  document.body.appendChild(notification);

  // Eliminar después de 3 segundos
  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease";
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Agregar animaciones CSS para las notificaciones
const style = document.createElement("style");
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===================================
// FUNCIONALIDAD DE BÚSQUEDA
// ===================================
// El formulario de búsqueda ahora redirige a busqueda.html automáticamente

// ===================================
// LAZY LOADING DE IMÁGENES
// ===================================
const images = document.querySelectorAll("img[data-src]");

const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.removeAttribute("data-src");
      imageObserver.unobserve(img);
    }
  });
});

images.forEach((img) => imageObserver.observe(img));

// ===================================
// PREVENIR SCROLL HORIZONTAL
// ===================================
document.body.style.overflowX = "hidden";

// ===================================
// CONSOLE LOG DE BIENVENIDA
// ===================================
console.log(
  "%c¡Bienvenido a BillarPro! 🎱",
  "font-size: 20px; color: #2E7D32; font-weight: bold;",
);
console.log(
  "%cSitio desarrollado con HTML, CSS y JavaScript puro",
  "font-size: 14px; color: #1976D2;",
);

// ===================================
// ESTADÍSTICAS CON CHART.JS
// Sección #estadisticas — Apartado 4
// ===================================

// ── Datos por vista ──────────────────────────────────────────
// Cada clave corresponde al atributo data-chart de un botón.
const datosGraficos = {
  ratings: {
    tipo: "bar",
    etiquetas: ["Tacos", "Bolas", "Mesas", "Tizas", "Fundas", "Triángulos"],
    valores: [4.9, 4.8, 4.7, 4.4, 4.6, 4.5],
    label: "Valoración media (sobre 5 ★)",
    titulo: "Valoración media por producto (sobre 5 estrellas)",
    escalaMin: 4,
    escalaMax: 5,
  },
  sales: {
    tipo: "doughnut",
    etiquetas: ["Tacos", "Bolas", "Mesas", "Tizas", "Accesorios"],
    valores: [35, 25, 20, 12, 8],
    label: "% de ventas",
    titulo: "Distribución de ventas por categoría (%)",
    escalaMin: null,
    escalaMax: null,
  },
  monthly: {
    tipo: "line",
    etiquetas: ["Oct", "Nov", "Dic", "Ene", "Feb", "Mar"],
    valores: [62, 78, 121, 85, 97, 113],
    label: "Pedidos recibidos",
    titulo: "Tendencia de pedidos — últimos 6 meses",
    escalaMin: 0,
    escalaMax: null,
  },
};

// Instancia activa del gráfico (se destruye y recrea al cambiar vista o tema)
let graficoPrincipal = null;

// ── Lectura de colores desde variables CSS ───────────────────
// Se lee en tiempo de ejecución para adaptarse al tema activo.
function obtenerColores() {
  const estilos = getComputedStyle(document.documentElement);
  const leer = (v) => estilos.getPropertyValue(v).trim();
  return {
    verde: leer("--color-mesa-verde"),
    azul: leer("--color-azul-profundo"),
    rojo: leer("--color-rojo-intenso"),
    amarillo: leer("--color-amarillo-brillante"),
    morado: "#9c27b0",
    naranja: "#ff9800",
    grisTexto: leer("--color-texto-secundario"),
    grisBorde: leer("--color-borde"),
    superficie: leer("--color-superficie"),
    fondoSecund: leer("--color-fondo-secundario"),
    textoPrimario: leer("--color-texto-primario"),
  };
}

// ── Construye la configuración de Chart.js para una vista dada ──
function construirConfig(clave) {
  const datos = datosGraficos[clave];
  const c = obtenerColores();
  const reducirMovimiento = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  // Paleta de colores para gráficos multi-segmento (doughnut)
  const paleta = [c.verde, c.azul, c.rojo, c.amarillo, c.morado, c.naranja];
  const paletaAlpha = paleta.map((color) => color + "cc"); // cc = 80 % opacidad

  // Configuración de dataset adaptada según el tipo
  const dataset = {
    label: datos.label,
    data: datos.valores,
    borderWidth: 2,
    ...(datos.tipo === "bar" && {
      backgroundColor: c.verde + "cc",
      borderColor: c.verde,
      borderRadius: 6,
      borderSkipped: false,
    }),
    ...(datos.tipo === "doughnut" && {
      backgroundColor: paletaAlpha,
      borderColor: paleta,
      hoverOffset: 12,
    }),
    ...(datos.tipo === "line" && {
      backgroundColor: c.azul + "22",
      borderColor: c.azul,
      tension: 0.4,
      fill: true,
      pointBackgroundColor: c.azul,
      pointBorderColor: c.superficie,
      pointBorderWidth: 2,
      pointRadius: 5,
      pointHoverRadius: 7,
    }),
  };

  // Opciones de escalas (solo para bar y line)
  const escalas =
    datos.tipo !== "doughnut"
      ? {
          x: {
            ticks: {
              color: c.grisTexto,
              font: { family: "'Open Sans', sans-serif", size: 12 },
            },
            grid: { color: c.grisBorde },
          },
          y: {
            ticks: {
              color: c.grisTexto,
              font: { family: "'Open Sans', sans-serif", size: 12 },
            },
            grid: { color: c.grisBorde },
            ...(datos.escalaMin !== null && { min: datos.escalaMin }),
            ...(datos.escalaMax !== null && { max: datos.escalaMax }),
          },
        }
      : {};

  return {
    type: datos.tipo,
    data: {
      labels: datos.etiquetas,
      datasets: [dataset],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      // La animación se desactiva completamente si el usuario lo prefiere
      animation: reducirMovimiento
        ? false
        : { duration: 800, easing: "easeInOutQuart" },
      plugins: {
        legend: {
          // La leyenda solo es útil en doughnut (varios segmentos)
          display: datos.tipo === "doughnut",
          labels: {
            color: c.grisTexto,
            padding: 16,
            font: { family: "'Open Sans', sans-serif", size: 13 },
          },
        },
        tooltip: {
          backgroundColor: c.superficie,
          titleColor: datos.tipo === "doughnut" ? c.azul : c.verde,
          bodyColor: c.grisTexto,
          borderColor: c.grisBorde,
          borderWidth: 1,
          padding: 10,
          titleFont: { family: "'Oswald', sans-serif", size: 14 },
          bodyFont: { family: "'Open Sans', sans-serif", size: 13 },
        },
      },
      scales: escalas,
    },
  };
}

// ── Crea (o recrea) el gráfico ───────────────────────────────
function crearGrafico(clave) {
  const canvas = document.getElementById("chartPrincipal");
  if (!canvas || typeof Chart === "undefined") return;

  // Destruir instancia previa si existe para liberar el canvas
  if (graficoPrincipal) {
    graficoPrincipal.destroy();
    graficoPrincipal = null;
  }

  graficoPrincipal = new Chart(canvas, construirConfig(clave));
}

// ── Actualiza el título descriptivo encima del canvas ────────
function actualizarTitulo(clave) {
  const el = document.getElementById("statsTitulo");
  if (el) el.textContent = datosGraficos[clave].titulo;
}

// ── Inicialización principal ─────────────────────────────────
function inicializarGraficos() {
  const canvas = document.getElementById("chartPrincipal");
  if (!canvas) return; // La sección no existe en esta página

  // Vista inicial: valoraciones
  let claveActiva = "ratings";
  crearGrafico(claveActiva);
  actualizarTitulo(claveActiva);

  // Manejador de botones de control
  document.querySelectorAll(".btn-stats").forEach((btn) => {
    btn.addEventListener("click", () => {
      // Actualizar estado visual y ARIA de los botones
      document.querySelectorAll(".btn-stats").forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");

      // Cambiar gráfico y título
      claveActiva = btn.dataset.chart;
      crearGrafico(claveActiva);
      actualizarTitulo(claveActiva);
    });
  });

  // Sincronizar con cambios de tema claro/oscuro
  // Al alternar el tema, las variables CSS cambian y hay que recrear el gráfico.
  const observadorTema = new MutationObserver(() => {
    crearGrafico(claveActiva);
  });
  observadorTema.observe(document.documentElement, {
    attributeFilter: ["class"],
  });
}

// Ejecutar después de que Chart.js esté disponible
// (el script de Chart.js se carga antes del defer de este archivo)
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", inicializarGraficos);
} else {
  inicializarGraficos();
}

// ===================================
// ATAJOS DE TECLADO
// — T : volver al inicio de la página (scroll to top)
// — / : enfocar la barra de búsqueda
// Se ignoran cuando el foco está dentro de un campo de texto.
// ===================================
document.addEventListener("keydown", (e) => {
  // No actuar si el usuario está escribiendo en un campo
  if (isTyping()) return;

  switch (e.key) {
    // T → ir al inicio de la página
    case "t":
    case "T":
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      // Desplazar el foco al skip-link para que lectores de pantalla
      // anuncien la acción (patrón accesible)
      document.querySelector(".skip-link")?.focus();
      break;

    // / → enfocar la barra de búsqueda (como YouTube)
    case "/": {
      const searchInput = document.getElementById("searchInput");
      if (searchInput) {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
      }
      break;
    }
  }
});

// ===================================
// BOTÓN VOLVER ARRIBA
// Aparece cuando el scroll supera 200 px y sube suavemente al inicio.
// ===================================
const btnSubirArriba = document.getElementById("btnSubirArriba");

if (btnSubirArriba) {
  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 200) {
      btnSubirArriba.classList.add("visible");
    } else {
      btnSubirArriba.classList.remove("visible");
    }
  });

  btnSubirArriba.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    // Llevar el foco al skip-link (accesibilidad)
    document.querySelector(".skip-link")?.focus();
  });
}

// ===================================
// NOTIFICACIONES BOOTSTRAP TOAST
// mostrarToast(titulo, mensaje) crea y muestra un Bootstrap Toast
// en el contenedor #toastContainer.
// ===================================
function mostrarToast(titulo, mensaje) {
  const container = document.getElementById("toastContainer");
  if (!container || typeof bootstrap === "undefined") return;

  const id = "toast-" + Date.now();
  const html = `
    <div id="${id}" class="toast toast-billar" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" class="me-2" aria-hidden="true">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <strong class="me-auto">${titulo}</strong>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Cerrar"></button>
      </div>
      <div class="toast-body">${mensaje}</div>
    </div>`;

  container.insertAdjacentHTML("beforeend", html);
  const toastEl = document.getElementById(id);
  const bsToast = new bootstrap.Toast(toastEl, { delay: 3500 });
  bsToast.show();
  // Limpiar el DOM al ocultarse
  toastEl.addEventListener("hidden.bs.toast", () => toastEl.remove());
}

// Notificación al cambiar el tema (el listener de toggleTheme ya se ejecutó antes,
// por lo que classList refleja el tema recién activado).
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const esDark = root.classList.contains("theme-dark");
    mostrarToast("BillarPro", esDark ? "Tema oscuro activado 🌙" : "Tema claro activado ☀️");
  });
}
