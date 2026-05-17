/**
 * interactive-features.js — BillarPro
 *
 * Tres funcionalidades interactivas:
 *   1. Valoración interactiva con estrellas  → páginas de detalle de producto
 *   2. Leer más / Leer menos                → tarjetas del catálogo productos.html
 *   3. Panel de especificaciones expandible → tarjetas del catálogo productos.html
 *
 * Accesibilidad: aria-expanded, aria-live, aria-pressed, role, aria-label en todo.
 */

'use strict';

/* ============================================================
   1. VALORACIÓN INTERACTIVA CON ESTRELLAS
   ============================================================
   Permite al usuario valorar un producto (1–5 estrellas).
   La valoración se persiste en localStorage por product-id.
   Feedback inmediato con aria-live="polite".
   ============================================================ */

function initStarRating() {
  document.querySelectorAll('.star-rating-interactive').forEach(function (group) {
    const productId = group.dataset.productId;
    const stars = Array.from(group.querySelectorAll('.rating-star-btn'));
    const feedback = group.parentElement
      ? group.parentElement.querySelector('.rating-feedback')
      : null;

    // Recuperar valoración previa de localStorage
    const saved = parseInt(localStorage.getItem('bp_rating_' + productId), 10) || 0;
    if (saved > 0) {
      _highlightStars(stars, saved);
      group.dataset.currentRating = saved;
      stars.forEach(function (s, i) {
        s.setAttribute('aria-pressed', String(parseInt(s.dataset.value, 10) === saved));
      });
    }

    stars.forEach(function (star) {
      const val = parseInt(star.dataset.value, 10);

      // Hover: previsualización
      star.addEventListener('mouseenter', function () {
        _highlightStars(stars, val);
      });
      star.addEventListener('mouseleave', function () {
        const current = parseInt(group.dataset.currentRating, 10) || 0;
        _highlightStars(stars, current);
      });

      // Clic: guardar valoración
      star.addEventListener('click', function () {
        group.dataset.currentRating = val;
        _highlightStars(stars, val);
        localStorage.setItem('bp_rating_' + productId, val);

        // Actualizar aria-pressed en todas las estrellas
        stars.forEach(function (s) {
          s.setAttribute('aria-pressed', String(parseInt(s.dataset.value, 10) === val));
        });

        // Feedback textual accesible
        if (feedback) {
          const labels = ['', 'Muy malo', 'Malo', 'Aceptable', 'Bueno', 'Excelente'];
          feedback.textContent =
            '¡Gracias! Valoraste este producto con ' +
            val +
            ' estrella' +
            (val > 1 ? 's' : '') +
            ': ' +
            labels[val];
          feedback.classList.add('visible');
        }
      });

      // Teclado: Espacio y Enter son gestionados de forma nativa por <button>
    });
  });
}

/** Pone en estado .active las estrellas hasta `value`. */
function _highlightStars(stars, value) {
  stars.forEach(function (star) {
    star.classList.toggle('active', parseInt(star.dataset.value, 10) <= value);
  });
}

/* ============================================================
   2. LEER MÁS / LEER MENOS
   ============================================================
   Expande / contrae el extracto de descripción de una tarjeta.
   aria-expanded refleja el estado para lectores de pantalla.
   ============================================================ */

function initReadMore() {
  document.querySelectorAll('.read-more-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const targetId = btn.getAttribute('aria-controls');
      const excerpt = targetId ? document.getElementById(targetId) : null;
      if (!excerpt) return;

      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      excerpt.classList.toggle('expanded', !expanded);
      btn.textContent = expanded ? 'Leer más ▼' : 'Leer menos ▲';
    });
  });
}

/* ============================================================
   3. PANEL DE ESPECIFICACIONES RÁPIDAS EXPANDIBLE
   ============================================================
   Muestra / oculta un panel con las specs clave del producto.
   Usa el atributo hidden nativo para compatibilidad máxima.
   ============================================================ */

function initQuickSpecs() {
  document.querySelectorAll('.quick-specs-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const targetId = btn.getAttribute('aria-controls');
      const panel = targetId ? document.getElementById(targetId) : null;
      if (!panel) return;

      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      panel.hidden = expanded;
      btn.querySelector('.toggle-text').textContent = expanded
        ? '+ Ver especificaciones'
        : '− Ocultar especificaciones';
    });
  });
}

/* ============================================================
   INICIO
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {
  initStarRating();
  initReadMore();
  initQuickSpecs();
});
