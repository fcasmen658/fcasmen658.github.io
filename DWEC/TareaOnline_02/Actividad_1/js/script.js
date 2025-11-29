// Función para actualizar el tamaño de la ventana
function updateViewportSize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    document.getElementById('viewport-size').textContent = `${width} × ${height}`;
}

// Función para actualizar la URL actual
function updateCurrentURL() {
    document.getElementById('current-url').textContent = window.location.href;
}

// Función para detectar información del navegador
function updateBrowserInfo() {
    let browserInfo = '';

    if (navigator.userAgentData && navigator.userAgentData.brands) {
        // Usar userAgentData si está disponible (Chrome, Edge)
        const brands = navigator.userAgentData.brands;
        const platform = navigator.userAgentData.platform;
        browserInfo = `${platform} - ${brands.map(b => b.brand).join(', ')}`;
    } else {
        // Fallback a userAgent
        browserInfo = navigator.userAgent;
    }

    document.getElementById('browser-info').textContent = browserInfo;
}

// Función para detectar si es móvil
function updateMobileDetection() {
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    document.getElementById('is-mobile').textContent = isMobile ? 'Sí' : 'No';
}

// Función para actualizar estado de conexión
function updateConnectionStatus() {
    const isOnline = navigator.onLine;
    document.getElementById('connection-status').textContent = isOnline ? 'online' : 'offline';
}

// Función para abrir ayuda (permite volver atrás)
function openHelp() {
    window.location.href = 'https://www.google.com';
}

// Función para salir a Yahoo (no permite volver atrás)
function exitToYahoo() {
    window.location.replace('https://www.yahoo.com');
}

// Inicializar información
function initializePanel() {
    updateViewportSize();
    updateCurrentURL();
    updateBrowserInfo();
    updateMobileDetection();
    updateConnectionStatus();
}

// Event listeners para actualizaciones automáticas
window.addEventListener('resize', updateViewportSize);
window.addEventListener('online', updateConnectionStatus);
window.addEventListener('offline', updateConnectionStatus);

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', initializePanel);