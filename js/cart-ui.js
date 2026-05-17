/**
 * cart-ui.js
 * Módulo ES6 que gestiona toda la UI del carrito de BillarPro:
 *  - Offcanvas lateral (panel del carrito) en todas las páginas.
 *  - Modal Bootstrap de confirmación de eliminación.
 *  - Badge del icono del carrito en el header.
 *  - Botones "Agregar al carrito" (.btn-cart y .btn-add-to-cart).
 *  - Renderizado completo de la página carrito.html (#carritoBody).
 */
import { ShoppingCart } from './ShoppingCart.mjs';

const cart = new ShoppingCart();
let pendingDeleteId = null;

/* ──────────────────────────────────────────────────────────────── */
/*  INYECCIÓN DE HTML GLOBAL                                        */
/* ──────────────────────────────────────────────────────────────── */

function injectOffcanvas() {
  if (document.getElementById('cartOffcanvas')) return;
  const el = document.createElement('div');
  el.className = 'offcanvas offcanvas-end';
  el.tabIndex = -1;
  el.id = 'cartOffcanvas';
  el.setAttribute('aria-labelledby', 'cartOffcanvasLabel');
  el.innerHTML = `
    <div class="offcanvas-header">
      <h5 class="offcanvas-title" id="cartOffcanvasLabel">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" aria-hidden="true"
             style="margin-right:8px;vertical-align:middle">
          <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>Mi Carrito
      </h5>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas"
              aria-label="Cerrar carrito"></button>
    </div>
    <div class="offcanvas-body p-0" id="cartOffcanvasBody"></div>
  `;
  document.body.appendChild(el);
}

