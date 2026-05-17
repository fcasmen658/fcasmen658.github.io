/**
 * ShoppingCart.mjs
 * Clase ES Module para gestionar el carrito de compras de BillarPro.
 * Persiste los datos en localStorage con clave "billarpro_cart".
 */
export class ShoppingCart {
  static KEY = 'billarpro_cart';

  constructor() {
    this._items = ShoppingCart._load();
  }

  /** Carga los items desde localStorage de forma segura. */
  static _load() {
    try {
      const data = localStorage.getItem(ShoppingCart.KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  /** Guarda los items en localStorage y emite el evento cart:update. */
  _save() {
    localStorage.setItem(ShoppingCart.KEY, JSON.stringify(this._items));
    document.dispatchEvent(new CustomEvent('cart:update', { detail: this }));
  }

  /**
   * Añade un producto al carrito.
   * Si ya existe (mismo id) incrementa la cantidad.
   * @param {string} id - Identificador único del producto (SKU).
   * @param {string} name - Nombre del producto.
   * @param {number} price - Precio unitario en €.
   * @param {string} img - Ruta de la imagen.
   * @param {number} [qty=1] - Cantidad a añadir.
   */
  addItem(id, name, price, img, qty = 1) {
    const existing = this._items.find(item => item.id === id);
    if (existing) {
      existing.qty += Number(qty);
    } else {
      this._items.push({
        id: String(id),
        name: String(name),
        price: Number(price),
        img: String(img),
        qty: Number(qty)
      });
    }
    this._save();
  }

  /**
   * Elimina un producto del carrito por su id.
   * @param {string} id
   */
  removeItem(id) {
    this._items = this._items.filter(item => item.id !== id);
    this._save();
  }

  /**
   * Actualiza la cantidad de un producto.
   * Si qty <= 0 elimina el producto.
   * @param {string} id
   * @param {number} qty
   */
  updateQty(id, qty) {
    const newQty = Number(qty);
    if (newQty <= 0) {
      this.removeItem(id);
      return;
    }
    const item = this._items.find(i => i.id === id);
    if (item) {
      item.qty = newQty;
      this._save();
    }
  }

  /** Vacía el carrito completamente. */
  clear() {
    this._items = [];
    this._save();
  }

  /** @returns {Array} Copia del array de items. */
  getItems() {
    return [...this._items];
  }

  /** @returns {number} Número total de unidades en el carrito. */
  getCount() {
    return this._items.reduce((sum, item) => sum + item.qty, 0);
  }

  /** @returns {number} Precio total del carrito en €. */
  getTotal() {
    return this._items.reduce((sum, item) => sum + item.price * item.qty, 0);
  }
}
