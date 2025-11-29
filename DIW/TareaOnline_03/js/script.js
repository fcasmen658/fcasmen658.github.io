// ===================================
// VARIABLES GLOBALES
// ===================================
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const menuIcon = mobileMenuBtn?.querySelector('.menu-icon');
const closeIcon = mobileMenuBtn?.querySelector('.close-icon');
const mobileMenuLabel = mobileMenuBtn?.querySelector('.visually-hidden');
const mobileLinks = document.querySelectorAll('.nav-link-mobile');

// ===================================
// TEMA OSCURO / CLARO
// ===================================
const themeToggle = document.getElementById('themeToggle');
const sunIcon = themeToggle?.querySelector('.sun-icon');
const moonIcon = themeToggle?.querySelector('.moon-icon');
const root = document.documentElement;

// Cargar preferencia guardada o detectar preferencia del sistema
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        enableDarkMode();
    } else {
        enableLightMode();
    }
}

function enableDarkMode() {
    root.classList.add('theme-dark');
    root.classList.remove('theme-light');
    if (sunIcon && moonIcon) {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    }
    localStorage.setItem('theme', 'dark');
}

function enableLightMode() {
    root.classList.remove('theme-dark');
    root.classList.add('theme-light');
    if (sunIcon && moonIcon) {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
    }
    localStorage.setItem('theme', 'light');
}

function toggleTheme() {
    if (root.classList.contains('theme-dark')) {
        enableLightMode();
    } else {
        enableDarkMode();
    }
}

// Inicializar tema al cargar la página
initTheme();

// Event listener para el botón de tema
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

// Escuchar cambios en la preferencia del sistema
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
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

    const isOpen = mobileMenu.classList.contains('active');
    const newState = !isOpen;

    if (newState) {
        mobileMenu.classList.add('active');
        menuIcon.style.display = 'none';
        closeIcon.style.display = 'block';
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
        mobileMenuBtn.setAttribute('aria-label', 'Cerrar menú');
        mobileMenuBtn.setAttribute('title', 'Cerrar menú');
        if (mobileMenuLabel) {
            mobileMenuLabel.textContent = 'Cerrar menú principal';
        }
    } else {
        mobileMenu.classList.remove('active');
        menuIcon.style.display = 'block';
        closeIcon.style.display = 'none';
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.setAttribute('aria-label', 'Abrir menú');
        mobileMenuBtn.setAttribute('title', 'Abrir menú');
        if (mobileMenuLabel) {
            mobileMenuLabel.textContent = 'Abrir menú principal';
        }
    }
}

// Event listener para el botón del menú móvil
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
}

// Cerrar menú cuando se hace clic en un enlace
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (!mobileMenu || !menuIcon || !closeIcon || !mobileMenuBtn) {
            return;
        }
        mobileMenu.classList.remove('active');
        menuIcon.style.display = 'block';
        closeIcon.style.display = 'none';
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.setAttribute('aria-label', 'Abrir menú');
        mobileMenuBtn.setAttribute('title', 'Abrir menú');
        if (mobileMenuLabel) {
            mobileMenuLabel.textContent = 'Abrir menú principal';
        }
    });
});

// ===================================
// SCROLL SUAVE PARA NAVEGACIÓN
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Ignorar si es solo "#"
        if (href === '#') {
            e.preventDefault();
            return;
        }
        
        const target = document.querySelector(href);
        
        if (target) {
            e.preventDefault();
            
            // Calcular offset del header
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// HEADER STICKY CON SOMBRA AL SCROLL
// ===================================
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Agregar/quitar sombra según el scroll
    if (currentScroll > 50) {
        header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
    }
    
    lastScroll = currentScroll;
});

// ===================================
// ANIMACIONES AL HACER SCROLL (OPCIONAL)
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Aplicar animación a las tarjetas de productos
document.querySelectorAll('.product-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
});

// Aplicar animación a las tarjetas de testimonios
document.querySelectorAll('.testimonial-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
});

// ===================================
// FUNCIONALIDAD DEL CARRITO
// ===================================
const cartButtons = document.querySelectorAll('.btn-cart, .btn-success');
const cartBadge = document.querySelector('.cart-badge');
let cartCount = parseInt(cartBadge?.textContent || '0');

cartButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        // Solo prevenir si es un botón de agregar al carrito
        if (this.textContent.includes('Agregar al Carrito')) {
            e.preventDefault();
        }
        
        // Incrementar contador solo si es botón de carrito
        if (this.textContent.includes('Agregar al Carrito')) {
            cartCount++;
            if (cartBadge) {
                cartBadge.textContent = cartCount;
            }
            
            // Animación del botón
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
            
            // Animación del badge del carrito
            if (cartBadge) {
                cartBadge.style.transform = 'scale(1.3)';
                setTimeout(() => {
                    cartBadge.style.transform = 'scale(1)';
                }, 200);
            }
        }
        
        // Notificación visual (opcional)
        showNotification('Producto agregado al carrito');
    });
});

// ===================================
// NOTIFICACIONES
// ===================================
function showNotification(message) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: #2E7D32;
        color: white;
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
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Agregar animaciones CSS para las notificaciones
const style = document.createElement('style');
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
const images = document.querySelectorAll('img[data-src]');

const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// ===================================
// PREVENIR SCROLL HORIZONTAL
// ===================================
document.body.style.overflowX = 'hidden';

// ===================================
// CONSOLE LOG DE BIENVENIDA
// ===================================
console.log('%c¡Bienvenido a BillarPro! 🎱', 'font-size: 20px; color: #2E7D32; font-weight: bold;');
console.log('%cSitio desarrollado con HTML, CSS y JavaScript puro', 'font-size: 14px; color: #1976D2;');