function injectDeleteModal() {
  if (document.getElementById('modalEliminarProducto')) return;
  const el = document.createElement('div');
  el.className = 'modal fade';
  el.id = 'modalEliminarProducto';
  el.tabIndex = -1;
  el.setAttribute('aria-labelledby', 'modalEliminarLabel');
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = `
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modalEliminarLabel">Eliminar producto</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"
                  aria-label="Cancelar"></button>
        </div>
        <div class="modal-body">
          ¿Seguro que deseas eliminar
          <strong id="modalProductName"></strong>
          del carrito?
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary"
                  data-bs-dismiss="modal">Cancelar</button>
          <button type="button" class="btn btn-danger"
                  id="modalConfirmDelete">Eliminar</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(el);
}

/* ──────────────────────────────────────────────────────────────── */
/*  BADGE DEL HEADER                                               */
/* ──────────────────────────────────────────────────────────────── */

function updateBadge() {
  const count = cart.getCount();
  document.querySelectorAll('.cart-badge').forEach(badge => {
    badge.textContent = count;
  });
  const cartBtn = document.querySelector('.cart-btn');
  if (cartBtn) {
    cartBtn.setAttribute(
      'aria-label',
      `Carrito de compras (${count} artículo${count !== 1 ? 's' : ''})`
    );
  }
}

/* ──────────────────────────────────────────────────────────────── */
/*  PANEL OFFCANVAS — RENDERIZADO                                   */
/* ──────────────────────────────────────────────────────────────── */

function renderOffcanvas() {
  const body = document.getElementById('cartOffcanvasBody');
  if (!body) return;
  const items = cart.getItems();

  if (items.length === 0) {
    body.innerHTML = `
      <div class="cart-vacio">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
        <p class="mt-3 mb-1 fw-semibold">Tu carrito está vacío</p>
        <p class="text-muted small">Añade productos para comenzar</p>
        <a href="productos.html" class="btn btn-primary btn-sm mt-1"
           data-bs-dismiss="offcanvas">Ver productos</a>
      </div>
    `;
    return;
  }

  let listHtml = '';
  items.forEach(item => {
    listHtml += `
      <li class="cart-panel-item" data-id="${escHtml(item.id)}">
        <img src="${escHtml(item.img)}" alt="${escHtml(item.name)}"
             class="cart-panel-img" loading="lazy">
        <div class="cart-panel-info">
          <span class="cart-panel-name">${escHtml(item.name)}</span>
          <span class="cart-panel-meta">${item.qty} × ${fmtPrecio(item.price)}</span>
        </div>
        <span class="cart-panel-sub">${fmtPrecio(item.price * item.qty)}</span>
        <button class="cart-panel-del" data-id="${escHtml(item.id)}"
                data-name="${escHtml(item.name)}"
                aria-label="Eliminar ${escHtml(item.name)}"
                data-bs-toggle="modal"
                data-bs-target="#modalEliminarProducto">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" aria-hidden="true">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6"/><path d="M14 11v6"/>
            <path d="M9 6V4h6v2"/>
          </svg>
        </button>
      </li>
    `;
  });

  const total = cart.getTotal();
  body.innerHTML = `
    <ul class="cart-panel-list list-unstyled m-0 p-0">${listHtml}</ul>
    <div class="cart-panel-footer">
      <div class="cart-panel-total-row">
        <span>Total</span>
        <strong>${fmtPrecio(total)}</strong>
      </div>
      <a href="carrito.html" class="btn btn-primary w-100 mt-2"
         data-bs-dismiss="offcanvas">Ver carrito completo</a>
      <button class="btn btn-outline-danger w-100 mt-2"
              id="vaciarCarritoPanel">Vaciar carrito</button>
    </div>
  `;

  /* Botones eliminar en el panel */
  body.querySelectorAll('.cart-panel-del').forEach(btn => {
    btn.addEventListener('click', () =>
      prepareDeleteModal(btn.dataset.id, btn.dataset.name)
    );
  });

  /* Vaciar carrito desde el panel */
  const vaciarBtn = document.getElementById('vaciarCarritoPanel');
  if (vaciarBtn) {
    vaciarBtn.addEventListener('click', () => {
      cart.clear();
      updateBadge();
      renderOffcanvas();
    });
  }
}

/* ──────────────────────────────────────────────────────────────── */
/*  MODAL DE ELIMINACIÓN                                            */
/* ──────────────────────────────────────────────────────────────── */

function prepareDeleteModal(id, name) {
  pendingDeleteId = id;
  const nameEl = document.getElementById('modalProductName');
  if (nameEl) nameEl.textContent = name;
}

/* ──────────────────────────────────────────────────────────────── */
/*  BOTÓN DEL CARRITO EN HEADER                                     */
/* ──────────────────────────────────────────────────────────────── */

function wireCartButton() {
  const cartBtn = document.querySelector('.cart-btn');
  if (!cartBtn) return;
  cartBtn.setAttribute('data-bs-toggle', 'offcanvas');
  cartBtn.setAttribute('data-bs-target', '#cartOffcanvas');

  const offcanvasEl = document.getElementById('cartOffcanvas');
  if (offcanvasEl) {
    offcanvasEl.addEventListener('show.bs.offcanvas', renderOffcanvas);
  }
}

/* ──────────────────────────────────────────────────────────────── */
/*  TOAST DE CONFIRMACIÓN                                           */
/* ──────────────────────────────────────────────────────────────── */

function showCartToast(name) {
  /* Intentar usar el sistema de toast global de script.js */
  if (typeof window.mostrarToast === 'function') {
    window.mostrarToast('¡Añadido al carrito! ✓', `${name} se ha añadido a tu carrito.`);
    return;
  }
  /* Fallback: Bootstrap Toast propio */
  let container = document.getElementById('toastContainerCart');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainerCart';
    container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    container.style.zIndex = '1090';
    document.body.appendChild(container);
  }
  const toastEl = document.createElement('div');
  toastEl.className = 'toast align-items-center text-bg-success border-0';
  toastEl.setAttribute('role', 'alert');
  toastEl.setAttribute('aria-live', 'assertive');
  toastEl.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">
        <strong>¡Añadido! ✓</strong><br>${escHtml(name)}
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto"
              data-bs-dismiss="toast" aria-label="Cerrar"></button>
    </div>
  `;
  container.appendChild(toastEl);
  if (window.bootstrap && bootstrap.Toast) {
    const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
    toast.show();
    toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
  }
}

/* ──────────────────────────────────────────────────────────────── */
/*  BOTONES "AGREGAR AL CARRITO"                                    */
/* ──────────────────────────────────────────────────────────────── */

