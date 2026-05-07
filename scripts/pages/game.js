// scripts/pages/game.js — Game Detail Page Orchestrator (DevSpace)
// Single Responsibility: Fetches game by ID and coordinates detail page rendering

import { fetchGameById } from "../api/data.js";
import { buildDetailPageHtml } from "./gameTemplates.js";
import { openCheckoutModal } from "../components/checkoutLogic.js";
import { initCartUI } from "../components/cartModal.js";
import { addGameToCart } from "../utils/cartState.js";

function getGameIdFromUrl() {
  return new URLSearchParams(window.location.search).get("id");
}

function showNotFound(container) {
  container.innerHTML = `
    <div class="page-loading">
      <div style="font-family: 'Bebas Neue', sans-serif; font-size: 3rem; color: var(--muted);">GAME NOT FOUND</div>
      <a href="index.html" style="color: var(--accent); font-size: 0.85rem;">← Back to Games</a>
    </div>
  `;
}

function attachPurchaseEvents(game) {
  const buyBtn = document.getElementById("buy-button");
  const cartBtn = document.getElementById("add-cart-button");

  // Buy Now passes a single-item array directly to checkout
  buyBtn?.addEventListener("click", () => openCheckoutModal([game]));

  cartBtn?.addEventListener("click", () => {
    addGameToCart(game);

    // Quick UI feedback
    const originalText = cartBtn.textContent;
    cartBtn.textContent = "ADDED ✓";
    cartBtn.style.borderColor = "var(--accent)";
    cartBtn.style.color = "var(--accent)";

    setTimeout(() => {
      cartBtn.textContent = originalText;
      cartBtn.style.borderColor = "";
      cartBtn.style.color = "";
    }, 1500);
  });
}

async function initGameDetailPage() {
  const container = document.getElementById("game-page");
  const gameId = getGameIdFromUrl();

  if (!gameId) {
    showNotFound(container);
    return;
  }

  const game = await fetchGameById(gameId);

  if (!game) {
    showNotFound(container);
    return;
  }

  document.title = `DevSpace — ${game.title}`;
  container.innerHTML = buildDetailPageHtml(game);

  attachPurchaseEvents(game);
  initCartUI(); // Boot up the cart nav icon
}

initGameDetailPage();
