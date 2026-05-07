// scripts/components/cartModal.js — Cart Modal UI (DevSpace)
// Single Responsibility: Renders cart items, handles removals, dynamic totals, and routing

import {
  getCart,
  removeGameFromCart,
  updateCartBadge,
} from "../utils/cartState.js";
import { openCheckoutModal } from "./checkoutLogic.js";

function getElement(id) {
  return document.getElementById(id);
}

function parsePrice(priceString) {
  if (!priceString || priceString.toLowerCase() === "free") return 0;
  return parseFloat(priceString.replace(/[^0-9.-]+/g, "")) || 0;
}

function calculateTotal(games) {
  const total = games.reduce((sum, game) => sum + parsePrice(game.price), 0);
  return total === 0 ? "Free" : `$${total.toFixed(2)}`;
}

function buildCartItemHtml(game) {
  return `
    <div class="cart-item">
      <label class="cart-checkbox-label" aria-label="Select ${game.title}">
        <input type="checkbox" class="cart-item-checkbox" value="${game.id}" checked>
        <span class="cart-checkbox-custom"></span>
      </label>
      <div class="cart-item-info">
        <div class="cart-item-title">${game.title}</div>
        <div class="cart-item-genre">${game.genre}</div>
      </div>
      <div class="cart-item-price">${game.price}</div>
      <button class="cart-item-remove" data-id="${game.id}" aria-label="Remove ${game.title}">✕</button>
    </div>
  `;
}

function buildCartModalHtml(cart) {
  if (cart.length === 0) {
    return `
      <div class="modal-header">
        <div class="modal-title">Your Cart</div>
        <button class="modal-close" id="cart-close-btn" aria-label="Close cart">✕</button>
      </div>
      <div class="modal-body" style="text-align: center; color: var(--muted); padding: 3rem 1rem;">
        Your cart is currently empty.
      </div>
    `;
  }

  const itemsHtml = cart.map(buildCartItemHtml).join("");
  const total = calculateTotal(cart);

  return `
    <div class="modal-header">
      <div class="modal-title">Your Cart</div>
      <button class="modal-close" id="cart-close-btn" aria-label="Close cart">✕</button>
    </div>
    <div class="modal-body">
      <div class="cart-items-list">${itemsHtml}</div>
      <div class="cart-total-row">
        <span>Selected Total:</span>
        <span id="cart-dynamic-total" style="color: var(--accent); font-family: var(--font-mono);">${total}</span>
      </div>
      <button class="confirm-btn" id="cart-checkout-btn">
        PROCEED TO CHECKOUT
      </button>
    </div>
  `;
}

function updateCartTotalUI() {
  const modal = getElement("cart-modal");
  if (!modal) return;

  const checkboxes = modal.querySelectorAll(".cart-item-checkbox:checked");
  const selectedIds = Array.from(checkboxes).map((cb) => cb.value);

  const selectedGames = getCart().filter((g) => selectedIds.includes(g.id));

  const totalEl = getElement("cart-dynamic-total");
  const checkoutBtn = getElement("cart-checkout-btn");

  if (totalEl) totalEl.textContent = calculateTotal(selectedGames);

  if (checkoutBtn) {
    checkoutBtn.disabled = selectedGames.length === 0;
    checkoutBtn.textContent =
      selectedGames.length === 0 ? "SELECT ITEMS" : "PROCEED TO CHECKOUT";
  }
}

function closeCartModal() {
  const overlay = getElement("cart-overlay");
  if (!overlay) return;
  overlay.classList.remove("active");
  document.body.style.overflow = "";
}

function attachCartListeners() {
  const overlay = getElement("cart-overlay");
  const closeBtn = getElement("cart-close-btn");
  const checkoutBtn = getElement("cart-checkout-btn");
  const modal = getElement("cart-modal");

  closeBtn?.addEventListener("click", closeCartModal);

  overlay?.addEventListener("click", (e) => {
    if (!modal.contains(e.target)) closeCartModal();
  });

  // Calculate dynamic total when checkboxes are toggled
  modal?.addEventListener("change", (e) => {
    if (e.target.classList.contains("cart-item-checkbox")) {
      updateCartTotalUI();
    }
  });

  // Handle Remove Button clicks
  modal?.addEventListener("click", (e) => {
    if (e.target.classList.contains("cart-item-remove")) {
      const id = e.target.dataset.id;
      removeGameFromCart(id);
      renderCartModal();
    }
  });

  // Gather only selected games and proceed
  checkoutBtn?.addEventListener("click", () => {
    const checkboxes = modal.querySelectorAll(".cart-item-checkbox:checked");
    const selectedIds = Array.from(checkboxes).map((cb) => cb.value);

    if (selectedIds.length === 0) return;

    const selectedGames = getCart().filter((g) => selectedIds.includes(g.id));
    closeCartModal();
    openCheckoutModal(selectedGames);
  });
}

function renderCartModal() {
  const modal = getElement("cart-modal");
  if (!modal) return;
  modal.innerHTML = buildCartModalHtml(getCart());
  attachCartListeners();
}

function openCartModal() {
  const overlay = getElement("cart-overlay");
  if (!overlay) return;
  renderCartModal();
  overlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function initCartUI() {
  updateCartBadge();
  const navCartBtn = getElement("nav-cart-btn");
  navCartBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    openCartModal();
  });
}

export { initCartUI, openCartModal };