function wireAddToCartButtons() {
  /* Fichas de producto: .btn-add-to-cart */
  document.querySelectorAll('.btn-add-to-cart[data-product-id]').forEach(btn => {
    if (btn.dataset.cartWired) return;
    btn.dataset.cartWired = 'true';

    const { productId: id, productName: name, productPrice: price, productImg: img } = btn.dataset;
    if (!id || !name || !price) return;

    btn.addEventListener('click', () => {
      const qtyInput = document.getElementById('qtyInput');
      const qty = qtyInput ? Math.max(1, parseInt(qtyInput.value) || 1) : 1;
      cart.addItem(id, name, Number(price), img || '', qty);
      updateBadge();
      showCartToast(name);

      /* Retroalimentación visual */
      const svgCart = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" aria-hidden="true">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>`;
      const svgOk = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>`;
      const originalHtml = btn.innerHTML;
      btn.innerHTML = `${svgOk} ¡Añadido!`;
      btn.disabled = true;
      setTimeout(() => {
        btn.innerHTML = originalHtml;
        btn.disabled = false;
      }, 1600);
    });
  });

  /* Listado de productos: .btn-cart */
  document.querySelectorAll('.btn-cart[data-product-id]').forEach(btn => {
    if (btn.dataset.cartWired) return;
    btn.dataset.cartWired = 'true';

    const { productId: id, productName: name, productPrice: price, productImg: img } = btn.dataset;
    if (!id || !name || !price) return;

    btn.addEventListener('click', () => {
      cart.addItem(id, name, Number(price), img || '', 1);
      updateBadge();
      showCartToast(name);

      /* Retroalimentación visual */
      const svgOk = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>`;
      const svgCart = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" aria-hidden="true">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>`;
      btn.classList.add('btn-cart--added');
      btn.innerHTML = `${svgOk} ¡Añadido!`;
      setTimeout(() => {
        btn.classList.remove('btn-cart--added');
        btn.innerHTML = `${svgCart} Agregar al Carrito`;
      }, 1600);
    });
  });
}

/* ──────────────────────────────────────────────────────────────── */
/*  PÁGINA carrito.html                                             */
/* ──────────────────────────────────────────────────────────────── */

function renderCartPage() {
  const carritoBody = document.getElementById('carritoBody');
  if (!carritoBody) return;

  const items = cart.getItems();

  if (items.length === 0) {
    carritoBody.innerHTML = `
      <div class="carrito-vacio text-center py-5">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="1" aria-hidden="true"
             class="mb-3" style="opacity:.35">
          <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
        <h2 class="h4 mb-2">Tu carrito está vacío</h2>
        <p class="text-muted mb-4">Añade productos para comenzar tu compra.</p>
        <a href="productos.html" class="btn btn-primary">Ver productos</a>
      </div>
    `;
    return;
  }

  let rowsHtml = '';
  items.forEach(item => {
    rowsHtml += `
      <tr class="carrito-row" data-id="${escHtml(item.id)}">
        <td class="carrito-td-img">
          <img src="${escHtml(item.img)}" alt="${escHtml(item.name)}"
               class="carrito-product-img" loading="lazy">
        </td>
        <td class="carrito-td-name">
          <span class="carrito-product-name">${escHtml(item.name)}</span>
          <small class="carrito-sku d-block">Ref: ${escHtml(item.id)}</small>
        </td>
        <td class="carrito-td-price">${fmtPrecio(item.price)}</td>
        <td class="carrito-td-qty">
          <div class="qty-ctrl">
            <button class="qty-ctrl-btn" data-id="${escHtml(item.id)}" data-delta="-1"
                    aria-label="Reducir cantidad de ${escHtml(item.name)}">−</button>
            <span class="qty-ctrl-val">${item.qty}</span>
            <button class="qty-ctrl-btn" data-id="${escHtml(item.id)}" data-delta="1"
                    aria-label="Aumentar cantidad de ${escHtml(item.name)}">+</button>
          </div>
        </td>
        <td class="carrito-td-sub fw-bold">${fmtPrecio(item.price * item.qty)}</td>
        <td class="carrito-td-del">
          <button class="btn btn-sm btn-outline-danger carrito-del-btn"
                  data-id="${escHtml(item.id)}" data-name="${escHtml(item.name)}"
                  data-bs-toggle="modal" data-bs-target="#modalEliminarProducto"
                  aria-label="Eliminar ${escHtml(item.name)}">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" aria-hidden="true">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6"/><path d="M14 11v6"/>
              <path d="M9 6V4h6v2"/>
            </svg>
          </button>
        </td>
      </tr>
    `;
  });

  const total = cart.getTotal();
  carritoBody.innerHTML = `
    <div class="carrito-layout">

      <!-- Tabla de productos -->
      <div class="carrito-tabla-wrap">
        <table class="carrito-table" aria-label="Productos en el carrito">
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col">Producto</th>
              <th scope="col">Precio</th>
              <th scope="col">Cantidad</th>
              <th scope="col">Subtotal</th>
              <th scope="col"><span class="visually-hidden">Eliminar</span></th>
            </tr>
          </thead>
          <tbody id="carritoTableBody">${rowsHtml}</tbody>
        </table>

        <div class="carrito-acciones mt-3 d-flex gap-2 flex-wrap">
          <button class="btn btn-outline-danger btn-sm" id="vaciarCarritoBtn">
            Vaciar carrito
          </button>
          <a href="productos.html" class="btn btn-outline-secondary btn-sm">
            Seguir comprando
          </a>
        </div>
      </div>

      <!-- Resumen del pedido -->
      <aside class="carrito-resumen" aria-label="Resumen del pedido">
        <h2 class="resumen-title">Resumen del pedido</h2>
        <div class="resumen-row">
          <span>Subtotal</span>
          <span id="resumenSubtotal">${fmtPrecio(total)}</span>
        </div>
        <div class="resumen-row">
          <span>Envío</span>
          <span class="text-success fw-semibold">Gratis</span>
        </div>
        <hr class="my-2">
        <div class="resumen-row resumen-total">
          <span>Total</span>
          <strong id="resumenTotal">${fmtPrecio(total)}</strong>
        </div>
        <button class="btn btn-primary w-100 mt-3" id="finalizarCompraBtn">
          Finalizar compra
        </button>
        <a href="productos.html" class="btn btn-outline-secondary w-100 mt-2">
          Seguir comprando
        </a>
      </aside>
    </div>
  `;

  wireCartPageButtons();
}

