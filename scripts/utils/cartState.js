// scripts/utils/cartState.js — Cart State Manager (DevSpace)
// Single Responsibility: Manages cart data persistence via localStorage

const CART_KEY = "devspace_cart";

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function addGameToCart(game) {
  const cart = getCart();
  if (cart.some((g) => g.id === game.id)) return;
  cart.push(game);
  saveCart(cart);
}

function removeGameFromCart(id) {
  const cart = getCart().filter((g) => g.id !== id);
  saveCart(cart);
}

// Removes only selected purchased items, leaving unselected items in cart
function removeGamesFromCart(idsToRemove) {
  const cart = getCart().filter((g) => !idsToRemove.includes(g.id));
  saveCart(cart);
}

function clearCart() {
  saveCart([]);
}

function updateCartBadge() {
  const badge = document.getElementById("nav-cart-badge");
  if (!badge) return;

  const count = getCart().length;
  badge.textContent = count;
  badge.style.display = count > 0 ? "inline-block" : "none";
}

export {
  getCart,
  addGameToCart,
  removeGameFromCart,
  removeGamesFromCart,
  clearCart,
  updateCartBadge,
};