function wireCartPageButtons() {
  /* Controles de cantidad */
  document.querySelectorAll('.qty-ctrl-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const delta = parseInt(btn.dataset.delta);
      const item = cart.getItems().find(i => i.id === id);
      if (!item) return;
      const newQty = item.qty + delta;
      if (newQty <= 0) {
        /* Pedir confirmación antes de eliminar */
        prepareDeleteModal(id, item.name);
        if (window.bootstrap && bootstrap.Modal) {
          const modalEl = document.getElementById('modalEliminarProducto');
          if (modalEl) bootstrap.Modal.getOrCreateInstance(modalEl).show();
        }
      } else {
        cart.updateQty(id, newQty);
        updateBadge();
        renderCartPage();
      }
    });
  });

  /* Botones eliminar de la tabla */
  document.querySelectorAll('.carrito-del-btn').forEach(btn => {
    btn.addEventListener('click', () =>
      prepareDeleteModal(btn.dataset.id, btn.dataset.name)
    );
  });

  /* Vaciar carrito */
  const vaciarBtn = document.getElementById('vaciarCarritoBtn');
  if (vaciarBtn) {
    vaciarBtn.addEventListener('click', () => {
      if (confirm('¿Seguro que deseas vaciar todo el carrito?')) {
        cart.clear();
        updateBadge();
        renderCartPage();
      }
    });
  }

  /* Finalizar compra (dummy) */
  const finalizarBtn = document.getElementById('finalizarCompraBtn');
  if (finalizarBtn) {
    finalizarBtn.addEventListener('click', () => {
      alert('¡Gracias por tu pedido! La pasarela de pago estará disponible próximamente.');
    });
  }
}

/* ──────────────────────────────────────────────────────────────── */
/*  UTILIDADES                                                      */
/* ──────────────────────────────────────────────────────────────── */

/** Formatea un precio en euros con separador de miles. */
function fmtPrecio(n) {
  return Number(n).toLocaleString('es-ES') + '€';
}

/** Escapa caracteres HTML para evitar XSS en contenido dinámico. */
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ──────────────────────────────────────────────────────────────── */
/*  INICIALIZACIÓN                                                  */
/* ──────────────────────────────────────────────────────────────── */

/* Los módulos son diferidos por defecto: el DOM ya está listo
   cuando este código se ejecuta, pero DOMContentLoaded aún no
   ha disparado, así que podemos escucharlo de forma segura. */
function init() {
  injectOffcanvas();
  injectDeleteModal();
  updateBadge();
  wireCartButton();
  wireAddToCartButtons();
  renderCartPage(); /* Solo actúa si existe #carritoBody */

  /* Confirmar eliminación desde el modal */
  const confirmBtn = document.getElementById('modalConfirmDelete');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      if (!pendingDeleteId) return;
      cart.removeItem(pendingDeleteId);
      pendingDeleteId = null;
      updateBadge();
      renderOffcanvas();
      renderCartPage();
      if (window.bootstrap && bootstrap.Modal) {
        const modalEl = document.getElementById('modalEliminarProducto');
        if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();
      }
    });
  }

  /* Escuchar actualizaciones del carrito (p. ej. desde otras pestañas) */
  window.addEventListener('storage', e => {
    if (e.key === ShoppingCart.KEY) {
      cart._items = ShoppingCart._load();
      updateBadge();
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
